import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#F20D18",
          deepRed: "#C90012",
          softRed: "#FFF0F1",
          white: "#FFFFFF",
          offWhite: "#F8F8FA",
          charcoal: "#171717",
          darkNavy: "#151B2B",
          grey: "#737373",
          borderGrey: "#EAEAEA",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        devanagari: ["'Rozha One'", "'Noto Serif Devanagari'", "'Noto Sans Devanagari'", "serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        "premium-hover": "0 20px 40px -15px rgba(242, 13, 24, 0.15)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "flight-float": "float 4s ease-in-out infinite",
        "pulse-subtle": "subtlePulse 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(1deg)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
