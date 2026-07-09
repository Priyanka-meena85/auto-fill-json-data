module.exports = function getIfactoryappPrompt(inputData, templateHTML) {
    return `
You are an elite, world-class SEO content generator and expert UI/UX web designer. 
I am providing you with a JSON object containing raw data for a page.

Your task is to:
1. Conduct deep market research on this topic to ensure extreme technical accuracy.
2. Based on that research, create an SEO-optimized, highly compelling, enterprise-grade case study/blog/checklist for our website https://ifactoryapp.com/. Our brand focuses on Industry 4.0, AI-driven predictive maintenance, smart factory analytics, and enterprise manufacturing efficiency. The tone must be highly professional, technical, authoritative, and analytical.
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
- CRITICAL EXTREME MANDATE FOR LENGTH: The total page word count MUST strictly be MINIMUM 3000 to 4000 words. This is a massive, highly detailed long-form guide. You MUST expand your content deeply, providing extensive paragraphs, multiple sub-topics, deep-dive technical explanations, and thorough examples to hit this target. Provide high-value, sophisticated enterprise insights.
- EXCLUDING CTA sections, every page should have at least 15 to 20 completely distinct sections. Keep sections clean, purposeful, and highly effective.
- CRITICAL CREATIVITY: Ensure every single section is unique and highly creative. Do not repeat formats. Alternate between grids, lists, tables, infographics (CSS), and deep-dive text blocks.
- The content must instantly hook enterprise decision-makers (Plant Managers, CTOs, Maintenance Directors) and make them curious to click "Book a Demo".
- CRITICAL: ALWAYS change the structure of EVERY page. Use completely different layouts, diverse components, and highly creative designs for every page. Do not copy the same structure from any samples. Make pages TOTALLY DIFFERENT from each other.
- CRITICAL: Add extensive visual effects and rich UI components. You MUST include various elements like elegant data cards, highly readable responsive tables, CSS-based statistical graphs, track bars, and progress indicators in every page.
- Start the content with a <p> tag and end with a <style> tag.
- CRITICAL: First paragraph MUST be exactly 5 to 7 lines long (approximately 80 to 120 words). It must be deeply engaging and highly detailed.
- CRITICAL: Add a text hyperlink for "Book a Demo" (https://calendly.com/contact-ifactoryapp/30min) in the first paragraph ONLY in the last or second-to-last line. Highlight this link using the primary color.
- Do not add any CSS class to the very first paragraph.
- FAQs should not be more than 5. CRITICAL: Use text links in EVERY FAQ answer. Highlight text links properly.
- CRITICAL: FAQ answers MUST be extremely detailed, at least 80-100 words each (minimum 6-8 lines). Do NOT write short 1-sentence answers.
- CRITICAL: There MUST be EXACTLY 3 CTA sections in the page. One in the hero section at the top, one in the middle, and one at the very end.
- CRITICAL STRICT RULE FOR CTA: Keep CTA sections extremely minimal. They MUST ONLY have a short headline and a highly meaningful, persuasive subtitle that is EXACTLY 2 to 3 lines long. DO NOT add any extra paragraphs, lists, or fluff inside CTA sections.
- DO NOT put CTA buttons inside educational or informative sections. 
- CRITICAL SECTION ORDERING: Do NOT put the FAQ section just after the middle CTA. There MUST ALWAYS be at least 2 or 3 distinct sections between the middle CTA and the FAQ section. The FAQ section MUST always be placed immediately BEFORE or immediately AFTER the final CTA section at the very bottom.
- CRITICAL: You MUST use ONLY two links for buttons or hyperlinks in the ENTIRE PAGE: "https://ifactoryapp.com/support" and "https://calendly.com/contact-ifactoryapp/30min". Focus heavily on getting the user to "Book a Demo". Every CTA section MUST include BOTH of these buttons.
- CRITICAL: Center-align all CTA sections and buttons. Use 'display: flex; justify-content: center; gap: 15px;' for button containers.
- CRITICAL: Do NOT use ANY <img> tags in the HTML content. ABSOLUTELY NO IMAGES in the code.
- CTA buttons should be displayed directly below the CTA text content.
- Do not use icons or emojis. Use only clean, professional typography and CSS shapes.
- Do not add HTML boilerplate (no html, head, body tags).

STRICT CSS, UI/UX & PERFECT ALIGNMENT RULES:
- CRITICAL CREATIVITY MANDATE: You MUST create highly attractive, visually stunning, and extremely professional layouts. Use rich, dynamic UI patterns: Zig-Zag Content Sections, elegant Grid Cards with subtle hover effects, sleek Step-by-Step Timelines, and Statistics Highlight Banners.
- CRITICAL PERFECT ALIGNMENT RULE: When using Flexbox or Grid for cards or columns, you MUST prevent vertical stretching! Cards must wrap tightly around their text content. NEVER leave huge, inappropriate empty white space at the bottom of a card. Use 'align-items: flex-start;' on flex containers, or 'height: fit-content;' on cards to prevent them from stretching to match taller siblings.
- TYPOGRAPHY & READABILITY: Enforce professional typography. Set paragraph 'line-height' to 1.6 or 1.8. Differentiate headings with strong 'font-weight' (e.g., 600 or 700) and use slightly muted colors (e.g., #34495e or #4a5568) for body text to reduce eye strain.
- CONSISTENT SPACING: Use Flexbox/Grid 'gap' for spacing between elements instead of unpredictable margins. Ensure all paddings and margins are perfectly symmetrical and modern.
- CRITICAL: Use beautiful CSS properties like subtle, soft box-shadows (e.g., 'box-shadow: 0 4px 12px rgba(0,0,0,0.05)'), elegant gradients, and rich background contrasts (e.g., a very light #f8f9fa background for cards placed on a pure #ffffff container).
- CRITICAL: You MUST use 'border-radius: 12px;' or '16px;' on EVERY main section container, feature card, grid box, and wrapper. Make everything beautifully, elegantly rounded.
- CRITICAL: Do NOT use excessive, bloated white space. Keep layouts tight, mathematically aligned, and dense but breathable.
- CRITICAL: Ensure 100% mobile responsiveness. Elements should gracefully stack on smaller screens. No horizontal overflow.
- Use #605dba (iFactory Purple) as the primary brand color and #fff as the secondary color. Use the primary color boldly in CTA sections.
- CRITICAL CONTRAST RULE: If a section has a dark background (like #605dba), ALL text inside it (especially headings) MUST be pure white (#fff) for perfect readability.
- Do not use font size less than 14px anywhere.
- Make tables perfectly styled: alternating row colors, strong header backgrounds, and scrollable horizontally on mobile.
- Use smooth, professional hover effects on buttons and cards (e.g., 'transform: translateY(-2px); transition: all 0.3s ease;').
- Do NOT use the <h1> tag.
- CRITICAL: ABSOLUTELY DO NOT use 'max-width' ANYWHERE in the main structure. Make everything 100% width fluid within its container.
- Do NOT use comments, JavaScript, italic fonts, or 'font-family' declarations.
- CRITICAL STRICT CSS RULE: ABSOLUTELY DO NOT use inline CSS (e.g., style="..."). All styling MUST be done via well-named semantic CSS classes in the <style> block.
- CRITICAL STRICT CSS RULE: ABSOLUTELY DO NOT use the 'body', 'html', or '*' (universal) selectors in your CSS.
- Do NOT use padding more than 20px at y-axis and 18px at x-axis in main sections. Limit mobile side padding to 12px.
- Use precise, perfect alignment of CTA buttons and cards across all devices.

CRITICAL UI TEMPLATE REFERENCE:
Below is a sample HTML template. ONLY use this to understand our general aesthetic (colors, border-radius, typography style). 
CRITICAL EXTREME MANDATE: You ABSOLUTELY MUST NOT copy the HTML structure, class names, grid patterns, or section ordering of this template. You MUST invent a 100% NEW, completely different HTML structure, new semantic class names, and a brand new layout pattern for this specific page. No two generated pages should EVER have the same structural format. If you use the same layout structure as previous pages or the template, you will fail.
CRITICAL: Do NOT use <strong>, <b>, or any bold formatting inside FAQ answers or regular paragraphs. Keep the text normal weight.

\`\`\`html
${templateHTML}
\`\`\`

Input Data:
${JSON.stringify(inputData, null, 2)}
`;
};
