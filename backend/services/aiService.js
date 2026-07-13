const contentValidator = require('./contentValidator');

function parseAIJson(generatedText) {
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

async function callDeepSeek(prompt) {
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) throw new Error("DeepSeek API key missing.");
    
    console.log("Attempting DeepSeek generation...");
    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful assistant that strictly outputs valid JSON matching the requested schema." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch from DeepSeek: ${errorText}`);
    }

    const aiResponse = await response.json();
    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
        throw new Error("Invalid response from DeepSeek: " + JSON.stringify(aiResponse));
    }

    const generatedText = aiResponse.choices[0].message.content.trim();
    return parseAIJson(generatedText);
}

async function callGemini(prompt) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("Gemini API key is not configured.");

    console.log("Attempting Gemini fallback generation...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: {
                parts: [{ text: "You are a helpful assistant that strictly outputs valid JSON matching the requested schema." }]
            },
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch from Gemini: ${errorText}`);
    }

    const aiResponse = await response.json();
    if (!aiResponse.candidates || !aiResponse.candidates[0] || !aiResponse.candidates[0].content) {
        throw new Error("Invalid response from Gemini: " + JSON.stringify(aiResponse));
    }

    const generatedText = aiResponse.candidates[0].content.parts[0].text.trim();
    return parseAIJson(generatedText);
}

async function executeAIFlow(prompt) {
    try {
        return await callDeepSeek(prompt);
    } catch (error) {
        console.warn(`DeepSeek failed: ${error.message}. Falling back to Gemini...`);
        return await callGemini(prompt);
    }
}

function buildGeminiPrompt({ pageTitle, pageType, category, template }, correctionNotes = "") {
    let prompt = `
You are an industrial SEO content writer.

You are NOT a web designer or frontend developer.

A fixed webpage template has already been selected by the application.

SELECTED TEMPLATE:
ID: ${template.id}
Name: ${template.name}

PAGE INFORMATION:
Page title: ${pageTitle}
Page type: ${pageType || "Article"}
Category: ${category || "Manufacturing"}

YOUR TASK:
Generate only the textual content required by the selected template.

STRICT RULES:
1. Return only valid JSON.
2. Do not return markdown.
3. Do not use code fences.
4. Do not generate HTML.
5. Do not generate CSS.
6. Do not generate JavaScript.
7. Do not create or change the page layout.
8. Do not add fields that are not present in the schema.
9. Do not remove any required field.
10. Follow all word limits.
11. Return the exact number of requested array items.
12. Keep every section directly relevant to the page title.
13. Do not invent customers, certifications, results, percentages or statistics.
14. Avoid repeated headings and paragraphs.
15. Use professional, clear and conversion-focused industrial language.

TEMPLATE PURPOSE:
${template.promptInstructions}

EXACT REQUIRED JSON SCHEMA:
${JSON.stringify(template.outputExample, null, 2)}

Return only the completed JSON object.
`;

    if (correctionNotes) {
        prompt += `\n\nCORRECTION REQUIRED FROM PREVIOUS ATTEMPT:\n${correctionNotes}\nDo NOT repeat this error.`;
    }

    return prompt;
}

module.exports = {
    async generateContent({ pageTitle, pageType, category, template }) {
        console.log(`[Attempt 1] Generating content for template: ${template.id}`);
        const prompt = buildGeminiPrompt({ pageTitle, pageType, category, template });
        let parsedJson;

        try {
            parsedJson = await executeAIFlow(prompt);
            contentValidator.validate(parsedJson, template.outputExample);
            return parsedJson;
        } catch (error) {
            console.warn(`[Attempt 1 Failed] JSON validation or API error: ${error.message}`);
            console.log(`[Attempt 2] Retrying generation with correction prompt...`);
            
            const retryPrompt = buildGeminiPrompt({ pageTitle, pageType, category, template }, error.message);
            parsedJson = await executeAIFlow(retryPrompt);
            
            contentValidator.validate(parsedJson, template.outputExample);
            return parsedJson;
        }
    }
};
