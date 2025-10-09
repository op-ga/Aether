// promptService.js - Business logic for prompt handling
// Implements the service interface as specified in CHECKLIST_Phase2_dv01.md

/**
 * @typedef {Object} GenerationResult
 * @property {boolean} success
 * @property {Object} content
 * @property {string} content.title
 * @property {string} content.body
 * @property {Object} metadata
 */

/**
 * @typedef {Object} StoredPrompt
 * @property {string} prompt
 * @property {GenerationResult} result
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {string} [error]
 */

class PromptService {
  /**
   * Submit a prompt for generation
   * @param {string} prompt
   * @returns {Promise<GenerationResult>}
   */
  async submit(prompt) {
    const validation = this.validate(prompt);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { transportAdapter } = await import("../transport/transportAdapter");
    const response = await transportAdapter.post("/prompt", { prompt });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Generation failed");
    }

    return result.data || result;
  }

  /**
   * Get the latest stored prompt and result
   * @returns {Promise<StoredPrompt | null>}
   */
  async getLatest() {
    // Will be implemented when transport layer is ready
    return null;
  }

  /**
   * Validate a prompt before submission
   * @param {string} prompt
   * @returns {ValidationResult}
   */
  validate(prompt) {
    if (!prompt || typeof prompt !== "string") {
      return { isValid: false, error: "Prompt must be a string" };
    }

    if (prompt.trim().length === 0) {
      return { isValid: false, error: "Prompt cannot be empty" };
    }

    // Add any additional validation rules here
    return { isValid: true };
  }
}

// Export a singleton instance
export const promptService = new PromptService();
