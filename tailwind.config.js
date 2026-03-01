/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e1a',
          card: '#111827',
          hover: '#1f2937',
          border: '#374151',
          text: '#f3f4f6',
        },
        accent: {
          primary: '#3b82f6',
          hover: '#2563eb',
          light: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
}
