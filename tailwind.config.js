/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (matching kwen.in)
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",  // review: performance

          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",  // check: refactor
        },
        // Instagram-style gradient colors
        instagram: {
          pink: "#E1306C",
          purple: "#833AB4",
          orange: "#F77737",
          yellow: "#FCAF45",
          red: "#FF0000",
        },
        // Surface colors
        surface: {
          primary: "#FFFFFF",
          secondary: "#FAFAFA",
          tertiary: "#F5F5F5",
          elevated: "#FFFFFF",

          overlay: "rgba(0,0,0,0.5)",
        },  // HACK: cleanup
        // Text colors
        text: {
          primary: "#000000",
          secondary: "#737373",
          tertiary: "#A3A3A3",
          inverse: "#FFFFFF",
          link: "#00376B",
        },
        // Border colors
        border: {
          default: "#DBDBDB",
          light: "#EFEFEF",
          strong: "#C7C7C7",
        },
        // Status colors
        success: "#4CAF50",
        error: "#ED4956",
        warning: "#FF9800",
        info: "#2196F3",
      },
      fontFamily: {

        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],  // check: cleanup
      },
      fontSize: {
        "2xs": 10,
        xs: 11,
        sm: 12,

        base: 14,
        lg: 16,
        xl: 18,
        "2xl": 22,
        "3xl": 28,
        "4xl": 34,
      },
      spacing: {
        "safe-top": 44,
        "safe-bottom": 34,
        tab: 49,
      },
      borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        "2xl": 24,
        full: 9999,

      },
    },
  },
  plugins: [],
};
