// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ answer }) {
  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        DevGPT Response
      </h2>
      <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
        {answer || "No response yet."}
      </pre>
    </div>
  );
}
