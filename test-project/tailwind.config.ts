import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        sky: {
          100: "#e0f2fe",
          200: "#bae6fd",
        },
        bluegray: {
          100: "#cfd8dc",
          200: "#b0bec5",
          500: "#607d8b",
          600: "#78909c",
        },
        indigo: {
          500: "#3f51b5",
          700: "#303f9f",
          900: "#1E1B4B",
        },
        teal: {
          950: "#042F2E",
        },
        slate: {
          900: "#0F172A",
          950: "#020617",
        },
      },
    },
  },
  plugins: [],
};
export default config;
