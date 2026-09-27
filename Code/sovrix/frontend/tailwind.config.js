/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sovrix: {
          bg: '#EFEDF5',
          lavender: '#E1D9F0',
          palepurple: '#E9D1F1',
          softlilac: '#ECE1F3',
          pure: '#FFFFFF',
          card: '#FCFBFF',
          navy: '#121334',
          text: '#1A1B3B',
          subtext: '#4B506C',
          muted: '#8F92C0',
          accent: '#5B4EB1',
          accentGlow: '#7C6FCD',
          gold: '#d97706',
          success: '#059669',
          warning: '#d97706',
          danger: '#dc2626',
          border: '#E1D9F0'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(18, 19, 52, 0.05), 0 0 0 1px rgba(225, 217, 240, 0.6)',
        'card': '0 2px 12px -2px rgba(18, 19, 52, 0.04), 0 0 0 1px rgba(225, 217, 240, 0.8)',
        'glow-purple': '0 0 25px -5px rgba(233, 209, 241, 0.6)',
      }
    },
  },
  plugins: [],
}
