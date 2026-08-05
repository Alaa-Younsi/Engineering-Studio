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
      /*
       * Type scale lifted straight from the 1920px Figma (1rem = 16px @ 1920),
       * so a section can be sized by name instead of by guessed arbitrary
       * values. Each entry is [font-size, line-height].
       */
      fontSize: {
        'd-hero':  ['5.625rem',  '1'],        //  90 — page hero
        'd-h2':    ['4.3125rem', '4.5625rem'],//  69/73 — section heading
        'd-h3':    ['2.5rem',    '1.15'],     //  40 — sub-section heading
        'd-num':   ['3.125rem',  '3.4375rem'],//  50/55 — stat & step numbers
        'd-step':  ['2.1875rem', '4.5625rem'],//  35/73 — studio row "01."
        'd-lead':  ['1.5rem',    '1.625rem'], //  24/26 — eyebrow, list items
        'd-card':  ['1.3125rem', '1.25rem'],  //  21/20 — card title
        'd-body':  ['1.25rem',   '1.625rem'], //  20/26 — body copy
        'd-sm':    ['1rem',      '1.1875rem'],//  16/19 — card meta, quotes
        'd-xs':    ['0.9375rem', '1.25rem'],  //  15/20 — stat label
        'd-xxs':   ['0.875rem',  '1.15'],     //  14 — card category
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
