import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#111111',
        secondary: '#666666',
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
