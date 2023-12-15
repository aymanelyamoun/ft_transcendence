import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-blue': '#1C2041',
        'white-blue': '#FEFFFF',
      },
      colors: {
        'dark-blue': '#1C2041',
        'white-blue': '#FEFFFF',
      },
      minHeight: {
        '3b': '10rem',
      },
      maxWidth: {
        "button-max": '12rem',
      }
    },
  },
  plugins: [],
}
export default config
