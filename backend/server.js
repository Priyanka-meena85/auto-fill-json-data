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
  hvi: {
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
    let targetWebsite = website;
    if (!templateConfig[targetWebsite]) {
        targetWebsite = 'ifactory'; // fallback
    }
    
    // Normalize page type slightly (e.g. "case study" -> "caseStudy")
    let normalizedType = (pageType || "blog").toLowerCase();
    if (normalizedType === "case study" || normalizedType === "case-study") {
        normalizedType = "caseStudy";
    }

    return templateConfig[targetWebsite][normalizedType] || templateConfig[targetWebsite]['blog'] || [];
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
    let brandContext = "";
    if (website === "oxmaint") {
        brandContext = "oxmaint.com - Focus on CMMS, daily maintenance checklists, work order management. Tone: practical, actionable. BRAND STYLING: You MUST strictly update all primary, CTA, and background colors in the CSS to Oxmaint's official color codes: #15227a (primary dark blue) and #fab758 (accent orange/yellow).";
    } else if (website === "hvi") {
        brandContext = "heavyvehicleinspection.com (HVI) - Focus on heavy vehicle inspection, fleet maintenance management, digital inspection apps, safety compliance. Tone: professional, safety-focused. BRAND STYLING: You MUST strictly update all primary, CTA, and background colors in the CSS to HVI's official color code: #345180 (primary steel blue).";
    } else if (website === "ifactory") {
        brandContext = "https://ifactoryapp.com/ - Focus on Industry 4.0, AI-driven predictive maintenance, smart factory analytics. Tone: professional, technical. BRAND STYLING: You MUST strictly update all primary, CTA, and background colors in the CSS to iFactory's official color code: #605dba (primary purple).";
    } else {
        const pColor = pageData.primaryColor || "#333333";
        brandContext = `${website} - Tone: professional. BRAND STYLING: You MUST strictly update all primary, CTA, and background colors in the CSS to use this website's primary color code: ${pColor}.`;
    }

    let instructions = "";

    if (website === "hvi") {
        instructions = `INSTRUCTIONS:
First collect content, then create section and template according to this. Follow page rules like cta section and start with p tag and end with style tag and signup book a demo interlink.
Make sure all pages are different from each other. Do market research on this and create a seo-optimized and traffic-focused case study/blog/checklist page for heavyvehicleinspection.in that is highly informative and relatable, making people curious to read and click sign up or book a demo.
Give high quality content relatable to title and correct.
Give different structure as per the title, give very visualized designs, visually engaging infographics structure to represent the information in very visualized and attractive way.
Follow these rules strictly:
- don't use h1 tag
- don't use max-width
- don't use comments in code
- don't use JavaScript
- use border radius for main section
- don't use italic font style
- don't use font family
- don't use inline CSS
- don't use body element in CSS
- use #345180 color as primary color, use #fff color as secondary color, use primary color in cta section, use correct hover effect
- don't use universal selector (*) in CSS
- don't add class in first para, don't use CSS for first paragraph
- use readable font size and text color with background color
- faq answers should be of minimum 2 to 4 lines, make table scrollable horizontally in mobile view if needed
- minimum two cta sections and maximum three cta sections should be in the page
- NEVER use emojis (e.g. ⚡). ALWAYS use inline SVG code for icons.
- cta buttons should be displayed below the cta section text content
- don't use margin for x-axis(left and right) on main sections
- don't use padding more than 20px at y-axis (top and bottom) and 18px at x axis(left and right)
- use only two links for buttons or hyperlinks in whole page one is https://heavyvehicleinspection.com/portal/signup and second is https://calendly.com/hviapp/30min, don't use other links for buttons or hyperlinks
- put last cta section at the end of the page
- don't use inline CSS anywhere
- make page responsive in mobile screen (428, 375, 320), tablet view and laptop view, use all media screen sizes to make page responsive
- don't add any css in hyperlinks without class name
- put cta buttons in one line in tablet view, cta button in two lines with full width in mobile view
- don't use border-radius more than 20px
- don't use font size less than 14px anywhere in the page
- don't add html boiler plate in code
- don't add hyperlinks in first para in 2-3 lines of starting, add hyperlink in first para in last or second last line
- faqs should not be more than 5
- don't use padding (left and right) more than 12px in mobile screens, add hyperlinks in faqs.
- DO NOT use Bootstrap classes or include Bootstrap CSS. Use ONLY custom semantic CSS classes.
- Ensure PERFECT alignment using CSS Flexbox or Grid. All sections must be visually centered, evenly spaced, and properly aligned.
- Ensure buttons have proper padding, cursor: pointer, smooth transition effects, and distinct hover states (e.g. background color change).
- first paragraph should be of 4-5 lines only, first para content should not be more than 5 lines
- don't use padding more than 12px at x-axis (left and right) in mobile view
- don't use padding more than 20px in main sections, add cta buttons in hero section
- page content should have buyer intent page that focus user to use our software or book a demo(main)`;
    } else {
        instructions = `INSTRUCTIONS:
Use the supplied template as the primary structure for the generated page.
Preserve the overall layout hierarchy, section sequence, heading structure,
CTA positions, card pattern, FAQ placement, and component arrangement.
Replace only the placeholder or topic-specific content.
Do not copy irrelevant content from the template.
Generate unique, professional, SEO-friendly content according to the supplied
page title and metadata.
Do not remove mandatory sections from the selected template.

CRITICAL CSS & BRANDING: You MUST update the CSS color codes in the generated HTML to match the specific "BRAND STYLING" instructions provided in the Brand Context. Overwrite any existing template colors that belong to other brands.

CRITICAL MOBILE BUTTON RESPONSIVENESS: On mobile screens (e.g., max-width 768px), ALL CTA buttons MUST appear in two separate rows (stack vertically), taking 100% width each, with proper spacing between them. You MUST add the necessary responsive CSS media queries to enforce this behavior without affecting the desktop layout.

CRITICAL CSS & LAYOUT STRICTNESS: 
1. DO NOT use Bootstrap or any other external CSS framework. Write 100% custom CSS.
2. Ensure PERFECT alignment using CSS Flexbox or Grid. Sections must be visually centered, evenly spaced, and properly aligned.
3. Ensure CTA buttons have proper padding, cursor: pointer, smooth transition effects, and distinct hover states (e.g., background color change). Fix all button alignment and hover issues.`;
    }

    return `
You are an elite, world-class SEO content generator and expert UI/UX web designer.
I am providing you with a JSON object containing raw data for a page, and an HTML template.

Brand Context: ${brandContext}

Input Data:
${JSON.stringify(pageData, null, 2)}

Template Name: ${templateName}

${instructions}

CRITICAL ICONOGRAPHY: NEVER use emojis (e.g. ⚡, 📝, 🚀) anywhere in the page. You MUST use proper inline SVG code for all icons.
CRITICAL TEMPLATE PRESERVATION: You MUST strictly preserve the HTML structure, CSS classes, layout grid, and button styling of the provided template. Do NOT invent new layouts or CSS rules that break the existing alignment. ONLY replace the text, images, and brand colors to make the content unique.
CRITICAL LAYOUT & RESPONSIVENESS: Do NOT use 'max-width' anywhere in the content, CTA, or hero sections. Even if the supplied template uses 'max-width', you MUST remove it in your generated code! You MUST ensure the generated page is 100% fluid and fully responsive across ALL devices (mobile, tablet, desktop) using appropriate CSS media queries.

CRITICAL: You MUST generate complete and high-quality values for ALL fields in the JSON object (url, title, description, keywords). Do NOT leave them blank. Do NOT return the placeholder text.

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
                { role: "system", content: "You are a helpful assistant that outputs ONLY valid JSON." },
                { role: "user", content: payload }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 8000
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

    if (generatedText.startsWith("```json")) {
        generatedText = generatedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (generatedText.startsWith("```")) {
        generatedText = generatedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    try {
        parsedJson = JSON.parse(generatedText);
    } catch (e) {
        console.log("Direct JSON parse failed, attempting robust regex extraction for truncated response...");
        try {
            // If the AI hit the token limit, the JSON is truncated. 
            // We can salvage it by manually extracting the fields using regex.
            const urlMatch = generatedText.match(/"url"\s*:\s*"([^"]*)"/);
            const titleMatch = generatedText.match(/"title"\s*:\s*"([^"]*)"/);
            const descMatch = generatedText.match(/"description"\s*:\s*"([^"]*)"/);
            const keywordsMatch = generatedText.match(/"keywords"\s*:\s*"([^"]*)"/);
            
            // For content, match everything after "content": " until the next unescaped quote or end of string
            // This is tricky with regex, so we'll just find the start of content and take the rest, 
            // cleaning up the trailing JSON garbage if any.
            const contentStartIndex = generatedText.indexOf('"content"');
            if (contentStartIndex !== -1) {
                let contentStr = generatedText.substring(contentStartIndex);
                contentStr = contentStr.replace(/^"content"\s*:\s*"/, '');
                
                // Remove trailing quotes, braces, and newlines that might be cut off
                contentStr = contentStr.replace(/"\s*\}\s*$/, '');
                contentStr = contentStr.replace(/\"\s*$/, '');
                
                // Unescape JSON stringified characters
                contentStr = contentStr.replace(/\\n/g, '\n')
                                       .replace(/\\"/g, '"')
                                       .replace(/\\\\/g, '\\')
                                       .replace(/\\t/g, '\t');
                                       
                // Auto-close style tag if it was truncated
                if (contentStr.includes('<style>') && !contentStr.includes('</style>')) {
                    contentStr += '\n}\n</style>';
                }

                parsedJson = {
                    url: urlMatch ? urlMatch[1] : "generated-url",
                    title: titleMatch ? titleMatch[1] : "Generated Title",
                    description: descMatch ? descMatch[1] : "Generated description",
                    keywords: keywordsMatch ? keywordsMatch[1] : "",
                    content: contentStr,
                    type: "Article"
                };
            } else {
                throw new Error("Content field not found in truncated response.");
            }
        } catch (e2) {
            console.error("--- RAW EXTRACTED JSON THAT FAILED TO PARSE ---");
            console.error(generatedText);
            console.error("-------------------------------------------------");
            throw new Error("Failed to parse extracted JSON.");
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
        let website = hostname;
        if (hostname.includes("oxmaint")) {
            website = "oxmaint";
        } else if (hostname.includes("heavyvehicleinspection") || hostname.includes("hvi")) {
            website = "hvi";
        } else if (hostname.includes("ifactory")) {
            website = "ifactory";
        }

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
                const imagePrompt = `Create real image, high resolution image on the given title ${topic}, simple and professional image give title big size, give real image of daylight simple image.`;
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
