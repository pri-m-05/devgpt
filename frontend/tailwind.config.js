// devgpt/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode via the `dark` class on <html>
  darkMode: "class",

  // Tell Tailwind which files to scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        // Custom pink ⇢ purple ⇢ blue palette
        // Adjust these hex codes as desired for stronger/fainter shades.
        "pink-end": {
          50:  "#ffe5e5",
          100: "#ffb8b8",
          200: "#ff8a8a",
          300: "#ff5c5c",
          400: "#ff2e2e",
          500: "#ff007a",   // “hot” pink
          600: "#e6006b",
          700: "#b30053",
          800: "#80003a",
          900: "#4d001f"
        },
        "purple-start": {
          50:  "#f2e5ff",
          100: "#d9b8ff",
          200: "#c08aff",
          300: "#a65cff",
          400: "#8d2eff",
          500: "#7300ff",
          600: "#6600e6",
          700: "#4d00b3",
          800: "#330080",
          900: "#1a004d"
        },
        "blue-mid": {
          50:  "#e5f0ff",
          100: "#b8d1ff",
          200: "#8ab3ff",
          300: "#5c94ff",
          400: "#2e75ff",
          500: "#0056ff",
          600: "#004de6",
          700: "#003bb3",
          800: "#002880",
          900: "#00154d"
        }
      }
    }
  },
  plugins: []
};
