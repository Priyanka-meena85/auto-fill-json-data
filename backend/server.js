const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

        // Use pollinations.ai for guaranteed free image generation
        let generatedImageUrl = "";
        let imageBase64 = "";
        try {
            const topic = inputData.topic || inputData.title || inputData.heading || 'Industrial Manufacturing AI';
            const imagePrompt = `A photorealistic image of an industrial worker in a modern manufacturing plant wearing a hard hat, looking at a very large digital dashboard screen overlay. The dashboard has high-tech UI elements, charts, and the bold text related to: ${topic}. The background shows advanced factory machinery, pipes, and robotic arms in a clean, brightly lit industrial setting.`;
            
            generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=800&nologo=true`;
            console.log("Generated Image URL (Pollinations):", generatedImageUrl);

            const imgRes = await fetch(generatedImageUrl);
            if (imgRes.ok) {
                const arrayBuffer = await imgRes.arrayBuffer();
                imageBase64 = Buffer.from(arrayBuffer).toString('base64');
            }
        } catch (err) {
            console.error("Error generating/fetching image:", err);
        }

        // Construct the prompt for the AI
        let prompt = "";
        
        if (hostname.includes("oxmaint")) {
            prompt = `
You are an expert SEO content generator and web designer. 
I am providing you with a JSON object containing raw data for a page.

Your task is to:
1. Do market research on this topic.
2. Based on that research, create an SEO-optimized, highly informative, and traffic-focused case study/blog/checklist page for our website oxmaint.ai.
3. Return ONLY a valid JSON object matching exactly this schema, with no markdown formatting or extra text:

{
    "url": "seo-friendly-url-slug",
    "title": "SEO Optimized Page Title",
    "description": "Compelling meta description under 160 characters",
    "type": "Article",
    "keywords": "comma, separated, keywords",
    "content": "Full HTML content string here...",
    "image": "image-url-with-3-2-ratio.jpg"
}

STRICT CONTENT & STRUCTURE RULES:
- CRITICAL: The content MUST be EXTREMELY LONG (Minimum 2000 words). Do NOT write short summaries. Expand deeply on every single section with detailed paragraphs, real-world data, and deep analysis. Write as much detailed text as possible.
- You MUST include: responsive tables, graphs (HTML/CSS representation), real data, and an "Expert Review" section on EVERY page.
- Do not copy the same structure from any samples. Create a completely different structure for each page.
- Give highly visualized designs, visually engaging infographics structures to represent the information beautifully.
- Start the content with a <p> tag and end with a <style> tag.
- CRITICAL: First paragraph MUST be exactly 5 to 7 lines long (approximately 80 to 120 words). You must write enough content to ensure the first paragraph is lengthy and detailed, never short.
- Add a hyperlink in the first paragraph. Highlight text link in first paragraph.
- Add FAQs. FAQ answers should be exactly 3 to 4 lines maximum. FAQs must contain hyperlinks. Highlight text links in all FAQs.
- Minimum 2 CTA sections and MAXIMUM 3 CTA sections per page.
- CRITICAL: Keep all CTA sections extremely minimal. The CTA section MUST be its own separate, dedicated HTML section.
- DO NOT put CTA buttons inside educational or informative sections. 
- The ONLY text allowed inside a CTA section is one short headline (e.g., "Ready to optimize?") and a max 1-sentence subtitle. DO NOT add paragraphs of text inside the CTA block.
- Every CTA section MUST have BOTH buttons: "Sign Up" (https://app.oxmaint.ai) and "Book a Demo" (https://calendly.com/oxmaintapp/30min).
- Mainly focus on Book a Demo.
- CRITICAL: Center-align all CTA sections and buttons. Use 'justify-content: center' and 'gap: 15px' for button containers.
- CRITICAL: Do NOT use ANY <img> tags in the HTML content. ABSOLUTELY NO IMAGES in the code.
- Do not use emojis or icons (use only CSS icons & numbers).
- Do not add HTML boilerplate (no html, head, body tags).

STRICT CSS & DESIGN RULES:
- Primary colors: #152277 and #fab758.
- Use different text and bg color for buttons compared to the CTA section background color.
- MUST use different colors for CTA buttons on HOVER. Use correct hover effect & alignment on buttons.
- Add border-radius in ALL sections. Make the whole corners rounded.
- Do NOT use max-width. Make everything 100% width fluid.
- Ensure all tables and content are completely device responsive.
- Do NOT use h1 tag.
- Do NOT use font-family, font-size, JavaScript, or extra margin/padding.
- Keep the standard font size which is readable to people of all ages.
- Do NOT use inline CSS anywhere.
- Do NOT use CSS and HTML body tag.
- Do NOT use comments in code.
- Do NOT add any CSS in hyperlinks without a class name.
- Do NOT use padding more than 20px at y-axis (top and bottom) and 18px at x-axis (left and right) in main sections.
- In mobile view: do NOT use side padding more than 12px.
- Use correct alignment of CTA buttons and cards in all devices.

YOU MUST USE THIS EXACT CSS PATTERN TO PREVENT RESPONSIVE ISSUES:
.section-wrapper { width: 100%; box-sizing: border-box; padding: 20px 18px; margin: 0; }
.grid-row { display: flex; flex-wrap: wrap; gap: 15px; width: 100%; margin: 0; box-sizing: border-box; }
.grid-col { flex: 1 1 100%; box-sizing: border-box; }
@media (max-width: 768px) { .section-wrapper { padding: 15px 12px; } }
@media (min-width: 769px) { .grid-col { flex: 1; } }
(Use this pattern, replacing class names with semantic ones, but keeping the exact flex-wrap and box-sizing rules).

Input Data:
${JSON.stringify(inputData, null, 2)}
`;
        } else {
            prompt = `
You are an expert SEO content generator and web designer. 
I am providing you with a JSON object containing raw data for a page.

Your task is to:
1. Do market research on this topic.
2. Based on that research, create an SEO-optimized, highly informative, and traffic-focused blog/article/case study/checklist for our website https://ifactoryapp.com/.
3. Return ONLY a valid JSON object matching exactly this schema, with no markdown formatting or extra text:

{
    "url": "seo-friendly-url-slug",
    "title": "SEO Optimized Page Title",
    "description": "Compelling meta description under 160 characters",
    "type": "Article",
    "keywords": "comma, separated, keywords",
    "content": "Full HTML content string here...",
    "image": "image-url-with-3-2-ratio.jpg"
}

STRICT CONTENT & STRUCTURE RULES:
- CRITICAL: The content MUST be EXTREMELY LONG (Minimum 2000 words). Do NOT write short summaries. Expand deeply on every single section with detailed paragraphs, real-world data, and deep analysis. Write as much detailed text as possible.
- Minimum 10-12 completely distinct sections should be in every page with relevant content per section.
- The content must make people curious to read and click "Support" or "Book a Demo".
- Give high-quality content that is strictly relatable to the title and perfectly correct.
- Do not copy the same structure from any samples. Create a different structure for each page based on its title.
- Give very visualized designs and visually engaging infographics structures to represent the information in an attractive way that people will love to read.
- Start the content with a <p> tag and end with a <style> tag.
- CRITICAL: First paragraph MUST be exactly 5 to 7 lines long (approximately 80 to 120 words). You must write enough content to ensure the first paragraph is lengthy and detailed, never short.
- Add a hyperlink in the first paragraph ONLY in the last or second-to-last line (do NOT add hyperlinks in the first 2-3 lines). Highlight text link in first paragraph.
- Do not add any class in the first paragraph. Do not use CSS for the first paragraph.
- FAQs should not be more than 5. Add hyperlinks in FAQs. 
- CRITICAL: FAQ answers MUST be extremely detailed, at least 80-100 words each (minimum 6-8 lines). Do NOT write short 1-sentence answers for FAQs.
- Minimum 2 CTA sections and maximum 3 CTA sections should be in the page.
- CRITICAL: Keep all CTA sections extremely minimal. The CTA section MUST be its own separate, dedicated HTML section.
- DO NOT put CTA buttons inside educational or informative sections. 
- The ONLY text allowed inside a CTA section is one short headline (e.g., "Ready to optimize?") and a max 1-sentence subtitle. DO NOT add paragraphs of text inside the CTA block.
- Put CTA buttons in the hero section.
- Put the last CTA section at the very end of the page.
- Focus on "book a demo" and "support". Use ONLY two links for buttons or hyperlinks in the whole page: "https://ifactoryapp.com/support" and "https://calendly.com/contact-ifactoryapp/30min". Do not use any other links.
- CRITICAL: Center-align all CTA sections and buttons. Use 'justify-content: center' and 'gap: 15px' for button containers.
- CRITICAL: Do NOT use ANY <img> tags in the HTML content. ABSOLUTELY NO IMAGES in the code.
- CTA buttons should be displayed below the CTA section text content.
- Do not use icons or emojis.
- Do not add HTML boilerplate in the code (no html, head, body tags).

STRICT CSS & DESIGN RULES:
- CRITICAL CREATIVITY MANDATE: Do NOT just output plain text in basic divs. You MUST create visually stunning, highly structural layouts. Use rich UI patterns: Zig-Zag Content Sections, Grid Cards with box-shadows and hover effects, Step-by-Step Timelines, and Statistics Highlight Banners. Every section must have a unique layout style.
- CRITICAL: Use beautiful CSS properties like box-shadow, subtle gradients, typography variations (font-weight, letter-spacing), and rich background colors (light shades of #605dba, clean #f8f9fa) to separate sections visually.
- CRITICAL: You MUST use 'border-radius: 20px;' on EVERY main section container, feature card, grid box, and image wrapper. Make everything beautifully rounded, but never exceed 20px.
- CRITICAL: Do NOT use excessive white space, margins, or padding. Keep layouts tight, professional, and dense.
- CRITICAL: Ensure 100% mobile responsiveness. Use flexbox (flex-wrap) for grids so items stack correctly on mobile. Elements should not overflow horizontally.
- Use #605dba as primary color and #fff as secondary color.
- Use primary color in CTA sections.
- Keep the standard font size which is readable to people of all ages. Use readable font size and text color with background color.
- CRITICAL CONTRAST RULE: If a section has a dark background (like #605dba), ALL text inside it (especially HEADINGS like h2, h3, h4) MUST be white (#fff) for readability. Do not use dark headings on dark backgrounds.
- Do not use font size less than 14px anywhere in the page.
- Make table scrollable horizontally in mobile view if needed.
- Use correct hover effects.
- Do NOT use h1 tag.
- Do NOT use max-width.
- Do NOT use comments in code.
- Do NOT use JavaScript.
- Do NOT use italic font style.
- Do NOT use font-family.
- Do NOT use inline CSS anywhere.
- Do NOT use body element in CSS.
- Do NOT use universal selector (*) in CSS.
- Do NOT add any CSS in hyperlinks without a class name.
- Use different class names in code as Bootstrap classnames.
- Do NOT use margin for x-axis (left and right) on main sections.
- Do NOT use padding more than 20px at y-axis (top and bottom) and 18px at x-axis (left and right) in main sections.
- Responsive design is mandatory: make page responsive in mobile screen (428, 375, 320), tablet view and laptop view. Use all media screen sizes.
- In mobile screens: do NOT use padding (left and right) more than 12px. Put CTA buttons in two lines with full width. Stack all grid/flex columns to 100% width on mobile.
- In tablet view: put CTA buttons in one line.

YOU MUST USE THIS EXACT CSS PATTERN TO PREVENT RESPONSIVE ISSUES:
.section-wrapper { width: 100%; box-sizing: border-box; padding: 20px 18px; margin: 0; }
.grid-row { display: flex; flex-wrap: wrap; gap: 15px; width: 100%; margin: 0; box-sizing: border-box; }
.grid-col { flex: 1 1 100%; box-sizing: border-box; }
@media (max-width: 768px) { .section-wrapper { padding: 15px 12px; } }
@media (min-width: 769px) { .grid-col { flex: 1; } }
(Use this pattern, replacing class names with semantic ones, but keeping the exact flex-wrap and box-sizing rules).

Input Data:
${JSON.stringify(inputData, null, 2)}
`;
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
            if (generatedText.startsWith("\`\`\`json")) {
                generatedText = generatedText.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
            } else if (generatedText.startsWith("\`\`\`")) {
                generatedText = generatedText.replace(/^\`\`\`\n?/, '').replace(/\n?\`\`\`$/, '');
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

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
