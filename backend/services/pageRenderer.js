/**
 * Escapes unsafe characters in a string to prevent XSS and layout breaking when injected into HTML.
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

module.exports = {
  /**
   * Deterministically renders the HTML by injecting the validated JSON content into the fixed template.
   */
  render(template, content) {
    if (!template || typeof template.render !== 'function') {
      throw new Error("Invalid template provided for rendering.");
    }
    
    // Call the template's render function, passing the content and the escape function
    return template.render(content, escapeHtml);
  }
};
