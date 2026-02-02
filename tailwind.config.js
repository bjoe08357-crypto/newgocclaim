/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'goc-primary': '#7C5CFF',
        'goc-secondary': '#22D3EE',
        'goc-ink': '#E2E8F0',
        'goc-muted': '#94A3B8',
        'goc-border': '#1E293B',
        'goc-surface': '#0F172A',
        'goc-surface-alt': '#111827',
        'goc-success': '#22C55E',
        'goc-warning': '#F59E0B',
        'goc-danger': '#F43F5E',
        'primary': '#7C5CFF',
        'secondary': '#22D3EE',
        'background': '#0B1020',
        'foreground': '#E2E8F0',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'goc-hero': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124, 92, 255, 0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 120%, rgba(34, 211, 238, 0.2) 0%, transparent 55%)',
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'goc-sm': '0 1px 2px rgba(15, 23, 42, 0.4)',
        'goc': '0 8px 24px rgba(8, 11, 28, 0.55)',
        'goc-lg': '0 28px 64px rgba(8, 11, 28, 0.7)',
      }
    },
  },
  plugins: [],
}
