/** Palet BatikLens: nila (pewarna indigo), soga (cokelat), malam (lilin) */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nila: { DEFAULT: "#14213D", deep: "#0D1630", mid: "#24396B" },
        soga: "#8A5A2B",
        malam: "#E0B04A",
        kain: "#F7F4EC",
        mute: "#55607A",
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};