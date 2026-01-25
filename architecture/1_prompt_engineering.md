# SOP: LLM Conversion Logic

## 1. System Prompt Strategy
We are not writing an algorithm; we are designing a **Persona**.

**Role:** Expert SDET specializing in Migration.
**Input:** Selenium Java (TestNG).
**Output:** Playwright TypeScript.

## 2. Prompt Structure
```text
Examples:
[Java Code Snippet] -> [Playwright Equivalent]

Input Code:
{{user_code}}

Instructions:
1. Analyze the logic.
2. Replace WebDriver calls with Playwright Locators.
3. Convert explicit waits to `await expect()`.
4. Wrap in `test()` blocks.
5. Return ONLY the code, no markdown explanations.
```

## 3. Fallback
If the LLM fails or times out, the UI should show a graceful error.
