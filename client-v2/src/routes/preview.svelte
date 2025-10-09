<script>
  import PreviewWindow from "../components/PreviewWindow.svelte";
  import { previewStore } from "../lib/storeAdapter.js";
  import PromptForm from "../components/PromptForm.svelte";

  let uiState = { status: "idle", message: "" };

  // seed sample content for local dev
  if (typeof window !== "undefined" && previewStore) {
    previewStore.set("<h2>Sample Poem</h2><p>A line of verse.</p>");
  }
</script>

<div style="height:100vh;padding:24px">
  <h1>Preview Route (client-v2)</h1>
  <div style="margin-top:12px">
    <PromptForm
      on:submit={async (e) => {
        const { prompt } = e.detail;
        console.log("Submit received:", prompt); // For testing
        uiState.status = "loading";
        // We'll implement the actual API call in the next step
        // For now, just verify the event handling
        setTimeout(() => {
          uiState.status = "idle";
          console.log("Submit handled"); // For testing
        }, 100);
      }}
      on:error={(e) => {
        uiState.status = "idle";
        uiState.message = e.detail.error || "Error";
      }}
    />
  </div>
  <div style="height:70%;margin-top:12px">
    <PreviewWindow {uiState} />
  </div>
</div>
