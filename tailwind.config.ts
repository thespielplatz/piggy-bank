import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        numbers: ['Tektur', 'sans-serif'],
      },
      colors: {
        'background': '#fbcf48',
        'text': '#1e4563',
        'astronaut-blue': {
          50: '#f3f7fc',
          100: '#e5f0f9',
          200: '#c5dff2',
          300: '#92c5e7',
          400: '#58a8d8',
          500: '#338dc4',
          600: '#2370a6',
          700: '#1d5a87',
          800: '#1c4d70',
          900: '#1e4563',
          950: '#132a3e',
        },
        'dodger-blue': {
          50: '#f0f8fe',
          100: '#ddedfc',
          200: '#c3e1fa',
          300: '#9acff6',
          400: '#6bb5ef',
          500: '#4f9bea',
          600: '#337bdd',
          700: '#2a66cb',
          800: '#2853a5',
          900: '#254883',
          950: '#1b2d50',
        },
      },
    },
  },
}
