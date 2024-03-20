import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        m_title: "",
      },
      colors: {
        m_primary_900: "#003953",
        m_primary_800: "#003F5C",
        m_primary_700: "#004E66",
        m_primary_600: "#006880",
        m_primary_500: "#0B8199",
        m_primary_400: "#3C9AAD",
        m_primary_300: "#6DB3C2",
        m_primary_200: "#9DCDD6",
        m_primary_100: "#E2F0F3",
        m_neutral_100: "#F4F5F5",
        m_neutral_200: "#DFDFE2",
        m_neutral_300: "#B6BAC4",
        m_neutral_400: "#9EA3B0",
        m_neutral_500: "#868C9C",
        m_neutral_600: "#565E74",
        m_neutral_700: "#3D4761",
        m_neutral_800: "#25304D",
        m_neutral_900: "#0D1939",
        m_error_900: "#4E1111",
        m_error_800: "#751A1A",
        m_error_700: "#9C2323",
        m_error_600: "#C32B2B",
        m_error_500: "#EA3434",
        m_error_400: "#ED5656",
        m_error_300: "#F17878",
        m_error_200: "#F49999",
        m_error_100: "#FCE3E3",
        m_warning_900: "#6B5103",
        m_warning_800: "#8C6A04",
        m_warning_700: "#B58905",
        m_warning_600: "#E8B006",
        m_warning_500: "#FFC107",
        m_warning_400: "#FFCD39",
        m_warning_300: "#FFD559",
        m_warning_200: "#FFE28D",
        m_warning_100: "#FFECB2",
        m_warning_50: "#FFF9E6",
        m_success_900: "#0E532C",
        m_success_800: "#126D39",
        m_success_700: "#178D4A",
        m_success_600: "#1EB45F",
        m_success_500: "#21C668",
        m_success_400: "#4DD186",
        m_success_300: "#6AD99A",
        m_success_200: "#99E5BA",
        m_success_100: "#BAEDD0",
        m_success_50: "#E9F9F0",
        m_question: "#F4FAFB",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
        enter_overlay: "enter 10ms ease-out",
        leave_overlay: "leave 10ms ease-in forwards",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
  important: true,
};
export default config;
