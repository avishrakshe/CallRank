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
        bg: "#0A0E14",
        surface: "#12161F",
        "surface-raised": "#181D28",
        accent: {
          DEFAULT: "#F2B84B",
          hover: "#DE9F35",
          glow: "rgba(242, 184, 75, 0.2)",
        },
        up: {
          DEFAULT: "#2DD4BF",
          hover: "#14B8A6",
          glow: "rgba(45, 212, 191, 0.2)",
        },
        down: {
          DEFAULT: "#FF6B6B",
          hover: "#FA5252",
          glow: "rgba(255, 107, 107, 0.2)",
        },
        text: {
          DEFAULT: "#EDEFF3",
          muted: "#7C8496",
        },
        border: "rgba(124, 132, 150, 0.18)",
        "border-active": "rgba(242, 184, 75, 0.35)",
      },
      fontFamily: {
        sans: ["General Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "2px",
        none: "0",
        sm: "2px",
        md: "3px",
        lg: "4px",
        panel: "4px",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
