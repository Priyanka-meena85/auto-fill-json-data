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
- CRITICAL: The total page word count MUST be between 1200 to 1500 words limit. Keep all sections minimal, concise, and to the point.
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
- CRITICAL: The total page word count MUST be between 1200 to 1500 words limit. Keep all sections minimal, concise, and to the point.
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

CRITICAL STRUCTURAL TEMPLATE:
You MUST structure your HTML EXACTLY like this template. Use these exact class names, divs, grids, and CSS styles. Replace the dummy content with your actual generated content. Do not invent new structures, stick strictly to these components (you can reorder them or use them multiple times):

\`\`\`html
<p>Introductory paragraph text...</p>
<div class="TID-hero">
<div class="TID-hero-tag">Category Tag</div>
<div class="TID-hero-title">Main Title Here</div>
<div class="TID-hero-subtitle">Subtitle here</div>
<div class="TID-hero-actions">
<a href="https://calendly.com/contact-ifactoryapp/30min" class="TID-btn-primary">Book a Demo</a>
<a href="https://ifactoryapp.com/support" class="TID-btn-secondary">Talk to Support</a>
</div>
</div>

<h2>Section Title</h2>
<p>Short minimal description</p>
<div class="TID-count-grid">
<div class="TID-count-card">
<div class="TID-count-value">Value</div>
<div class="TID-count-label">Label text</div>
</div>
<!-- More cards -->
</div>

<h2>Another Section</h2>
<div class="TID-composition">
<div class="TID-comp-bar">
<div class="TID-comp-segment TID-seg-good">60%</div>
<div class="TID-comp-segment TID-seg-marginal">25%</div>
<div class="TID-comp-segment TID-seg-defect">15%</div>
</div>
<div class="TID-comp-notes">
<div class="TID-comp-note"><span class="TID-comp-dot TID-dot-good"></span>Note 1</div>
</div>
</div>

<h2>Method Grid Section</h2>
<div class="TID-method-grid">
<div class="TID-method-card">
<div class="TID-method-title">Method 1</div>
<div class="TID-method-desc">Description</div>
<div class="TID-method-tag">Tag</div>
</div>
</div>

<h2>Workflow Section</h2>
<div class="TID-workflow">
<div class="TID-workflow-step">
<div class="TID-workflow-num">1</div>
<div class="TID-workflow-content">
<div class="TID-workflow-title">Step 1</div>
<div class="TID-workflow-desc">Step details</div>
</div>
</div>
</div>

<div class="TID-cta-section">
<div class="TID-cta-content">
<div class="TID-cta-title">Mid-page CTA</div>
<div class="TID-cta-text">CTA text</div>
</div>
<div class="TID-cta-buttons">
<a href="https://calendly.com/contact-ifactoryapp/30min" class="TID-btn-primary-alt">Book Demo</a>
</div>
</div>

<h2>Mistakes List</h2>
<div class="TID-mistake-list">
<div class="TID-mistake-item">
<div class="TID-mistake-title">Mistake 1</div>
<div class="TID-mistake-desc">Details</div>
</div>
</div>

<h2>Frequently Asked Questions</h2>
<div class="TID-faq">
<div class="TID-faq-item">
<div class="TID-faq-q">Question?</div>
<div class="TID-faq-a">Answer.</div>
</div>
</div>

<style>
/* YOU MUST INCLUDE THIS EXACT CSS IN YOUR OUTPUT */
.TID-hero{background:#605dba;border-radius:16px;padding:20px 18px;margin:24px 0;text-align:center}
.TID-hero-tag{display:inline-block;background:#fff;color:#605dba;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:16px}
.TID-hero-title{font-size:26px;font-weight:800;color:#fff;margin-bottom:10px}
.TID-hero-subtitle{font-size:14px;color:#f0eeff;margin-bottom:22px;line-height:1.6}
.TID-hero-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.TID-inline-link{color:#605dba;font-weight:600;text-decoration:underline}
.TID-count-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:24px 0}
.TID-count-card{background:#f5f4fb;border:2px solid #e8e8e8;border-radius:12px;padding:20px 14px;text-align:center;transition:border-color 0.2s ease}
.TID-count-card:hover{border-color:#605dba}
.TID-count-value{font-size:22px;font-weight:800;color:#605dba;margin-bottom:8px}
.TID-count-label{font-size:12px;color:#666;line-height:1.5}
.TID-composition{background:#fff;border:2px solid #e8e8e8;border-radius:14px;padding:20px 18px;margin:24px 0}
.TID-comp-bar{display:flex;width:100%;border-radius:10px;overflow:hidden;margin-bottom:18px;height:48px}
.TID-comp-segment{display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
.TID-seg-good{background:#605dba;width:60%}
.TID-seg-marginal{background:#8b89cf;width:25%}
.TID-seg-defect{background:#c3c2e8;width:15%;color:#444}
.TID-comp-notes{display:flex;flex-direction:column;gap:10px}
.TID-comp-note{font-size:13px;color:#555;line-height:1.6;display:flex;gap:10px;align-items:flex-start}
.TID-comp-dot{width:12px;height:12px;border-radius:4px;flex-shrink:0;margin-top:3px}
.TID-dot-good{background:#605dba}
.TID-dot-marginal{background:#8b89cf}
.TID-dot-defect{background:#c3c2e8}
.TID-method-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0}
.TID-method-card{background:#fff;border:2px solid #e8e8e8;border-radius:12px;padding:20px 18px;transition:border-color 0.2s ease}
.TID-method-card:hover{border-color:#605dba}
.TID-method-title{font-size:16px;font-weight:800;color:#222;margin-bottom:10px}
.TID-method-desc{font-size:13px;color:#666;line-height:1.6;margin-bottom:12px}
.TID-method-tag{display:inline-block;background:#f5f4fb;color:#605dba;font-size:12px;font-weight:700;padding:5px 12px;border-radius:10px}
.TID-text-cta{background:#f5f4fb;border-left:4px solid #605dba;padding:16px 18px;margin:24px 0;font-size:14px;color:#444;border-radius:0 10px 10px 0;line-height:1.6}
.TID-text-cta a{color:#605dba;font-weight:600;text-decoration:underline}
.TID-workflow{display:flex;flex-direction:column;gap:14px;margin:24px 0}
.TID-workflow-step{display:flex;gap:16px;background:#fff;border:2px solid #e8e8e8;border-radius:12px;padding:18px;transition:border-color 0.2s ease}
.TID-workflow-step:hover{border-color:#605dba}
.TID-workflow-num{width:34px;height:34px;background:#605dba;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;flex-shrink:0}
.TID-workflow-title{font-size:15px;font-weight:700;color:#222;margin-bottom:6px}
.TID-workflow-desc{font-size:13px;color:#666;line-height:1.6}
.TID-cta-section{background:linear-gradient(135deg,#605dba 0%,#4a478f 100%);border-radius:14px;margin:24px 0;padding:20px 18px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px}
.TID-cta-title{font-size:19px;font-weight:700;color:#fff;margin-bottom:8px}
.TID-cta-text{font-size:14px;color:#f0eeff;line-height:1.6}
.TID-cta-buttons{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.TID-btn-primary,.TID-btn-primary-alt{display:inline-block;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;text-align:center;white-space:nowrap;box-sizing:border-box;background:#fff;color:#605dba;transition:background 0.2s ease}
.TID-btn-primary:hover,.TID-btn-primary-alt:hover{background:#f0eeff}
.TID-btn-secondary,.TID-btn-secondary-alt{display:inline-block;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;text-align:center;white-space:nowrap;box-sizing:border-box;background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.85);transition:all 0.2s ease}
.TID-btn-secondary:hover,.TID-btn-secondary-alt:hover{background:#fff;color:#605dba;border-color:#fff}
.TID-mistake-list{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:24px 0}
.TID-mistake-item{background:#fef5f5;border:2px solid #f3d9d9;border-radius:12px;padding:18px}
.TID-mistake-title{font-size:14px;font-weight:700;color:#c0392b;margin-bottom:8px}
.TID-mistake-desc{font-size:13px;color:#666;line-height:1.6}
.TID-faq{margin:24px 0}
.TID-faq-item{background:#f5f4fb;border-left:4px solid #605dba;border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:12px}
.TID-faq-item:last-child{margin-bottom:0}
.TID-faq-q{font-size:15px;font-weight:700;color:#222;margin-bottom:10px}
.TID-faq-a{font-size:14px;color:#555;line-height:1.7}
.TID-faq-a a{color:#605dba;font-weight:600;text-decoration:underline}
@media(max-width:900px){
.TID-count-grid{grid-template-columns:repeat(2,1fr)}
.TID-method-grid{grid-template-columns:1fr}
.TID-mistake-list{grid-template-columns:1fr}
.TID-cta-buttons{flex-wrap:nowrap;width:100%}
.TID-cta-buttons a{flex:1}
}
@media(max-width:600px){
.TID-hero{padding:20px 12px}
.TID-hero-title{font-size:19px}
.TID-hero-subtitle{font-size:14px}
.TID-count-grid{grid-template-columns:1fr 1fr;gap:10px}
.TID-comp-bar{flex-direction:column;height:auto}
.TID-comp-segment{padding:10px;width:100% !important}
.TID-workflow-step{flex-direction:column}
.TID-workflow-num{align-self:flex-start}
.TID-cta-buttons{flex-direction:column;width:100%}
.TID-btn-primary,.TID-btn-primary-alt,.TID-btn-secondary,.TID-btn-secondary-alt{width:100%}
.TID-faq-item{padding:16px 14px}
.TID-cta-section{padding:18px 12px}
}
@media(max-width:428px){
.TID-hero{padding:18px 12px}
.TID-count-card{padding:16px 12px}
.TID-composition{padding:16px 12px}
.TID-method-card{padding:16px 12px}
.TID-workflow-step{padding:14px 12px}
.TID-mistake-item{padding:14px 12px}
.TID-faq-item{padding:14px 12px}
.TID-cta-section{padding:18px 12px}
}
@media(max-width:375px){
.TID-hero-title{font-size:18px}
.TID-count-value{font-size:19px}
.TID-cta-title{font-size:17px}
}
@media(max-width:320px){
.TID-hero-title{font-size:16px}
.TID-count-grid{grid-template-columns:1fr}
.TID-cta-title{font-size:16px}
}
</style>
\`\`\`

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
