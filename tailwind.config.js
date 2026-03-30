/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        scout: {
          forest: '#1B4332',
          pine: '#2D6A4F',
          sage: '#52B788',
          meadow: '#95D5B2',
          mist: '#D8F3DC',
          navy: '#1B263B',
          slate: '#415A77',
          sky: '#778DA9',
          gold: '#C9972F',
          amber: '#E5A100',
          khaki: '#C2B280',
          earth: '#8B7355',
          bark: '#5C4033',
          campfire: '#D4652A',
          ember: '#B33A1F',
          cream: '#FDF6E3',
          parchment: '#F5F0E1',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"Source Code Pro"', 'monospace'],
      },
      backgroundImage: {
        'topo-pattern': "url('/topo-pattern.svg')",
        'hero-mountains': 'linear-gradient(to bottom, rgba(27,67,50,0.85), rgba(27,38,59,0.9))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'compass-spin': 'compassSpin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        compassSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
