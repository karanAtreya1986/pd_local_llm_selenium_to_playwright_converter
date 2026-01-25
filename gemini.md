# Project Constitution (gemini.md)

## 1. Data Schemas
- **Input:** `SeleniumJavaCode` (String).
- **Output:** `PlaywrightTSCode` (String).
- **Payload:** `ConversionRequest` { inputCode: string, model: "codellama" }

## 2. Behavioral Rules
- **Engine:** Use **Local LLM (Ollama)** with model `codellama` for conversion.
- **Reliability:** The converter must produce valid, runnable Playwright code.
- **Idiomatic:** Generated code should use Playwright best practices.
- **Readability:** Prioritize readability over strict 1:1 mapping.

## 3. Architectural Invariants
- **UI First:** React/Vite.
- **AI Core:** Logic is delegated to the Local LLM. We do not write a manual AST parser anymore.
- **Middleware:** A lightweight Node.js Proxy is likely needed to handle CORS for Ollama.


