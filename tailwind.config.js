/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arcane: {
          bg: "#0b1114", panel: "#121c20", border: "#28383a",
          gold: "#d6b46a", purple: "#7562a8", cyan: "#68c8bd",
          red: "#dc625d", green: "#79bd82", blue: "#6da9d2",
        },
      },
      fontFamily: { arcane: ["Trebuchet MS", "Segoe UI", "sans-serif"] },
    },
  },
  plugins: [],
};
