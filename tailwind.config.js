import colors from "tailwindcss/dist/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: colors.neutral[900],
        foreground: colors.neutral[100],
      },
    },
  },
  plugins: [],
  darkMode: "media",
};
