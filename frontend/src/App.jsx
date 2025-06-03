// src/App.jsx
import { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import Sidebar from "./components/Sidebar";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);

  // On mount, set <html> class based on default dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer returned.");
    } catch (err) {
      setAnswer("Error fetching answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with title and dark/light toggle */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-white dark:text-gray-100">
          DevGPT Code Navigator
        </h1>
        <button
          onClick={() => setIsDark((d) => !d)}
          className="px-3 py-1 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Main container: Code editor on left, sidebar on right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: CodeEditor */}
        <div className="w-2/3 border-r border-gray-300 dark:border-gray-700">
          <CodeEditor
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {/* Ask button */}
          <div className="p-4 bg-white dark:bg-gray-800">
            <button
              onClick={handleAsk}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask DevGPT"}
            </button>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-1/3 bg-white dark:bg-gray-900 overflow-auto">
          <Sidebar answer={answer} />
        </div>
      </div>
    </div>
  );
}

export default App;
