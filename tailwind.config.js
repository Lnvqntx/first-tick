/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: '#0B0A08',
      surface: '#151311',
      raised: '#1C1916',
      line: '#2A2620',
      gold: { DEFAULT: '#E3B23C', deep: '#B8892B' },
      text: '#F3EEE3',
      muted: '#A39D8F',
      up: '#2FBF71',
      down: '#E5534B',
      loss: '#EE6A62',
    },
    fontFamily: {
      display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.4' }],
      sm: ['0.9375rem', { lineHeight: '1.5' }],
      base: ['1.0625rem', { lineHeight: '1.65' }],
      lead: ['1.25rem', { lineHeight: '1.55' }],
      h3: ['1.5rem', { lineHeight: '1.25' }],
      h2: ['clamp(2.25rem, 3vw + 1.25rem, 3.5rem)', { lineHeight: '1.04' }],
      display: ['clamp(2.5rem, 14vw, 11.5rem)', { lineHeight: '0.9' }],
    },
    extend: {
      maxWidth: { prose: '62ch', page: '76rem' },
      backgroundImage: {
        'gold-grad': 'linear-gradient(135deg, #F7D77E 0%, #E3B23C 45%, #B8892B 100%)',
        'gold-grad-hover': 'linear-gradient(135deg, #FBE29A 0%, #EBBE4C 45%, #C4952F 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(227 178 60 / 0.45), 0 10px 30px -8px rgb(227 178 60 / 0.55)',
        'glow-soft': '0 0 0 1px rgb(227 178 60 / 0.3), 0 6px 22px -10px rgb(227 178 60 / 0.45)',
      },
    },
  },
  plugins: [],
}
