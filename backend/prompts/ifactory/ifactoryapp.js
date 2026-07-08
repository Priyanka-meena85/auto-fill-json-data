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
- CRITICAL: The total page word count MUST strictly be between 1800 to 2000 words limit. Expand your content deeply to hit this target.
- EXCLUDING CTA sections, every page should have at least 8 to 10 completely distinct sections. CRITICAL: Ensure the content perfectly matches the specific section's design and purpose. Keep sections minimal, clean, and highly effective.
- The content must make people curious to read and click "Support" or "Book a Demo".
- Give high-quality content that is strictly relatable to the title and perfectly correct.
- CRITICAL: ALWAYS change the structure of EVERY page. Use completely different examples and layouts for every page. Do not copy the same structure from any samples. Make pages highly creative and TOTALLY DIFFERENT from each other.
- CRITICAL: Add extensive visual effects and components according to the content's need. You MUST include various UI elements like data cards, responsive tables, CSS-based graphs, track bars, and progress indicators in every page.
- Start the content with a <p> tag and end with a <style> tag.
- CRITICAL: First paragraph MUST be exactly 5 to 7 lines long (approximately 80 to 120 words). You must write enough content to ensure the first paragraph is lengthy and detailed, never short.
- Add a hyperlink in the first paragraph ONLY in the last or second-to-last line (do NOT add hyperlinks in the first 2-3 lines). Highlight text link in first paragraph.
- Do not add any class in the first paragraph. Do not use CSS for the first paragraph.
- FAQs should not be more than 5. CRITICAL: Use text links in EVERY FAQ answer. Highlight text links properly using the industry's primary color (#605dba) via CSS classes.
- CRITICAL: FAQ answers MUST be extremely detailed, at least 80-100 words each (minimum 6-8 lines). Do NOT write short 1-sentence answers for FAQs.
- CRITICAL: There MUST be EXACTLY 3 CTA sections in the page. One MUST be in the hero section at the top, one in the middle, and one at the very end.
- CRITICAL: Keep all CTA sections extremely minimal. The CTA section MUST be its own separate, dedicated HTML section.
- DO NOT put CTA buttons inside educational or informative sections. 
- CRITICAL STRICT RULE FOR CTA: The CTA section MUST ONLY have a short headline and a highly meaningful subtitle that is EXACTLY 2 to 3 lines long. Make sure these 2 to 3 lines are the most impactful and meaningful lines. DO NOT add any extra paragraphs, lists, or fluff.
- CRITICAL SECTION ORDERING: Do NOT put the FAQ section just after the middle CTA. There MUST ALWAYS be at least 2 or 3 distinct sections between the middle CTA and the FAQ section. The FAQ section MUST always be placed immediately BEFORE or immediately AFTER the final CTA section at the very bottom of the page.
- CRITICAL: Every single CTA section MUST include BOTH buttons: "Book a Demo" (https://calendly.com/contact-ifactoryapp/30min) AND "Support" (https://ifactoryapp.com/support). Do not use any other links.
- CRITICAL: Center-align all CTA sections and buttons. Use 'justify-content: center' and 'gap: 15px' for button containers.
- CRITICAL: Do NOT use ANY <img> tags in the HTML content. ABSOLUTELY NO IMAGES in the code.
- CTA buttons should be displayed below the CTA section text content.
- Do not use icons or emojis.
- Do not add HTML boilerplate in the code (no html, head, body tags).

STRICT CSS & DESIGN RULES:
- CRITICAL CREATIVITY MANDATE: Do NOT make pages boring! You MUST create highly attractive, visually stunning, and extremely effective layouts. Do NOT just output plain text in basic divs. Use rich, dynamic UI patterns: Zig-Zag Content Sections, Grid Cards with box-shadows and hover effects, Step-by-Step Timelines, and Statistics Highlight Banners. Every section must have a unique, engaging layout style.
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
- CRITICAL: ABSOLUTELY DO NOT use max-width ANYWHERE. Make everything 100% width fluid.
- Do NOT use comments in code.
- Do NOT use JavaScript.
- Do NOT use italic font style.
- Do NOT use font-family.
- CRITICAL STRICT CSS RULE: ABSOLUTELY DO NOT use inline CSS (e.g., style="...") anywhere in the HTML. All styling MUST be done via CSS classes in the <style> block.
- CRITICAL STRICT CSS RULE: ABSOLUTELY DO NOT use the 'body', 'html', or '*' (universal) selectors in your CSS. All CSS must be scoped to specific class names.
- Do NOT add any CSS in hyperlinks without a class name.
- Use different class names in code as Bootstrap classnames.
- Do NOT use margin for x-axis (left and right) on main sections.
- Do NOT use padding more than 20px at y-axis (top and bottom) and 18px at x-axis (left and right) in main sections.
- Responsive design is mandatory: make page responsive in mobile screen (428, 375, 320), tablet view and laptop view. Use all media screen sizes.

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
