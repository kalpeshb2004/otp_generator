/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#00ff88', dark: '#00cc6a', light: '#66ffb2' },
        surface: { DEFAULT: '#0d0d0d', 1: '#141414', 2: '#1a1a1a', 3: '#222222' },
        border: { DEFAULT: '#2a2a2a', bright: '#3a3a3a' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        pulse2: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        slide: 'slideIn 0.3s ease-out',
        fade: 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateY(-8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
};
