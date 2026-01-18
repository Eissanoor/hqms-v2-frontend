import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        smm: "440px",
        // => @media (min-width: 640px) { ... }

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 1024px) { ... }

        lg: "1024px",
        // => @media (min-width: 1280px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1280px) { ... }

        "3xl": "1760px",
        // => @media (min-width: 1280px) { ... }
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["ui-monospace", "SFMono-Regular"],
        display: ["Oswald", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
      },
      colors: {
        primary: "#E8F8F3", // Main Color
        mainbg: "#21704a",
        secondary: "#1D2F90",
        "main-color": "#13BA88",
        "border-color": "#8E9CAB",
        "digital-color": "#A9A9A9",
        serachbtn: "#350F9F",
        applybtn: "#F35C08",
        Allergies: "#BC0808",
        maincolor: "#13BA8885",
        // 'orange': '#F98E1A',
        // 'cpanel': '#F28C28',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
