/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arcane: {
          bg: "#0a0612", panel: "#140a1f", border: "#2a1a3e",
          gold: "#c9a04d", purple: "#7c3aed", cyan: "#06b6d4",
          red: "#dc2626", green: "#16a34a", blue: "#2563eb",
        },
      },
      fontFamily: { arcane: ["Georgia", "serif"] },
    },
  },
  plugins: [],
};