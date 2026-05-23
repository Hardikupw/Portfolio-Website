/** @type {import('tailwindcss').Config} */
export default {
  // Scan all component/template files where Tailwind classes are used.
  // Includes ./src as requested, plus current project folders used in this repo.
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./*.{js,ts,jsx,tsx,html}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
    "./hooks/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Preserve your custom design tokens previously defined in CDN config.
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "apple-gray": "#1d1d1f",
        "apple-blue": "#0071e3",
        "apple-light-bg": "#f5f5f7",
        "apple-dark-bg": "#000000",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
