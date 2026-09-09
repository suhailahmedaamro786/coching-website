import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      // Subtle slate/indigo glow for the dark aesthetic.
      boxShadow: {
        glow: '0 0 40px -12px rgba(99, 102, 241, 0.55)',
        'glow-sm': '0 0 24px -8px rgba(99, 102, 241, 0.5)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(ellipse at top, rgba(99,102,241,0.18), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
