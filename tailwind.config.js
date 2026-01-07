/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,js,ts,jsx,tsx}'];
export const theme = {
  extend: {
    colors: {
      primary: '#76BDB9',
      'primary-dark': '#49807D',
      'primary-dark1': '#5CA09D',
      'primary-dark2': '#52908D',
      'primary-dark3': '#49807D',
      'primary-dark4': '#40706D',
      'primary-dark5': '#406F6D',
      'primary-light': '#DEECEB',
      'primary-button': '#1A3FF7',
      secondary: '#1A1A1A',
    },
    animation: {
      'fade-in': 'fadeIn 0.2s ease-out',
      'slide-up': 'slideUp 0.3s ease-out',
      'slide-in-left': 'slideInFromLeft 0.3s ease-out forwards',
      'slide-out-left': 'slideOutToLeft 0.3s ease-in forwards',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      slideInFromLeft: {
        '0%': { transform: 'translateX(-100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      slideOutToLeft: {
        '0%': { transform: 'translateX(0)', opacity: '1' },
        '100%': { transform: 'translateX(-100%)', opacity: '0' },
      },
    },
  },
};
export const plugins = [];
export const corePlugins = {
  preflight: false,
};
