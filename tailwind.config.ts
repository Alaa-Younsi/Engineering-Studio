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
      // Design tokens measured from the 1920px Figma (1rem = 16px @ 1920).
      spacing: {
        gutter: '13.5rem',   // 216px — global page side margin
        disc: '39.5rem',     // 632px — service section circle diameter
      },
      maxWidth: {
        content: '93rem',    // 1488px — inner content width (1920 - 2×216)
      },
    },
  },
  plugins: [],
}

export default config
