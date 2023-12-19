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
        'light-purple': 'rgba(154, 155, 211, 0.40)',
        'white-blue': '#FEFFFF',
      },
      colors: {
        'light-purple': 'rgba(154, 155, 211, 0.40)',
        'dark-blue': '#1C2041',
        'white-blue': '#FEFFFF',
        'light-red': '#FC2B5D',
      },
      minHeight: {
        '3b': '10rem',
      },
      maxWidth: {
        "button-max": '12rem',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
