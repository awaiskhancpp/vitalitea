import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [],
}

export default config
