/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          DEFAULT: '#6366F1', // violet-500
          light: '#818CF8', // violet-400
          dark: '#4F46E5', // violet-600
        },
        accent: {
          DEFAULT: '#6366F1', // tech blue/violet
          soft: '#818CF8',
        },
        highlight: {
          DEFAULT: '#FBBF24', // amber-400 for AI highlights
        },
        muted: {
          DEFAULT: '#F8F9FA', // light gray
          dark: '#121212', // dark slate
        },
        background: {
          DEFAULT: '#fff',
          dark: '#18181b',
        },
        'muted-foreground': {
          DEFAULT: '#6B7280', // gray-500
          dark: '#A1A1AA', // zinc-400
        },
        'primary': {
          DEFAULT: '#18181b',
          dark: '#fff',
        },
      },
      maxWidth: {
        'screen-md': '768px',
        'screen-lg': '1024px',
      },
      spacing: {
        'section': '2.5rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: { color: theme('colors.brand.DEFAULT'), textDecoration: 'underline' },
            h1: { fontWeight: '700', fontSize: '2.25rem', lineHeight: '2.5rem' },
            h2: { fontWeight: '600', fontSize: '1.5rem', lineHeight: '2rem' },
            h3: { fontWeight: '600', fontSize: '1.25rem', lineHeight: '1.75rem' },
            p: { marginTop: '0.5em', marginBottom: '0.5em' },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),
            a: { color: theme('colors.brand.light') },
          },
        },
      }),
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} 