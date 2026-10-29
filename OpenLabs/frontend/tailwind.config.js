/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#09090b",
        surface: {
          DEFAULT: "#18181b",
          elevated: "#27272a",
          highlight: "#3f3f46",
        },
        border: {
          DEFAULT: "#27272a",
          subtle: "#3f3f46",
          active: "#52525b",
        },
        primary: {
          DEFAULT: "#10b981",
          hover: "#059669",
          muted: "rgba(16, 185, 129, 0.15)",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#0891b2",
          muted: "rgba(6, 182, 212, 0.15)",
        },
        status: {
          approved: "#10b981",
          waitlisted: "#f59e0b",
          checked_in: "#3b82f6",
          disputed: "#ef4444",
          completed: "#8b5cf6",
          verifying: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Courier New", "monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        scanBeam: {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
        "scan-beam": "scanBeam 3s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
