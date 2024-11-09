/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{tsx,ts}"],
  theme: {
    extend: {
      boxShadow: {
        eveninner: "inset 0px 0px 15px 11px rgba(0,0,0,0.87)"
      }
    },
  },
  plugins: [],
}

