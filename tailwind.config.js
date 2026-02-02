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
        'goc-primary': '#2563eb',
        'goc-secondary': '#14b8a6',
        'goc-ink': '#0f172a',
        'goc-muted': '#64748b',
        'goc-border': '#e2e8f0',
        'goc-surface': '#ffffff',
        'goc-surface-alt': '#f8fafc',
        'goc-success': '#16a34a',
        'goc-warning': '#f59e0b',
        'goc-danger': '#ef4444',
        'primary': '#2563eb',
        'secondary': '#14b8a6',
        'background': '#f8fafc',
        'foreground': '#0f172a',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'goc-hero': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(37, 99, 235, 0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 120%, rgba(20, 184, 166, 0.12) 0%, transparent 55%)',
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
        'goc-sm': '0 1px 2px rgba(15, 23, 42, 0.06)',
        'goc': '0 8px 20px rgba(15, 23, 42, 0.08)',
        'goc-lg': '0 24px 48px rgba(15, 23, 42, 0.12)',
      }
    },
  },
  plugins: [],
}
