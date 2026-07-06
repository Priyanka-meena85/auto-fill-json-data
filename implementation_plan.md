# Automated SEO Page Creation via AI Backend

This document outlines the plan to update the `auto-fill-page-json-data` Chrome extension and introduce a secure local Node.js backend for interacting with DeepSeek/GLM APIs.

## User Review Required
> [!IMPORTANT]
> - The new "content" textarea selector will be assumed as `textarea[name="content"]`. If the actual HTML uses a different `name` or `id` for the textarea (e.g., `textarea[name="body"]`), you will need to update the `FIELD_SELECTORS` map in `autofill-json-data.js`.
> - The backend will be initialized in a new folder: `c:\Users\User\OneDrive\Desktop\auto-fill-page-json-data\backend`.
> - The backend will use DeepSeek as the primary AI model by default, configured in `server.js`. Let me know if you want it to use GLM by default instead.

## Proposed Changes

### Extension Files
Updates to the existing Chrome extension to support the new button and API workflow.

#### [MODIFY] [manifest.json](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/manifest.json)
- Add `"host_permissions": ["http://localhost:3000/*"]` to ensure the content script can securely communicate with the local backend if CORS or CSP issues arise.

#### [MODIFY] [autofill-json-data.js](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/autofill-json-data.js)
- Define a `FIELD_SELECTORS` map at the top of the file to manage all form inputs dynamically.
- Inject a new button: **"Generate + Fill Page"**.
- Implement an async click handler that:
  1. Retrieves `jsonData` from `chrome.storage.local`.
  2. Sets button state to "Loading..." and disables it.
  3. Sends `POST http://localhost:3000/generate-page` with the JSON.
  4. Parses the returned AI-generated data.
  5. Auto-fills the corresponding form fields (including the full HTML textarea).
  6. Enables the Submit button only if all required fields are filled.
  7. Displays appropriate Toast messages for success or errors.

### Backend Node.js Server
Creation of the local backend to securely manage API keys and process the AI generation requests.

#### [NEW] [backend/server.js](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/backend/server.js)
- Initialize an Express server with `cors` and `body-parser`.
- Create `POST /generate-page` endpoint.
- Construct the AI prompt requesting JSON output (URL slug, title, description, etc.).
- Make an HTTP request to the DeepSeek Chat API.
- Return the generated data to the Chrome extension.

#### [NEW] [backend/.env](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/backend/.env) & [backend/.env.example](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/backend/.env.example)
- Securely store `DEEPSEEK_API_KEY` and `GLM_API_KEY`.
- `PORT=3000`

#### [NEW] [backend/package.json](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/backend/package.json)
- Define dependencies: `express`, `cors`, `dotenv`.

### Documentation & Examples
#### [NEW] [example_input.json](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/example_input.json)
- Sample JSON structure captured by the extension.
#### [NEW] [example_output.json](file:///c:/Users/User/OneDrive/Desktop/auto-fill-page-json-data/example_output.json)
- Sample JSON structure expected back from the AI backend.

## Verification Plan
1. Ensure the Node backend starts correctly (`node server.js`).
2. Reload the Chrome extension and verify both buttons render on the target pages.
3. Verify that the "Generate + Fill Page" button communicates properly with the backend, updates the UI with a loading state, and successfully populates the fields and textarea.
