import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 20px 80px -30px rgba(16, 24, 40, 0.35)",
      },
      backgroundImage: {
        holo: "linear-gradient(125deg, rgba(119, 86, 255, 0.82), rgba(52, 204, 255, 0.8) 48%, rgba(94, 255, 210, 0.88))",
      },
    },
  },
  plugins: [],
};

export default config;
