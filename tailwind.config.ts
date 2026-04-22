import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          purple: "#8468EB",
          bg: "#111111",
          card: "#232323",
          surface: "#2F2F2F",
          border: "#343434",
          purple50: "#F0EDFF",
          purple200: "#C4B5FD",
          purple500: "#8468EB",
          purple700: "#5B42C3",
          purple900: "#311B92",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
