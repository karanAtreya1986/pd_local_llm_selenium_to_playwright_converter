const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://127.0.0.1:11434';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', async (req, res) => {
    try {
        const response = await axios.get(OLLAMA_URL);
        res.json({ status: 'ok', ollama: 'connected', data: response.data });
    } catch (error) {
        res.status(503).json({ status: 'error', ollama: 'unreachable', message: error.message });
    }
});

app.post('/api/convert', async (req, res) => {
    const { inputCode, model } = req.body;

    if (!inputCode) {
        return res.status(400).json({ error: "inputCode is required" });
    }

    const targetModel = model || 'tinyllama';

    const systemPrompt = `You are a coding assistant. Convert the Selenium Java code to Playwright TypeScript.

    Example:
    Input:
    driver.findElement(By.id("user")).sendKeys("test");

    Output:
    await page.locator('#user').fill('test');
    `;

    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: targetModel,
            prompt: `Convert this Java Selenium code to Playwright TypeScript:\n\n${inputCode}\n\nTypeScript Code:`,
            system: systemPrompt,
            stream: false
        });

        let generatedText = response.data.response;

        // Post-processing: Remove Markdown code blocks if present
        const codeBlockRegex = /```(?:typescript|ts)?\s*([\s\S]*?)```/i;
        const match = generatedText.match(codeBlockRegex);
        if (match) {
            generatedText = match[1];
        }

        // Post-processing: specific cleanups for common hallucinations
        generatedText = generatedText
            .replace(/^Here is the.*?code:?/im, '') // Remove "Here is the code"
            .replace(/^TypeScript Code:?/im, '')    // Remove "TypeScript Code:" header
            .trim();

        res.json({
            result: generatedText,
            meta: {
                duration: response.data.total_duration,
                model: targetModel
            }
        });

    } catch (error) {
        console.error("Ollama Error:", error.message);
        res.status(500).json({ error: "Failed to generate code from Ollama", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Proxy running on http://localhost:${PORT}`);
});
