import React from "react";

/**
 * A purely presentational “code editor” window.
 * In this example, it’s just a <textarea> styled like a code editor.
 * (You could swap it out for Monaco or CodeMirror if you like.)
 */
export default function CodeEditor() {
  return (
    <div className="h-full">
      <textarea
        className="
          w-full h-full
          bg-white dark:bg-gray-900
          text-black dark:text-white
          font-mono text-sm
          p-2
          rounded-lg
          focus:outline-none
          border border-gray-300 dark:border-gray-600
        "
        placeholder="// Write your code here…"
      />
    </div>
  );
}
