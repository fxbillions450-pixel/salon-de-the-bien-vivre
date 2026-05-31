import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        cream: '#FFF6EA',
        oat: '#F3E5D0',
        'tea-beige': '#EAD2B7',
        sand: '#DDBF9A',
        // Accents
        terracotta: '#C96F4A',
        'burnt-orange': '#D9824B',
        honey: '#D6A84F',
        matcha: '#8AA66A',
        sage: '#556B45',
        forest: '#263D2B',
        blush: '#E8B9A8',
        cocoa: '#5A3E2B',
        // Text
        espresso: '#2A1F19',
        charcoal: '#322820',
        brown: '#6B4A35',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
