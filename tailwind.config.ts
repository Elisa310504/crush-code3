import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        burgundy: "#6D1233",
        blush: "#FFD6E5",
        cherry: "#E63963",
        cream: "#FFF9F3",
        cocoa: "#351A24",
        sage: "#2F6B4F",
      },
      fontFamily: {
        serif: ['"Times New Roman"', "Times", '"Liberation Serif"', '"Nimbus Roman"', "serif"],
        script: ['"Great Vibes"', '"Brush Script MT"', "cursive"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--r, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--r, 0deg))" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.18)" },
          "45%": { transform: "scale(0.96)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.8)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        wiggle: "wiggle 2.4s ease-in-out infinite",
        beat: "beat 1.1s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "fade-up": "fadeUp .6s cubic-bezier(.2,.7,.2,1) both",
        twinkle: "twinkle 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
