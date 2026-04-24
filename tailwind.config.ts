import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 0.45s ease-out',
      },
      colors: {
        'vt-green': '#2C5F2E',
        'vt-green-light': '#4a8c4d',
        'vt-cream': '#F5F0E8',
        'vt-brown': '#3D2B1F',
        'vt-text': '#1a1a1a',
        'vt-muted': '#6b7280',
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        grotesk: ['Host Grotesk', 'sans-serif'],
        martel: ['Martel Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
