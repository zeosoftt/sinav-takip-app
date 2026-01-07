/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5ff',
          300: '#a4b8ff',
          400: '#8190ff',
          500: '#6366f1', // Indigo-500 - teknik mavi
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        code: {
          bg: '#0d1117', // GitHub dark bg
          fg: '#c9d1d9',
          comment: '#8b949e',
          keyword: '#ff7b72',
          string: '#a5d6ff',
          number: '#79c0ff',
          function: '#d2a8ff',
        },
        dark: {
          bg: '#0a0e27',
          surface: '#131829',
          border: '#1e293b',
          text: '#e2e8f0',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['var(--font-space)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Consolas', 'Monaco', 'monospace'],
        display: ['var(--font-jetbrains)', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'code': '0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
