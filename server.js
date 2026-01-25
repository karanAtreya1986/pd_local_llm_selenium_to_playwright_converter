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

    const targetModel = model || 'codellama';

    const systemPrompt = `You are an expert SDET. Convert the following Selenium Java code to Idiomatic Playwright TypeScript.
    Rules:
    - Return ONLY the TypeScript code.
    - No markdown formatting (like \`\`\`).
    - Use 'await page.locator(...)' instead of driver.findElement.
    - Wrap in 'test' blocks.
    `;

    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: targetModel,
            prompt: inputCode,
            system: systemPrompt,
            stream: false
        });

        res.json({ 
            result: response.data.response, 
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
