import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Sparkles, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3001/api/convert';

function App() {
  const [inputCode, setInputCode] = useState<string>('// Paste your Selenium Java code here\nimport org.openqa.selenium.WebDriver;\n\npublic class Test {\n    @Test\n    public void login() {\n        driver.findElement(By.id("user")).sendKeys("admin");\n        driver.findElement(By.id("pass")).sendKeys("1234");\n        driver.findElement(By.id("login")).click();\n    }\n}');
  const [outputCode, setOutputCode] = useState<string>('// Playwright code will appear here...');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputCode, model: 'tinyllama' })
      });

      const data = await res.json();
      if (data.result) {
        setOutputCode(data.result);
      } else {
        setOutputCode('// Error: ' + (data.error || 'Unknown error occurred'));
      }
    } catch (e) {
      setOutputCode('// Connection Error: Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col p-4 gap-4">
      {/* Header */}
      <header className="glass-panel p-4 rounded-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Code2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Selenium → Playwright</h1>
            <p className="text-xs text-gray-400">Powered by Local LLM (Ollama)</p>
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? <div className="spinner" /> : <Sparkles className="w-4 h-4" />}
          {isLoading ? 'Converting...' : 'Convert Code'}
        </button>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-2 gap-4 min-h-0">

        {/* Left Panel (Input) */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
            <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Java (Selenium)
            </span>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="java"
              theme="vs-dark"
              value={inputCode}
              onChange={(val) => setInputCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </div>
        </div>

        {/* Right Panel (Output) */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden relative">
          <div className="p-3 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
            <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              TypeScript (Playwright)
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors text-gray-400 hover:text-white"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="spinner w-8 h-8 border-t-purple-500 border-2"></div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-sm text-purple-300 font-medium"
                  >
                    AI is thinking...
                  </motion.p>
                </div>
              </div>
            )}
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={outputCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </div>
        </div>

      </main>

      {/* Footer Status */}
      <footer className="glass-panel p-2 px-4 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-xs text-gray-400 font-mono">System Status: Online</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Model: tinyllama
        </div>
      </footer>
    </div>
  );
}

export default App;
