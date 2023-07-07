/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fixed-ping': {
          '0%, 100%': {
            transform: 'scale(1, 1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.1, 1.1)',
            opacity: '1',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shaky: {
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-1px) rotate(-3deg)' },
          '0%, 20%, 40%, 60%, 80%, 100%': { transform: 'translateX(1px) rotate(3deg)' },
        }
      },
      animation: {
        'fixed-ping': 'fixed-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        shaky: 'shaky 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
    ],
  },
}
