import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        background01: "var(--background01)",
        background02: "var(--background02)",
        foreground: "var(--foreground)"
      },

      backgroundImage: {
        "custom-textarea": "repeating-linear-gradient(#fdf7f4, #fdf7f4 31px, #BFBFBF 31px, #BFBFBF 32px, #fdf7f4 32px)"
      }
    },
    fontFamily: {
      Dovemayo: ["Dovemayo"],
      Dovemayo_gothic: ["Dovemayo_gothic"]
    }
  },
  plugins: []
};
export default config;
