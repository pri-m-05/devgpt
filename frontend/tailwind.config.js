// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // use the 'dark' class to switch
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // custom gradient stops for pink-purple-blue
          "purple-start": "#6B21A8",
          "blue-mid":   "#3B82F6",
          "pink-end":   "#EC4899",
        },
      },
    },
    plugins: [],
  };
  