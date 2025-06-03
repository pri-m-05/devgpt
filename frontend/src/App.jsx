import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import Sidebar from "./components/Sidebar";

export default function App() {
  // We keep state for repository path, question text, and the LLM response:
  const [repoPath, setRepoPath] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("No response yet.");
  const [chunksInitialized, setChunksInitialized] = useState(false);

  // 1) Initialize: send POST to /api/initialize with { code_path: repoPath }
  const handleInitialize = async () => {
    try {
      const initRes = await fetch("http://127.0.0.1:5000/api/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_path: repoPath })
      });
      if (!initRes.ok) {
        const text = await initRes.text();
        setResponse(`Initialization failed:\n${text}`);
        return;
      }
      const initJson = await initRes.json();
      setResponse(`Initialization complete:\n${initJson.num_chunks} chunks embedded.`);
      setChunksInitialized(true);
    } catch (err) {
      setResponse(`Error talking to server:\n${err.message}`);
    }
  };

  // 2) Ask: send POST to /api/ask with { question } once initialization done
  const handleAsk = async () => {
    if (!chunksInitialized) {
      setResponse("⚠️ Please initialize first (Embed chunks).");
      return;
    }
    try {
      const askRes = await fetch("http://127.0.0.1:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      if (!askRes.ok) {
        const text = await askRes.text();
        setResponse(`Ask failed:\n${text}`);
        return;
      }
      const askJson = await askRes.json();
      setResponse(askJson.answer);
    } catch (err) {
      setResponse(`Error talking to server:\n${err.message}`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar: inputs + buttons */}
      <div className="flex items-center p-2 space-x-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <input
          type="text"
          placeholder="Repo path (e.g. ./core)"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        <button
          onClick={handleInitialize}
          className="px-4 py-1 bg-purple-start text-white rounded-md hover:bg-purple-end transition"
        >
          Embed Chunks
        </button>
        <input
          type="text"
          placeholder="Your question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        <button
          onClick={handleAsk}
          className="px-4 py-1 bg-blue-accent text-white rounded-md hover:bg-pink-accent transition"
        >
          Ask
        </button>
        {/* Theme toggle */}
        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
          className="px-3 py-1 bg-pink-accent text-white rounded-md hover:bg-purple-end transition"
        >
          Toggle Theme
        </button>
      </div>

      {/* Main content: left = code editor; right = response sidebar */}
      <div className="flex flex-1">
        {/* Code Editor Pane */}
        <div
          className="w-2/3 p-4"
          style={{
            /* 
               Use our CSS variable for background.
               In dark mode (<html class="dark">), --bg-gradient is the purple→blue gradient.
               In light mode, --bg-gradient-light is a pastel gradient.
            */
            backgroundImage: document.documentElement.classList.contains("dark")
              ? "var(--bg-gradient)"
              : "var(--bg-gradient-light)"
          }}
        >
          <CodeEditor />
        </div>

        {/* Sidebar Pane */}
        <div className="w-1/3 p-4 bg-white dark:bg-gray-700 border-l border-gray-300 dark:border-gray-600 overflow-auto">
          <Sidebar responseText={response} />
        </div>
      </div>
    </div>
  );
}
