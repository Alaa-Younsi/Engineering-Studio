import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#1a1a1a',
        secondary: '#707070',
        'logo-mid': '#555555',
        'logo-outer': '#333333',
      },
      fontFamily: {
        display: ['Bossa', 'sans-serif'],
        body: ['Bossa', 'sans-serif'],
        sans: ['Bossa', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
