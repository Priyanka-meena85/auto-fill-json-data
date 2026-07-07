module.exports = function getIfactoryappPrompt(inputData, templateHTML) {
    return `
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

CRITICAL UI TEMPLATE REFERENCE:
Below is a sample HTML template from our industry. You MUST use this as inspiration for the structure, CSS, and layout. 
CRITICAL: Do NOT copy the exact structure of this template! You must COLLECT content first and then create sections that follow the page rules. Create a COMPLETELY UNIQUE layout for every single page. Mix and match design elements from this reference, but do not reproduce it exactly.
CRITICAL: Do NOT use <strong>, <b>, or any bold formatting inside FAQ answers or regular paragraphs. Keep the text normal weight.

\`\`\`html
${templateHTML}
\`\`\`

Input Data:
${JSON.stringify(inputData, null, 2)}
`;
};
