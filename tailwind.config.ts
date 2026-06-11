import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1A365D",
          light: "#2D5282",
          faint: "#EBF4FF",
        },
        red: {
          DEFAULT: "#E53E3E",
          light: "#FFF5F5",
        },
        teal: {
          DEFAULT: "#319795",
          light: "#E6FFFA",
        },
        snow: "#F7FAFC",
        ink: {
          700: "#2D3748",
          500: "#718096",
          200: "#E2E8F0",
          100: "#EDF2F7",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-montserrat)",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        "red-glow": "0 16px 32px -8px rgba(229,62,62,0.45)",
        "red-soft": "0 8px 20px -8px rgba(229,62,62,0.4)",
        card: "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.04)",
        "card-hover":
          "0 8px 24px -12px rgba(15,23,42,0.18), 0 2px 6px rgba(15,23,42,0.06)",
      },
      letterSpacing: {
        caption: "0.18em",
        wide12: "0.12em",
        wide22: "0.22em",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in": "fade-in 0.18s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
