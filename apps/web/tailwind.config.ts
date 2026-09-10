import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#EEF0F5",
        card: "#FFFFFF",
        "card-border": "#E5E7EB",
        primary: {
          DEFAULT: "#4B49E9",
          hover: "#3B39D4",
          light: "#EEF0FF",
        },
        navy: {
          DEFAULT: "#131622",
          surface: "#1A1E2E",
          card: "#23283D",
          border: "rgba(255, 255, 255, 0.08)",
        },
        indigoCard: {
          from: "#4144D4",
          to: "#2E31AE",
          frosted: "rgba(255, 255, 255, 0.12)",
          frostedBorder: "rgba(255, 255, 255, 0.18)",
        },
        up: "#10B981",
        down: "#F43F5E",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "General Sans", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        "3xl": "28px",
        "2xl": "20px",
        xl: "14px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(19, 22, 34, 0.04), 0 2px 6px -1px rgba(19, 22, 34, 0.02)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05)",
        console: "0 20px 40px -10px rgba(19, 22, 34, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
