module.exports = {
  /**
   * Validates the generated JSON content against the template's outputExample structure.
   * Throws an error with a detailed message if validation fails.
   */
  validate(content, exampleSchema, path = "") {
    if (!content || typeof content !== 'object') {
      throw new Error(`Invalid content at ${path || 'root'}. Expected an object or array.`);
    }

    if (Array.isArray(exampleSchema)) {
      if (!Array.isArray(content)) {
        throw new Error(`Field ${path || 'root'} must be an array.`);
      }
      
      // If the example has items, validate each item in the content against the first item in the example
      if (exampleSchema.length > 0) {
        const itemSchema = exampleSchema[0];
        content.forEach((item, index) => {
          this.validate(item, itemSchema, `${path}[${index}]`);
        });
      }
      return true;
    }

    const exampleKeys = Object.keys(exampleSchema);
    const contentKeys = Object.keys(content);

    // Check for missing fields
    for (const key of exampleKeys) {
      if (content[key] === undefined || content[key] === null) {
        throw new Error(`Missing required field: ${path ? path + '.' + key : key}`);
      }
    }

    // Check for extra fields
    for (const key of contentKeys) {
      if (exampleSchema[key] === undefined) {
        throw new Error(`Additional unexpected field found: ${path ? path + '.' + key : key}`);
      }
    }

    // Recursively validate nested objects or arrays
    for (const key of exampleKeys) {
      const expectedType = typeof exampleSchema[key];
      const actualVal = content[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (expectedType === "object" && exampleSchema[key] !== null) {
        this.validate(actualVal, exampleSchema[key], currentPath);
      } else if (expectedType === "string") {
        if (typeof actualVal !== "string") {
          throw new Error(`Field ${currentPath} must be a string.`);
        }
      }
    }

    return true; // Validation passed
  }
};
