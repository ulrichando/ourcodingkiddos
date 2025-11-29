/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enable class-based dark mode so the header toggle works
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "Quicksand", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          sky: "#5ac8fa",
          mint: "#2dd4bf",
          sun: "#fbbf24",
          grape: "#a855f7",
          ink: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
