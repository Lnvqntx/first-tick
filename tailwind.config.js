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
      loss: '#D9705A',
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
      h2: ['clamp(2rem, 2.4vw + 1.25rem, 3rem)', { lineHeight: '1.08' }],
      display: ['clamp(2.6rem, 5.5vw + 1rem, 5.25rem)', { lineHeight: '1.0' }],
    },
    extend: {
      maxWidth: { prose: '62ch', page: '76rem' },
    },
  },
  plugins: [],
}
