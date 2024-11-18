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
        primary: "#D84E35",
        background01: "#EFE6DE",
        background02: "#FDF7F4",
        background03: "#C3BFBA",
        utility01: "#E89080",
        utility02: "#FCA697",
        utility03: "#2E5342",
        gray01: "#F2F2F2",
        gray02: "#D9D9D9",
        gray03: "#BFBFBF",
        gray04: "#A6A6A6",
        gray05: "#0D0D0D",
        foreground: "var(--foreground)"
      },

      backgroundImage: {
        "custom-textarea": "repeating-linear-gradient(#fdf7f4, #fdf7f4 31px, #BFBFBF 31px, #BFBFBF 32px, #fdf7f4 32px)",
        "custom-textarea-lg":
          "repeating-linear-gradient(#fdf7f4, #fdf7f4 51px, #BFBFBF 51px, #BFBFBF 52px, #fdf7f4 52px)",
        "detail-content": "repeating-linear-gradient(#fdf7f4, #fdf7f4 47px, #BFBFBF 47px, #BFBFBF 48px, #fdf7f4 48px)",
        "checkbox-off": "url('/icons/checkbox-off.svg')",
        "checkbox-on": "url('/icons/checkbox-on.svg')"
      },

      keyframes: {
        alert: {
          "0%": { opacity: "0" },
          "5%": { opacity: "1" },
          "95%": { opacity: "1" },
          "100%": { opacity: "0" }
        }
      },

      animation: {
        "alert-blink": "alert 3s linear forwards"
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
