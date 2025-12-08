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
        admin: {
          base: "#0c1426",
          card: "#111c2d",
          header: "#121d36",
          input: "#0f192f",
        },
        // Purple-tinted light theme colors
        light: {
          bg: "#faf8fc",        // Main background - subtle lavender
          surface: "#fdfcfe",   // Cards/surfaces - almost white with purple hint
          muted: "#f5f3f7",     // Muted backgrounds - light purple-gray
          border: "#e9e4f0",    // Borders - soft purple-gray
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
