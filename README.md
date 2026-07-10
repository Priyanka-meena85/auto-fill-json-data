# AI SEO Page Generator & Auto-Fill Extension

This project is a powerful automation suite that combines a **Google Chrome Extension** with a **Node.js Backend Server**. It is designed to extract JSON data from web interfaces, send it to a custom backend, generate massive (3000+ words) SEO-optimized, highly professional HTML pages using the DeepSeek API, and automatically inject the finished HTML back into your Content Management System (CMS).

## 🚀 Key Features

* **One-Click Page Generation:** Select JSON data on your screen and generate an entire SEO-optimized landing page, blog post, or case study.
* **Industry-Tailored AI Prompts:** Custom prompt engineering engines (`ifactoryapp.js` and `oxmaint.js`) specifically tailored to output authoritative content for:
  * **iFactory:** Industry 4.0, Predictive Maintenance, Smart Factory Analytics.
  * **Oxmaint:** CMMS, Maintenance Checklists, Work Order Management, Facility Safety.
* **Strict UI/UX Enforcement:** The AI is strictly constrained to produce pixel-perfect, modern UI designs. It uses Flexbox `gap` for mathematically perfect spacing, prevents vertical card stretching (`align-items: flex-start`), and enforces professional typography and brand colors.
* **Dynamic Image Generation:** Automatically generates high-quality, corporate, text-free images related to the content topic via Pollinations AI.
* **Auto-Fill Injection:** Once the backend returns the perfectly crafted HTML, the Chrome Extension automatically parses it and injects it into the respective input fields of your CMS.

## 📂 Project Structure

### 1. Chrome Extension (Frontend)
The frontend is a Chrome Extension that adds action buttons to specific pages to trigger the automation flow.
* `manifest.json`: Configuration file for the Chrome Extension.
* `autofill-json-data.js`: The main content script that injects the "Generate + Fill Page" button, sends data to the backend, and handles injecting the returned HTML into the page.
* `select-&-copy-json.js`: Script allowing users to easily select and copy JSON data from the UI.
* `background.js`: Handles background event routing for the extension.

### 2. Node.js Server (Backend)
The backend acts as the bridge between the extension and the DeepSeek AI model.
* `backend/server.js`: An Express.js server that handles the `/generate-page` endpoint. It processes incoming JSON, generates images, and routes the data to the correct AI prompt generator.
* `backend/prompts/ifactory/ifactoryapp.js`: DeepSeek prompt rules for iFactory content generation.
* `backend/prompts/oxmaint/oxmaint.js`: DeepSeek prompt rules for Oxmaint content generation.
* `.env`: Environment variables (holds your `DEEPSEEK_API_KEY`).

## 🛠️ Installation & Setup

### Setting up the Backend
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (if not already present) and add your API key:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   PORT=5000
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   *The server should now be running on `http://localhost:3000`.*

### Installing the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button in the top left.
4. Select the root folder of this project (`auto-fill-page-json-data`).
5. The extension is now active and will inject its UI elements on the allowed URLs specified in your content scripts.

## 🎨 Design Philosophy
The AI has been heavily strictly prompted to ignore basic, boring HTML structures and instead output highly creative, engaging layouts. It relies entirely on standard CSS inside a `<style>` block, utilizing rich elements like Zig-Zag content sections, subtle box-shadows, responsive tables, and elegant data cards. It is forbidden from using generic tags like `<h1>` or inline styles.
