// frontend/src/App.jsx

import React, { useState } from "react";

function App() {
  // Theme state: true = dark mode, false = light mode
  const [darkMode, setDarkMode] = useState(true);

  // Path input state
  const [path, setPath] = useState("");

  // Embedding state
  const [numChunks, setNumChunks] = useState(null);
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [embedError, setEmbedError] = useState(null);

  // Question/Answer state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [questionError, setQuestionError] = useState(null);

  // Toggle between dark mode and light mode
  function toggleTheme() {
    setDarkMode(prev => !prev);
  }

  // Called when the user clicks “Load Path” to chunk & embed
  async function handleLoadEmbed() {
    if (!path.trim()) {
      setEmbedError("Please enter a valid directory path.");
      return;
    }

    setEmbedError(null);
    setLoadingEmbed(true);
    setNumChunks(null);
    setAnswer(""); // Clear previous answer
    try {
        const resp = await fetch("http://localhost:5000/api/load_and_embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directory: path.trim() }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        setEmbedError(err.error || "Unknown error");
        setLoadingEmbed(false);
        return;
      }

      const body = await resp.json(); // { status: "ok", num_chunks: <number> }
      setNumChunks(body.num_chunks);
    } catch (e) {
      setEmbedError(e.message || "Network error");
    } finally {
      setLoadingEmbed(false);
    }
  }

  // Called when the user submits the question form
  async function handleAskQuestion(event) {
    event.preventDefault();
    if (!question.trim()) {
      setQuestionError("Please enter a question.");
      return;
    }
    setQuestionError(null);
    setAsking(true);
    setAnswer("");
    try {
        const resp = await fetch("http://localhost:5000/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        setQuestionError(err.error || "Unknown error");
        setAsking(false);
        return;
      }

      const body = await resp.json(); // { answer: "<LLM response>" }
      setAnswer(body.answer);
    } catch (e) {
      setQuestionError(e.message || "Network error");
    } finally {
      setAsking(false);
    }
  }

  // Theme-dependent gradients
  const darkGradient = "linear-gradient(to bottom right, #7e57c2, #42a5f5, #ec407a)";
  const lightGradient = "linear-gradient(to bottom right, #f3e5f5, #e3f2fd, #fce4ec)";

  // Code window styling (monospace, tinted background)
  const codeWindowStyle = {
    backgroundColor: darkMode ? "#1e1e1e" : "#fafafa",
    color: darkMode ? "#e0e0e0" : "#1e1e1e",
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: "14px",
    padding: "1rem",
    borderRadius: "4px",
    height: "300px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    flex: 1,
    boxShadow: darkMode
      ? "0 0 10px rgba(0, 0, 0, 0.5)"
      : "0 0 10px rgba(200, 200, 200, 0.5)"
  };

  // Sidebar styling
  const sidebarStyle = {
    backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
    color: darkMode ? "#f0f0f0" : "#333333",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    padding: "1rem",
    borderRadius: "4px",
    width: "30%",
    marginLeft: "1rem",
    boxShadow: darkMode
      ? "0 0 10px rgba(0, 0, 0, 0.5)"
      : "0 0 10px rgba(200, 200, 200, 0.5)",
    overflowY: "auto",
    height: "300px"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? darkGradient : lightGradient,
        color: darkMode ? "#ffffff" : "#000000",
        transition: "background 0.3s, color 0.3s",
        padding: "1rem",
        boxSizing: "border-box"
      }}
    >
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ flex: 1, margin: 0 }}>DevGPT</h1>
        <button
          onClick={toggleTheme}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: darkMode ? "#ec407a" : "#7e57c2",
            color: "#ffffff",
            fontWeight: "bold"
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Path Input & Load Button */}
      <section style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
        <label htmlFor="pathInput" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
          Repository Path:
        </label>
        <input
          id="pathInput"
          type="text"
          value={path}
          onChange={e => setPath(e.target.value)}
          placeholder="e.g. frontend/src"
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontFamily: "inherit",
            marginRight: "0.5rem"
          }}
        />
        <button
          onClick={handleLoadEmbed}
          disabled={loadingEmbed}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: darkMode ? "#42a5f5" : "#ec407a",
            color: "#ffffff",
            fontWeight: "bold"
          }}
        >
          {loadingEmbed ? "Loading…" : "Load Path"}
        </button>
      </section>
      {embedError && <p style={{ color: "#ff6666", marginBottom: "1rem" }}>{embedError}</p>}
      {numChunks !== null && !loadingEmbed && (
        <p style={{ marginBottom: "1rem" }}>
          ✅ Embedded <strong>{numChunks}</strong> code chunks.
        </p>
      )}

      {/* Question Input & Ask Button */}
      <section style={{ marginBottom: "1rem" }}>
        <form onSubmit={handleAskQuestion}>
          <label htmlFor="qInput" style={{ fontWeight: "bold" }}>
            Ask your codebase:
          </label>
          <br />
          <textarea
            id="qInput"
            rows={3}
            cols={80}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. How does the login flow work?"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              marginTop: "0.5rem",
              boxSizing: "border-box"
            }}
          />
          <br />
          <button
            type="submit"
            disabled={asking || loadingEmbed}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: darkMode ? "#ec407a" : "#7e57c2",
              color: "#ffffff",
              fontWeight: "bold"
            }}
          >
            {asking ? "Thinking…" : "Ask DevGPT"}
          </button>
        </form>
        {questionError && (
          <p style={{ color: "#ff6666", marginTop: "0.5rem" }}>{questionError}</p>
        )}
      </section>

      {/* Two-Column Layout: Left = Code Window; Right = Sidebar */}
      <section style={{ display: "flex", gap: "1rem" }}>
        {/* Left: “Code Editor” Window (answer shown here) */}
        <div style={codeWindowStyle}>
          {answer
            ? answer
            : "// The answer from DevGPT will appear here in code-editor style\n"}
        </div>

        {/* Right: Sidebar (plain text) */}
        <div style={sidebarStyle}>
          <h3>Response</h3>
          {answer ? (
            <p>{answer}</p>
          ) : (
            <p style={{ fontStyle: "italic", color: darkMode ? "#aaa" : "#666" }}>
              The DevGPT response will appear here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
