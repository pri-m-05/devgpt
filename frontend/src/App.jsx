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

  // Called when the user clicks "Load Path" to chunk & embed
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
      const resp = await fetch("/api/load_and_embed", {
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
      const resp = await fetch("/api/question", {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? darkGradient : lightGradient,
        color: darkMode ? "#ffffff" : "#000000",
        transition: "background 0.3s, color 0.3s",
        padding: "1rem",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* Centered, Times New Roman bold DevGPT logo (larger) */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "4.5rem",
            fontWeight: 700,
            color: darkMode ? "#ec407a" : "#7e57c2",
            fontFamily: "'Times New Roman', Times, serif",
            margin: 0,
            textShadow: darkMode
              ? "0 2px 16px #000, 0 1px 0 #fff"
              : "0 2px 16px #ccc, 0 1px 0 #fff",
            letterSpacing: "0.04em",
            lineHeight: 1.1
          }}
        >
          DevGPT
        </h1>
      </div>
      {/* Dark mode button in top right */}
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          padding: "0.5rem 1.5rem",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          backgroundColor: darkMode ? "#ec407a" : "#7e57c2",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "1rem",
          zIndex: 10
        }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      {/* Path input and load button, centered and even wider */}
      <section style={{ marginBottom: "2rem", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", width: "80%", minWidth: 500, maxWidth: 1200 }}>
          <label htmlFor="pathInput" style={{ fontWeight: "bold", marginRight: "0.5rem", whiteSpace: "nowrap" }}>
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
              fontFamily: "inherit"
            }}
          />
          <button
            onClick={handleLoadEmbed}
            disabled={loadingEmbed}
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: darkMode ? "#42a5f5" : "#8d2eff",
              color: "#fff",
              fontWeight: "bold",
              whiteSpace: "nowrap"
            }}
          >
            {loadingEmbed ? "Loading..." : "Load Path"}
          </button>
        </div>
      </section>
      {embedError && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p style={{ color: "#ff6666", marginTop: "-1rem", marginBottom: "1rem", width: "80%", maxWidth: 1200 }}>{embedError}</p>
        </div>
      )}
      {numChunks !== null && !embedError && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p style={{ color: darkMode ? "#90caf9" : "#512da8", marginTop: "-1rem", marginBottom: "1rem", width: "80%", maxWidth: 1200 }}>
            Embedded {numChunks} code chunks.
          </p>
        </div>
      )}
      {/* Question Input & Ask Button, centered and even wider */}
      <section style={{ marginBottom: "2rem", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <form onSubmit={handleAskQuestion} style={{ display: "flex", alignItems: "center", width: "80%", minWidth: 500, maxWidth: 1200 }}>
          <label htmlFor="qInput" style={{ fontWeight: "bold", marginRight: "0.5rem", whiteSpace: "nowrap" }}>
            Ask your codebase:
          </label>
          <textarea
            id="qInput"
            rows={3}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. How does the login flow work?"
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              marginRight: "0.5rem",
              resize: "vertical"
            }}
          />
          <button
            type="submit"
            disabled={asking || loadingEmbed}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: darkMode ? "#ec407a" : "#7e57c2",
              color: "#ffffff",
              fontWeight: "bold",
              whiteSpace: "nowrap"
            }}
          >
            {asking ? "Thinking…" : "Ask DevGPT"}
          </button>
        </form>
      </section>
      {questionError && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p style={{ color: "#ff6666", marginTop: "-1rem", marginBottom: "1rem", width: "80%", maxWidth: 1200 }}>{questionError}</p>
        </div>
      )}
      {/* Single Response Box (code editor style), centered and even wider */}
      <section style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div style={{ ...codeWindowStyle, width: "80%", minWidth: 500, maxWidth: 1200 }}>
          {answer
            ? answer
            : "// The answer from DevGPT will appear here in code-editor style\n"}
        </div>
      </section>
    </div>
  );
}

export default App;
