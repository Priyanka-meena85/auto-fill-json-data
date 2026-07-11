const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const templateConfig = {
  ifactory: {
    blog: [
      "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"
    ]
  },
  oxmaint: {
    blog: [
      "blog.html",
      "blog2.html"
    ],
    article: [
      "article.html"
    ],
    caseStudy: [
      "case-study.html"
    ]
  }
};

/**
 * Extract available template pool based on website and page type.
 */
function getTemplatePool(website, pageType) {
    if (!templateConfig[website]) return [];
    
    // Normalize page type slightly (e.g. "case study" -> "caseStudy")
    let normalizedType = (pageType || "blog").toLowerCase();
    if (normalizedType === "case study" || normalizedType === "case-study") {
        normalizedType = "caseStudy";
    }

    return templateConfig[website][normalizedType] || [];
}

/**
 * Randomly select a template, avoiding the previous one if multiple exist.
 */
function selectRandomTemplate(templatePool, previousTemplate) {
    if (!templatePool || templatePool.length === 0) return null;
    if (templatePool.length === 1) return templatePool[0];

    // Filter out previous template to avoid consecutive repeats
    let availableTemplates = templatePool;
    if (previousTemplate) {
        availableTemplates = templatePool.filter(t => t !== previousTemplate);
        if (availableTemplates.length === 0) {
            availableTemplates = templatePool; // fallback if filtering removed all
        }
    }

    const randomIndex = Math.floor(Math.random() * availableTemplates.length);
    return availableTemplates[randomIndex];
}

/**
 * Safely reads the template file from the prompts directory.
 */
function readTemplateFile(website, templateName) {
    // Validate arguments to prevent traversal
    if (!website || !templateName) {
        throw new Error("Website or template name missing.");
    }
    
    // Sanitize templateName to prevent path traversal (e.g., ../ or ../../)
    const sanitizedTemplateName = path.basename(templateName);
    const safeWebsite = path.basename(website);
    
    const templatePath = path.join(__dirname, 'prompts', safeWebsite, sanitizedTemplateName);
    
    // Check if the file exists
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at: ${templatePath}`);
    }
    
    return fs.readFileSync(templatePath, 'utf8');
}

/**
 * Builds the AI generation prompt combining data, template, and instructions.
 */
function buildGenerationPrompt(pageData, templateContent, templateName, website) {
    const brandContext = website === "ifactory" 
        ? "https://ifactoryapp.com/ - Focus on Industry 4.0, AI-driven predictive maintenance, smart factory analytics, and enterprise manufacturing efficiency. Tone: professional, technical, authoritative."
        : "oxmaint.ai - Focus on CMMS, daily maintenance checklists, work order management, facility safety, and operational efficiency. Tone: practical, actionable, authoritative.";

    return `
You are an elite, world-class SEO content generator and expert UI/UX web designer.
I am providing you with a JSON object containing raw data for a page, and an HTML template.

Brand Context: ${brandContext}

Input Data:
${JSON.stringify(pageData, null, 2)}

Template Name: ${templateName}

INSTRUCTIONS:
Use the supplied template as the primary structure for the generated page.
Preserve the overall layout hierarchy, section sequence, heading structure,
CTA positions, card pattern, FAQ placement, and component arrangement.
Replace only the placeholder or topic-specific content.
Do not copy irrelevant content from the template.
Generate unique, professional, SEO-friendly content according to the supplied
page title and metadata.
Do not remove mandatory sections from the selected template.

CRITICAL MOBILE BUTTON RESPONSIVENESS: On mobile screens (e.g., max-width 768px), ALL CTA buttons MUST appear in two separate rows (stack vertically), taking 100% width each, with proper spacing between them. You MUST add the necessary responsive CSS media queries to enforce this behavior without affecting the desktop layout.

Return the result in the exact JSON schema expected by the existing frontend:
{
    "url": "seo-friendly-url-slug",
    "title": "SEO Optimized Page Title",
    "description": "Compelling meta description under 160 characters",
    "type": "Article",
    "keywords": "comma, separated, keywords",
    "content": "Full HTML content string here...",
    "image": "image-url-with-3-2-ratio.jpg"
}
Return ONLY a valid JSON object matching exactly this schema, with no markdown formatting or extra text.

Template Content:
${templateContent}
`;
}

/**
 * Calls the AI API with the constructed payload.
 */
async function generatePageWithAI(payload) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        throw new Error("API key is not configured on the server.");
    }

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
                { role: "user", content: payload }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch from AI provider: ${errorText}`);
    }

    const aiResponse = await response.json();
    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
        throw new Error("Invalid response from AI: " + JSON.stringify(aiResponse));
    }

    let generatedText = aiResponse.choices[0].message.content.trim();
    let parsedJson = null;

    try {
        if (generatedText.startsWith("```json")) {
            generatedText = generatedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (generatedText.startsWith("```")) {
            generatedText = generatedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }
        parsedJson = JSON.parse(generatedText);
    } catch (e) {
        console.log("Direct JSON parse failed, attempting regex extraction...");
        const match = generatedText.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                parsedJson = JSON.parse(match[0]);
            } catch (e2) {
                throw new Error("Failed to parse extracted JSON.");
            }
        } else {
            throw new Error("No JSON object found in AI response.");
        }
    }

    return parsedJson;
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running successfully");
});

app.post('/generate-page', async (req, res) => {
    try {
        const inputData = req.body.data || req.body;
        const hostname = req.body.hostname || inputData.website || "ifactoryapp.com";
        const pageType = req.body.pageType || inputData.pageType || "blog";
        const previousTemplate = req.body.previousTemplate || inputData.previousTemplate || null;

        if (!inputData) {
            return res.status(400).json({ success: false, error: "Missing JSON data in request body." });
        }

        // Determine website identifier
        const website = hostname.includes("oxmaint") ? "oxmaint" : "ifactory";

        console.log("--- Generation Request ---");
        console.log(`Website: ${website}`);
        console.log(`Page Type: ${pageType}`);

        // 1. Get template pool
        const templatePool = getTemplatePool(website, pageType);
        console.log(`Available templates count: ${templatePool.length}`);

        if (templatePool.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: `No templates found for website: ${website} and pageType: ${pageType}` 
            });
        }

        // 2. Randomly select template
        const selectedTemplate = selectRandomTemplate(templatePool, previousTemplate);
        console.log(`Selected template name: ${selectedTemplate}`);

        // 3. Read template content
        let templateContent = "";
        try {
            templateContent = readTemplateFile(website, selectedTemplate);
        } catch (err) {
            console.error("Template read error:", err.message);
            return res.status(404).json({ success: false, error: "Selected template file could not be read." });
        }

        // Generate or fetch image URL
        let generatedImageUrl = "";
        let imageBase64 = "";
        try {
            if (inputData.image && inputData.image.startsWith("http")) {
                generatedImageUrl = inputData.image;
            } else {
                const topic = inputData.topic || inputData.title || inputData.heading || 'Industrial Manufacturing AI';
                const imagePrompt = `A highly professional, ultra-realistic daylight photograph of modern industrial workers in a bright, clean factory. The workers are wearing hard hats and looking at a high-tech digital tablet or dashboard. An advanced AI vision camera is visible in the background. The scene is related to ${topic}. DO NOT INCLUDE ANY TEXT OR WORDS IN THE IMAGE to avoid spelling errors. The image must be hyper-detailed and corporate.`;
                generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=800&nologo=true`;
            }

            const imgRes = await fetch(generatedImageUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                imageBase64 = Buffer.from(arrayBuffer).toString('base64');
            }
        } catch (err) {
            console.error("Error generating/fetching image:", err);
        }

        // 4. Build Prompt
        const aiPrompt = buildGenerationPrompt(inputData, templateContent, selectedTemplate, website);

        // 5. Generate Page
        console.log("API Generation Status: Started...");
        const generatedData = await generatePageWithAI(aiPrompt);
        console.log("API Generation Status: Completed successfully.");

        // Augment generated data
        generatedData.image = generatedImageUrl;
        generatedData.imageBase64 = imageBase64;

        // Return new schema
        res.json({
            success: true,
            selectedTemplate: selectedTemplate,
            data: generatedData
        });

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ success: false, error: "Internal server error: " + error.message });
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
