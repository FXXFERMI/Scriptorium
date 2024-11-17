import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark-blue': '#0A0A1E',
        'custom-gray': '#D2D4D6',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'rainbow-text': 'linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red)',
      },
      backgroundClip: {
        text: 'text',
      },
    },
  },
  plugins: [],
};
export default config;
