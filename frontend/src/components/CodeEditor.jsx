// src/components/CodeEditor.jsx
import React from "react";

export default function CodeEditor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder="Type your question or paste code here..."
      className="
        w-full h-full p-4
        bg-gray-100 dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        font-mono text-sm
        focus:outline-none resize-none
      "
      style={{ lineHeight: "1.5rem" }}
    />
  );
}
