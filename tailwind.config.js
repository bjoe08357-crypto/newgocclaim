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
        
        // Metallic accent system
        'goc-gold': {
          900: '#92400e',
          800: '#a16207',
          700: '#b45309',
          600: '#ca8a04',
          500: '#eab308',
          400: '#facc15',
          300: '#fde047',
          200: '#fef08a',
          100: '#fefce8',
        },
        
        // Accent colors
        'goc-accent': {
          primary: '#fbbf24',
          secondary: '#f59e0b',
          tertiary: '#d97706',
        },
        
        // Text colors
        'goc-text': {
          primary: '#ffffff',
          secondary: '#e5e5e5',
          muted: '#a3a3a3',
          subtle: '#737373',
        },
        
        // Base tokens
        'primary': '#D4AF37',
        'secondary': '#2a2a2a',
        'background': '#0a0a0a',
        'foreground': '#ffffff',
        
        // Button variants with metallic accent
        'indigo': {
          50: '#F4D03F',
          100: '#F4D03F',
          200: '#F4D03F',
          300: '#D4AF37',
          400: '#D4AF37',
          500: '#D4AF37',
          600: '#B7950B',
          700: '#B7950B',
          800: '#85754E',
          900: '#85754E',
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
        
        'goc-gold-primary': 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
        'goc-gold-secondary': 'linear-gradient(45deg, #fbbf24 0%, #f59e0b 100%)',
        'goc-gold-subtle': 'linear-gradient(180deg, #fde047 0%, #facc15 100%)',
        
        'goc-dark-primary': 'linear-gradient(135deg, #000000 0%, #121212 50%, #1a1a1a 100%)',
        'goc-dark-secondary': 'linear-gradient(45deg, #030303 0%, #0a0a0a 100%)',
        
        'goc-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(250, 204, 21, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 50% 120%, rgba(234, 179, 8, 0.1) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #121212 100%)',
        
        'goc-button-primary': 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
        'goc-button-hover': 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
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
        'goc-sm': '0 2px 4px 0 rgba(250, 204, 21, 0.1)',
        'goc': '0 4px 14px 0 rgba(250, 204, 21, 0.2)',
        'goc-lg': '0 10px 25px 0 rgba(250, 204, 21, 0.3)',
        'goc-xl': '0 25px 50px -12px rgba(250, 204, 21, 0.4)',
        'goc-glow': '0 0 30px 0 rgba(250, 204, 21, 0.5)',
        'goc-glow-lg': '0 0 60px 0 rgba(250, 204, 21, 0.6)',
      }
    },
  },
  plugins: [],
}
