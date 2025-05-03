module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunset: {
          900: "#1e293b", // deep twilight background (for body) 
          100: "#325372", // steel‑blue #325372
          200: "#615270", // plum #615270
          300: "#ac637b", // dusty‑rose #ac637b
          400: "#c36474"  // coral‑pink accent #c36474
        }
      },
    },
  },
  plugins: [],
}
