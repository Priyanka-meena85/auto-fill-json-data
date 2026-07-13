const templates = require('../templates');

module.exports = {
  /**
   * Selects a template. If templateId is provided, returns that specific template.
   * Otherwise, randomly selects one from the available pool.
   */
  selectTemplate(templateId = null) {
    if (!templates || templates.length === 0) {
      throw new Error("No templates available in the registry.");
    }

    if (templateId) {
      const found = templates.find(t => t.id === templateId);
      if (found) return found;
      console.warn(`Template ID ${templateId} not found, falling back to random selection.`);
    }

    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }
};
