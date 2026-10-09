/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmWhite: '#FAFAF8',
        nearBlack: '#171717',
        neutralGray: '#666666',
        accentBlue: '#315EFB',
        accentBlueHover: '#2349D6',
        subtleBorder: '#E5E5E5',
        subtleBorderHover: '#CCCCCC',
        cardBg: '#FFFFFF',
        mutedBg: '#F4F4F0',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        wide: '0.025em',
        wider: '0.05em',
      }
    },
  },
  plugins: [],
}
