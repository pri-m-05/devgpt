// devgpt/frontend/src/components/CodeInputForm.jsx
import React, { useState } from "react";

export default function CodeInputForm({ setResponseText }) {
  const [repoPath, setRepoPath] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    if (!repoPath.trim()) {
      alert("Please provide a repository or code‐path first.");
      return;
    }
    setLoading(true);
    try {
      // 1) POST to /api/initialize with { code_path }
      const initRes = await fetch("/api/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code_path: repoPath })
      });
      if (!initRes.ok) {
        throw new Error(`Initialization failed (status ${initRes.status})`);
      }

      // 2) POST to /api/ask with { question }
      const askRes = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });
      if (!askRes.ok) {
        throw new Error(`Ask failed (status ${askRes.status})`);
      }

      const askData = await askRes.json();
      setResponseText(askData.answer);
    } catch (err) {
      console.error(err);
      setResponseText(`⚠️ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        DevGPT Playground
      </h1>

      {/* Repository / Code‐Path Input */}
      <div className="flex flex-col">
        <label
          htmlFor="repo-path"
          className="mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          Repository / Code Path:
        </label>
        <input
          id="repo-path"
          type="text"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          placeholder="e.g. ./core  or  https://github.com/username/repo"
          className="
            w-full
            px-3 py-2
            bg-white dark:bg-gray-900
            text-gray-800 dark:text-gray-100
            border border-gray-300 dark:border-gray-600
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primaryPurple-400
          "
        />
      </div>

      {/* Question Input */}
      <div className="flex flex-col">
        <label
          htmlFor="question-input"
          className="mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          Question:
        </label>
        <textarea
          id="question-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder="e.g. What does the embedder do?"
          className="
            w-full
            px-3 py-2
            bg-white dark:bg-gray-900
            text-gray-800 dark:text-gray-100
            border border-gray-300 dark:border-gray-600
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primaryPurple-400
          "
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleInitialize}
        disabled={loading}
        className={`
          inline-block px-5 py-2
          font-semibold text-white
          rounded-lg
          focus:outline-none
          ${
            loading
              ? "bg-primaryBlue-300 cursor-not-allowed"
              : "bg-primaryBlue-500 hover:bg-primaryBlue-600"
          }
        `}
      >
        {loading ? "Loading…" : "Submit"}
      </button>
    </div>
  );
}
