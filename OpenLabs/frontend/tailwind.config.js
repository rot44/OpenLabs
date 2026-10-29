/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sandstone, Limestone, Cobalt, Rust, Weathered Stone, Earth Ink Palette
        sandstone: {
          DEFAULT: "#E9DFCE", // Main background
          light: "#F1EAE0",
          dark: "#DDD0BD",
          border: "#D8CCBA",
        },
        limestone: {
          DEFAULT: "#F6F1E8", // Cards
          light: "#FAF7F2",
          dark: "#EDE4D6",
          border: "#E2D8C7",
        },
        cobalt: {
          DEFAULT: "#2547A8", // Primary brand
          hover: "#1D3886",
          dark: "#162B67",
          light: "#395EC6",
          muted: "rgba(37, 71, 168, 0.08)",
          subtle: "rgba(37, 71, 168, 0.15)",
        },
        rust: {
          DEFAULT: "#B65D3F", // Accent
          hover: "#A04F33",
          dark: "#893F25",
          light: "#CA7355",
          muted: "rgba(182, 93, 63, 0.10)",
          subtle: "rgba(182, 93, 63, 0.20)",
        },
        weathered: {
          DEFAULT: "#C8B89E", // Secondary surfaces
          light: "#D8CCB7",
          dark: "#B4A388",
          muted: "rgba(200, 184, 158, 0.35)",
        },
        earthInk: {
          DEFAULT: "#332F29", // Text: Deep Earth Ink
          muted: "#5A534A",
          faint: "#7D7569",
          light: "#9E9588",
          subtle: "rgba(51, 47, 41, 0.06)",
        },

        // Semantic aliases
        canvas: "#E9DFCE",
        surface: {
          DEFAULT: "#F6F1E8",
          secondary: "#C8B89E",
          elevated: "#FAF7F2",
          muted: "#EDE4D6",
        },
        border: {
          DEFAULT: "#D8CCBA",
          subtle: "#E5DCCE",
          active: "#2547A8",
        },
        primary: {
          DEFAULT: "#2547A8",
          hover: "#1D3886",
          muted: "rgba(37, 71, 168, 0.12)",
        },
        accent: {
          DEFAULT: "#B65D3F",
          hover: "#A04F33",
          muted: "rgba(182, 93, 63, 0.12)",
        },
        status: {
          approved: "#1F8758",
          waitlisted: "#B65D3F",
          checked_in: "#2547A8",
          disputed: "#C0392B",
          completed: "#5A534A",
          verifying: "#2547A8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Courier New", "monospace"],
      },
      boxShadow: {
        "stone-sm": "0 1px 3px rgba(51, 47, 41, 0.05), 0 1px 2px rgba(51, 47, 41, 0.03)",
        "stone-md": "0 4px 12px rgba(51, 47, 41, 0.06), 0 2px 4px rgba(51, 47, 41, 0.04)",
        "stone-lg": "0 10px 24px -3px rgba(51, 47, 41, 0.08), 0 4px 8px -2px rgba(51, 47, 41, 0.04)",
        "stone-xl": "0 20px 30px -4px rgba(51, 47, 41, 0.10), 0 8px 12px -3px rgba(51, 47, 41, 0.06)",
        "cobalt-glow": "0 0 20px rgba(37, 71, 168, 0.25)",
        "rust-glow": "0 0 20px rgba(182, 93, 63, 0.25)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.04)" },
        },
        scanBeam: {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
        "scan-beam": "scanBeam 2.5s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
