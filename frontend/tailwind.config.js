/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#19e64d",
        "primary-hover": "#14b83d",
        "background-light": "#f6f8f6",
        "background-dark": "#0f1310",
        "surface-dark": "#1a241c",
        "surface-darker": "#111813",
        "text-secondary": "#9db8a4",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

