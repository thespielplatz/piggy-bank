import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        numbers: ['Tourney', 'sans-serif'],
      },      
      colors: {
        background: '#fbcf48',
        text: '#1e4563',
        'dodger-blue': {
          '50': '#f0f8fe',
          '100': '#ddedfc',
          '200': '#c3e1fa',
          '300': '#9acff6',
          '400': '#6bb5ef',
          '500': '#4f9bea',
          '600': '#337bdd',
          '700': '#2a66cb',
          '800': '#2853a5',
          '900': '#254883',
          '950': '#1b2d50',
        },
      },
    }
  }
}
