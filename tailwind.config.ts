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
        foreground: "var(--foreground)"
      },

      backgroundImage: {
        "custom-textarea": "repeating-linear-gradient(white, white 31px, #ccc 31px, #ccc 32px, white 32px)"
      }
    }
  },
  plugins: []
};
export default config;
