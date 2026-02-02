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
        // GOC dark palette
        'goc-black': '#000000',
        'goc-dark': {
          950: '#030303',
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#242424',
          500: '#2d2d2d',
          400: '#404040',
          300: '#525252',
          200: '#737373',
          100: '#a3a3a3',
        },

        // Logo gradient colors
        'goc-primary': '#7C5CFF',
        'goc-secondary': '#22D3EE',
        'goc-accent': {
          primary: '#7C5CFF',
          secondary: '#22D3EE',
          tertiary: '#5B8CFF',
        },

        // Text colors
        'goc-text': {
          primary: '#ffffff',
          secondary: '#e5e5e5',
          muted: '#a3a3a3',
          subtle: '#737373',
        },

        // Base tokens
        'primary': '#7C5CFF',
        'secondary': '#22D3EE',
        'background': '#0a0a0a',
        'foreground': '#ffffff',
        
        // Button variants with metallic accent
        'indigo': {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#7c5cff',
          600: '#6c4bff',
          700: '#5b39ff',
          800: '#4a2be5',
          900: '#3b1bcb',
        },
        
        // Status colors
        'green': {
          50: '#10B981',
          100: '#10B981',
          200: '#10B981',
          300: '#10B981',
          400: '#10B981',
          500: '#10B981',
          600: '#10B981',
          700: '#10B981',
          800: '#10B981',
          900: '#10B981',
        },
        
        'gray': {
          50: '#f8f9fa',
          100: '#9ca3af',
          200: '#6b7280',
          300: '#4a4a4a',
          400: '#3a3a3a',
          500: '#2a2a2a',
          600: '#1a1a1a',
          700: '#111111',
          800: '#0a0a0a',
          900: '#000000',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        
        'goc-dark-primary': 'linear-gradient(135deg, #000000 0%, #121212 50%, #1a1a1a 100%)',
        'goc-dark-secondary': 'linear-gradient(45deg, #030303 0%, #0a0a0a 100%)',

        'goc-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 92, 255, 0.2) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 50% 120%, rgba(34, 211, 238, 0.16) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #121212 100%)',

        'goc-button-primary': 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
        'goc-button-hover': 'linear-gradient(135deg, #8B7CFF 0%, #38E3F0 100%)',
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
        'goc-sm': '0 2px 4px 0 rgba(124, 92, 255, 0.12)',
        'goc': '0 4px 14px 0 rgba(124, 92, 255, 0.22)',
        'goc-lg': '0 10px 25px 0 rgba(124, 92, 255, 0.32)',
        'goc-xl': '0 25px 50px -12px rgba(124, 92, 255, 0.4)',
        'goc-glow': '0 0 30px 0 rgba(124, 92, 255, 0.5)',
        'goc-glow-lg': '0 0 60px 0 rgba(34, 211, 238, 0.5)',
      }
    },
  },
  plugins: [],
}
