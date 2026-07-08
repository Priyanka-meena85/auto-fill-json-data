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
- CRITICAL: The total page word count MUST strictly be between 1800 to 2000 words limit. Expand your content deeply to hit this target.
- EXCLUDING CTA sections, every page should have at least 8 to 10 completely distinct sections. CRITICAL: Ensure the content perfectly matches the specific section's design and purpose. Keep sections minimal, clean, and highly effective.
- You MUST include: responsive tables, graphs (HTML/CSS representation), real data, and an "Expert Review" section on EVERY page.
- CRITICAL: ALWAYS change the structure of EVERY page. Use completely different examples and layouts for every page. Do not copy the same structure from any samples. Make pages highly creative and TOTALLY DIFFERENT from each other.
- CRITICAL: Add extensive visual effects and components according to the content's need. You MUST include various UI elements like data cards, responsive tables, CSS-based graphs, track bars, progress indicators, and interactive-looking elements in every page.
- Start the content with a <p> tag and end with a <style> tag.
- CRITICAL: First paragraph MUST be exactly 5 to 7 lines long (approximately 80 to 120 words). You must write enough content to ensure the first paragraph is lengthy and detailed, never short.
- Add a hyperlink in the first paragraph. Highlight text link in first paragraph.
- Add FAQs. FAQ answers should be exactly 3 to 4 lines maximum. CRITICAL: Use text links in EVERY FAQ answer. Highlight text links properly using the industry's primary color (#152277 or #fab758) via CSS classes.
- CRITICAL: There MUST be EXACTLY 3 CTA sections in the page. One MUST be in the hero section at the top, one in the middle, and one at the very end.
- CRITICAL: Keep all CTA sections extremely minimal. The CTA section MUST be its own separate, dedicated HTML section.
- DO NOT put CTA buttons inside educational or informative sections. 
- CRITICAL STRICT RULE FOR CTA: The CTA section MUST ONLY have a short headline and a highly meaningful subtitle that is EXACTLY 2 to 3 lines long. Make sure these 2 to 3 lines are the most impactful and meaningful lines. DO NOT add any extra paragraphs, lists, or fluff.
- CRITICAL SECTION ORDERING: Do NOT put the FAQ section just after the middle CTA. There MUST ALWAYS be at least 2 or 3 distinct sections between the middle CTA and the FAQ section. The FAQ section MUST always be placed immediately BEFORE or immediately AFTER the final CTA section at the very bottom of the page.
- CRITICAL: Every single CTA section MUST include BOTH buttons: "Sign Up" (https://app.oxmaint.ai) AND "Book a Demo" (https://calendly.com/oxmaintapp/30min).
- Mainly focus on Book a Demo.
- CRITICAL: Center-align all CTA sections and buttons. Use 'justify-content: center' and 'gap: 15px' for button containers.
- CRITICAL: Do NOT use ANY <img> tags in the HTML content. ABSOLUTELY NO IMAGES in the code.
- Do not use emojis or icons (use only CSS icons & numbers).
- Do not add HTML boilerplate (no html, head, body tags).


STRICT CSS & DESIGN RULES:
- CRITICAL CREATIVITY MANDATE: Do NOT make pages boring! You MUST create highly attractive, visually stunning, and extremely effective layouts. Do NOT just output plain text in basic divs. Use rich, dynamic UI patterns: Zig-Zag Content Sections, Grid Cards with box-shadows and hover effects, Step-by-Step Timelines, and Statistics Highlight Banners. Every section must have a unique, engaging layout style.
- Primary colors: #152277 and #fab758.
- Use different text and bg color for buttons compared to the CTA section background color.
- MUST use different colors for CTA buttons on HOVER. Use correct hover effect & alignment on buttons.
- Add border-radius in ALL sections. Make the whole corners rounded.
- CRITICAL: ABSOLUTELY DO NOT use max-width ANYWHERE. Make everything 100% width fluid.
- Ensure all tables and content are completely device responsive.
- Do NOT use h1 tag.
- Do NOT use font-family, font-size, JavaScript, or extra margin/padding.
- Keep the standard font size which is readable to people of all ages.
- CRITICAL STRICT CSS RULE: ABSOLUTELY DO NOT use inline CSS (e.g., style="...") anywhere in the HTML. All styling MUST be done via CSS classes in the <style> block.
- CRITICAL STRICT CSS RULE: ABSOLUTELY DO NOT use the 'body', 'html', or '*' (universal) selectors in your CSS. All CSS must be scoped to specific class names.
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
Below is a sample HTML template. ONLY use this to understand our general aesthetic (colors, border-radius, typography style). 
CRITICAL EXTREME MANDATE: You ABSOLUTELY MUST NOT copy the HTML structure, class names, grid patterns, or section ordering of this template. You MUST invent a 100% NEW, completely different HTML structure, new semantic class names, and a brand new layout pattern for this specific page. No two generated pages should EVER have the same structural format. If you use the same layout structure as previous pages or the template, you will fail.

\`\`\`html
${templateHTML}
\`\`\`

Input Data:
${JSON.stringify(inputData, null, 2)}
`;
};
