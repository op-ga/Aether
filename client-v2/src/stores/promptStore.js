// Enhanced promptStore.js - Pure state management
// Implements store interface as specified in CHECKLIST_Phase2_dv01.md
import { writable } from "svelte/store";
import { promptService } from "../services/promptService";
import { previewStore } from "../lib/storeAdapter";

/**
 * @typedef {Object} StoreState
 * @property {string} prompt
 * @property {boolean} loading
 * @property {string|null} error
 * @property {string|null} requestId
 */

/** @type {import('svelte/store').Writable<StoreState>} */
const store = writable({
  prompt: "",
  loading: false,
  error: null,
  requestId: null,
});

/**
 * Submit a prompt and handle state transitions
 * @param {string} prompt
 */
async function submit(prompt) {
  store.update((s) => ({
    ...s,
    prompt,
    loading: true,
    error: null,
  }));

  try {
    const result = await promptService.submit(prompt);

    // Update the preview content through the existing adapter
    if (result.content && (result.content.body || result.content.html)) {
      previewStore.set(result.content.body || result.content.html);
    }

    // Track request correlation
    store.update((s) => ({
      ...s,
      loading: false,
      requestId: result.metadata?.requestId || null,
    }));

    return result;
  } catch (error) {
    handleError(error);
    throw error; // Re-throw for UI handling if needed
  }
}

/**
 * Update the preview content
 * @param {Object} content
 */
function updatePreview(content) {
  if (!content) return;
  const html = content.body || content.html;
  if (html) {
    previewStore.set(html);
  }
}

/**
 * Handle errors consistently
 * @param {Error} error
 */
function handleError(error) {
  const message = error?.message || "An unexpected error occurred";
  store.update((s) => ({
    ...s,
    loading: false,
    error: message,
  }));
}

// Export the enhanced store interface
export const promptStore = {
  subscribe: store.subscribe,
  submit,
  updatePreview,
  handleError,
};
