# ResearchAtlas AI 🔬📑

**Evidence-Grounded Academic Research Paper Analysis & Synthesis Engine**

ResearchAtlas AI is a production-quality web application built with React, TypeScript, Express, and Google Gemini (`gemini-3.8-flash`) designed for doctoral-level research paper synthesis, methodological deconstruction, and literature evaluation.

---

## 🌟 Core Features

1. **Multi-Modal Paper Ingestion**:
   - In-browser PDF extraction with live page-by-page progress reporting.
   - Direct paper text pasting with character counts and format validation.
   - One-click verified Demo Papers (Spatio-Temporal Graph Neural Networks for Urban Metro Congestion and Dual-Branch Residual CNN for Plant Pathology) for instant testing without requiring an API key.

2. **Strict Epistemic & Evidence-Based Grounding**:
   - Zero hallucination protocol: Never fabricates citations, statistical p-values, or baseline metrics.
   - Explicitly flags unstated parameters or withheld datasets with `[NOT REPORTED IN PAPER]`.
   - Distinguishes author-verified empirical results from author hypotheses and future suggestions.
   - Extracts verbatim author quotes with section anchors for evidentiary verification.

3. **Tabbed Academic Synthesis**:
   - **Overview**: Plain-language executive summary, core research bottleneck, key technical contribution, author-verified highlights, and publication readiness audit.
   - **Methods**: Methodological narrative, mathematical formulations, algorithmic stack, datasets with sample counts and access types, and step-by-step tensor processing pipelines.
   - **Results**: Verified empirical metrics table with reported scores, baseline comparisons, ablation outcomes, and statistical significance analysis.
   - **Research Gaps**: Author-acknowledged limitations, unaddressed research questions, sampling biases, threats to validity, and missing source sections.
   - **Project Ideas**: Three graduated, feasible student project extensions (Beginner, Intermediate, Advanced) complete with prerequisite tech stacks, phased weekly roadmaps, and pitfall mitigations.
   - **Architecture**: Safe interactive Mermaid (`graph TD`) diagram with pan/zoom controls, SVG scaling, copy source code, and automatic syntax error fallback.
   - **Ask the Paper**: Grounded follow-up Q&A assistant citing verbatim text and explicitly flagging queries about unmodeled or unstated details.

4. **Multi-Format Export**:
   - Structured JSON export for programmatic consumption and database ingestion.
   - Academic Executive Briefing formatted in clean, human-readable TXT.

---

## 🔒 Security Architecture

- **Server-Side API Isolation**: In compliance with Google AI Studio guidelines, the `@google/genai` SDK is instantiated solely in server-side code (`server.ts`). Private Gemini API keys are never exposed in browser bundles, network inspection tabs, or exported artifacts.
- **Payload Validation**: Inputs are sanitized and bounded against excessive memory exhaustion.
- **Safe Mermaid Rendering**: Flowcharts are parsed and rendered in isolated containers with strict alphanumeric node escaping.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```bash
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```
   *Note: In Google AI Studio, `GEMINI_API_KEY` is automatically injected from the Secrets panel at runtime.*

### Running the Application

- **Development Mode** (Runs Express server with Vite middleware on port 3000):
  ```bash
  npm run dev
  ```
  Open `http://localhost:3000` in your browser.

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

---

## 🧪 Testing the Application

### 1. Instant Demo Testing (Zero API Calls Required)
- Click **"Metro Congestion GNN"** or **"Tomato Blight CNN"** on the home screen or the **"Load Demo Paper"** button in the header.
- Explore all 7 tabs, inspect the rendered Mermaid architecture diagram, review the 3 student project blueprints, and test the grounded Q&A module.
- Test exporting both JSON and TXT reports.

### 2. Testing Custom PDF Uploads
- Click the **"Upload PDF Document"** tab.
- Drag and drop any academic PDF paper (e.g., from arXiv).
- Observe real-time page extraction progress and character count verification.
- Click **"Begin Paper Analysis"** to generate the Gemini synthesis.

### 3. Testing Grounded Q&A
- In the **"Ask the Paper"** tab, ask queries like:
  - *"What are the primary hardware or compute requirements reported?"*
  - *"What baseline models were evaluated?"*
  - *"Does the paper provide an open-source GitHub code link?"*
- Observe how the model provides verbatim evidence or explicitly reports `[NOT REPORTED IN PAPER]`.

---

## 📊 Exporting Analysis

- Click **"Export JSON"** to download `[paper_title]_atlas_analysis.json`.
- Click **"Export TXT"** to download an executive text briefing suitable for inclusion in literature reviews or thesis outlines.

---

## 📄 License
Apache-2.0
