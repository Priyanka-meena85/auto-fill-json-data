const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const getoxmaintPrompt = require('./prompts/oxmaint/oxmaint');
const getIfactoryappPrompt = require('./prompts/ifactory/ifactoryapp');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running successfully");
});

app.post('/generate-page', async (req, res) => {
    try {
        const inputData = req.body.data;
        const hostname = req.body.hostname || "ifactoryapp.com";

        if (!inputData) {
            return res.status(400).json({ error: "Missing JSON data in request body." });
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API key is not configured on the server." });
        }

        let generatedImageUrl = "";
        let imageBase64 = "";
        try {
            if (inputData.image && inputData.image.startsWith("http")) {
                // If an image URL is already provided in the JSON, fetch and use that exact image!
                console.log("Using provided image URL:", inputData.image);
                generatedImageUrl = inputData.image;
            } else {
                // Otherwise, generate a new image using Pollinations AI
                const topic = inputData.topic || inputData.title || inputData.heading || 'Industrial Manufacturing AI';
                const imagePrompt = `A highly professional, ultra-realistic daylight photograph of modern industrial workers in a bright, clean factory. The workers are wearing hard hats and looking at a high-tech digital tablet or dashboard. An advanced AI vision camera is visible in the background. The scene is related to ${topic}. DO NOT INCLUDE ANY TEXT OR WORDS IN THE IMAGE to avoid spelling errors. The image must be hyper-detailed and corporate.`;

                generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=800&nologo=true`;
                console.log("Generated Image URL (Pollinations):", generatedImageUrl);
            }

            const imgRes = await fetch(generatedImageUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                imageBase64 = Buffer.from(arrayBuffer).toString('base64');
            }
        } catch (err) {
            console.error("Error generating/fetching image:", err);
        }

        // Get a random template for the specific industry
        let templateHTML = "";
        let templateDir = "";

        if (hostname.includes("oxmaint")) {
            templateDir = "C:\\Users\\User\\OneDrive\\Desktop\\oxmaint";
        } else {
            templateDir = path.join(__dirname, '../ifactory');
        }

        try {
            let files = [];
            function getFiles(dir) {
                if (!fs.existsSync(dir)) return;
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        getFiles(fullPath);
                    } else {
                        files.push(fullPath);
                    }
                }
            }
            getFiles(templateDir);

            if (files.length > 0) {
                const randomFile = files[Math.floor(Math.random() * files.length)];
                console.log("Using template:", randomFile);
                templateHTML = fs.readFileSync(randomFile, 'utf8');
            }
        } catch (err) {
            console.error("Error reading template files:", err);
        }

        // Construct the prompt for the AI
        let prompt = "";

        if (hostname.includes("oxmaint")) {
            prompt = getoxmaintPrompt(inputData, templateHTML);
        } else {
            prompt = getIfactoryappPrompt(inputData, templateHTML);
        }

        // Using fetch to call DeepSeek API
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates valid JSON only." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DeepSeek API Error:", errorText);
            return res.status(response.status).json({ error: "Failed to fetch from AI provider." });
        }

        const aiResponse = await response.json();

        if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
            throw new Error("Invalid response from AI: " + JSON.stringify(aiResponse));
        }

        // Extract content and parse JSON (cleaning markdown block if present)
        let generatedText = aiResponse.choices[0].message.content.trim();

        let parsedJson = null;
        try {
            // First attempt: try to parse the entire text (if it's already pure JSON)
            if (generatedText.startsWith("```json")) {
                generatedText = generatedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            } else if (generatedText.startsWith("```")) {
                generatedText = generatedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
            }
            parsedJson = JSON.parse(generatedText);
        } catch (e) {
            console.log("Direct JSON parse failed, attempting regex extraction...");
            // Fallback: extract substring between first { and last }
            const match = generatedText.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    parsedJson = JSON.parse(match[0]);
                } catch (e2) {
                    throw new Error("Failed to parse extracted JSON. Raw text snippet: " + generatedText.substring(0, 200));
                }
            } else {
                throw new Error("No JSON object found in AI response. Raw text snippet: " + generatedText.substring(0, 200));
            }
        }

        parsedJson.image = generatedImageUrl;
        parsedJson.imageBase64 = imageBase64;
        console.log("AI Generated Data successfully parsed!");
        res.json(parsedJson);

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal server error: " + error.message });
    }
});

app.get('/fetch-image', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        if (!imageUrl) return res.status(400).send("Missing url parameter");

        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");

        const arrayBuffer = await response.arrayBuffer();
        res.set('Content-Type', 'image/jpeg');
        res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        console.error("Image proxy error:", error);
        res.status(500).send("Failed to proxy image");
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
