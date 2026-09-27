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
          950: '#090d16',
          900: '#0f172a',
          850: '#131d33',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          accent: '#06b6d4',
          accentGlow: '#0891b2',
          gold: '#eab308',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          indigo: '#6366f1',
          shield: '#0ea5e9'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
