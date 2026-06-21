/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/index.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leafGreen1: '#f0f7ee',
        leafGreen9: '#2d6a4f',
        leafGreen11: '#1b4332',
        soilBrown6: '#a0522d',
        morningSky1: '#e8f4fd',
        alertRed9: '#c0392b',
        guestGray5: '#9e9e9e',
      },
    },
  },
  plugins: [],
}
