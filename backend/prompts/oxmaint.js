module.exports = function getOxmaintPrompt(inputData, templateHTML) {
    return `
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

CRITICAL UI TEMPLATE REFERENCE:
Below is a sample HTML template from our industry. You MUST use this as inspiration for the structure, CSS, and layout. 
CRITICAL: Do NOT copy the exact structure of this template! You must COLLECT content first and then create sections that follow the page rules. Create a COMPLETELY UNIQUE layout for every single page. Mix and match design elements from this reference, but do not reproduce it exactly.

\`\`\`html
${templateHTML}
\`\`\`

Input Data:
${JSON.stringify(inputData, null, 2)}
`;
};
