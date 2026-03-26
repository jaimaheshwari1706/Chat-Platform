/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#6C63FF',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    }
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#6C63FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'msg-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
        'pulse-opacity': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'msg-in': 'msg-in 150ms ease-out',
        'badge-pop': 'badge-pop 200ms ease-out',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'pulse-opacity': 'pulse-opacity 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
