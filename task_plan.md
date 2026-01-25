# Task Plan: Selenium Java to Playwright JS/TS Converter

## Phase 1: Blueprint (Discovery & Logic)
- [x] Answer Discovery Questions
- [x] Define Data Schema in `gemini.md`
- [ ] **Architecture Design:** Decide on Parsing Strategy (Regex vs AST).
    - *Note:* Since we are running local, a simple Node.js backend with a React UI is best.
- [ ] Create `architecture/1_conversion_logic.md` SOP.

## Phase 1: Blueprint (Discovery & Logic)
- [x] Answer Discovery Questions
- [x] Define Data Schema in `gemini.md`
- [x] **Architecture Pivot:** Use Local LLM (Ollama) instead of Manual Parser.
- [ ] Create `architecture/1_prompt_engineering.md` SOP (The new logic layer).

## Phase 2: Link (Connectivity)
- [ ] Initialize Vite Project (React + TypeScript).
- [ ] Initialize Express Proxy (to bridge UI -> Ollama).
- [ ] **Verification:** Create script `tools/test_ollama.js` to ping `localhost:11434`.

## Phase 3: Architecture (The 3-Layer Build)
- [ ] **Layer 1:** Define Prompt Templates (System Prompt for "Selenium -> Playwright").
- [ ] **Layer 2:** Build the Node.js Server (Router/Controller).
- [ ] **Layer 3:** Build the UI Components (CodeMirror/Monaco for input/output).

## Phase 4: Stylize (Refinement & UI)
- [ ] **UI Design:** "Premium" Modern Dark UI.
- [ ] **Feedback Loop:** Allow user to "Refine" the output by sending follow-up prompts.
