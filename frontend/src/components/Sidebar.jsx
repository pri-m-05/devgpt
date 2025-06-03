import React from "react";

/**
 * Sidebar simply renders whatever text was returned by the LLM.
 */
export default function Sidebar({ responseText }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Responses
      </h2>
      <div className="space-y-2">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
          {responseText}
        </pre>
      </div>
    </div>
  );
}
