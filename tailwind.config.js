/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["PoppinsRegular", "sans-serif"],
        poppinsMedium: ["PoppinsMedium", "sans-serif"],
        poppinsBold: ["PoppinsBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};