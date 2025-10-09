// transportAdapter.js - Pure plumbing for HTTP communication
// Implements transport interface as specified in CHECKLIST_Phase2_dv01.md

/**
 * @typedef {Object} RequestConfig
 * @property {string} [method]
 * @property {Object} [headers]
 * @property {any} [body]
 */

/**
 * @typedef {Object} ResponseError extends Error
 * @property {number} status
 * @property {string} message
 */

class TransportAdapter {
  constructor(baseConfig = {}) {
    this.baseConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      ...baseConfig,
    };
  }

  /**
   * Make a POST request to the specified endpoint
   * @param {string} endpoint
   * @param {any} payload
   * @returns {Promise<Response>}
   */
  async post(endpoint, payload) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Make a GET request to the specified endpoint
   * @param {string} endpoint
   * @returns {Promise<Response>}
   */
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  /**
   * Core request method with error handling
   * @private
   * @param {string} endpoint
   * @param {RequestConfig} config
   */
  async request(endpoint, config) {
    try {
      const response = await fetch(endpoint, {
        ...this.baseConfig,
        ...config,
        headers: {
          ...this.baseConfig.headers,
          ...(config.headers || {}),
        },
      });

      if (!response.ok) {
        const error = new Error("HTTP Error");
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }

      return response;
    } catch (error) {
      // Enhance error with transport context
      if (!error.status) {
        error.status = 0; // Network/connection error
        error.statusText = error.message;
      }
      throw error;
    }
  }
}

// Export a singleton instance with default configuration
export const transportAdapter = new TransportAdapter();

// Also export the class for custom instances if needed
export { TransportAdapter };
