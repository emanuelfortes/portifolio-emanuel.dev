import type { Config } from "tailwindcss";

/**
 * Tailwind do painel Siga Fibra, igual ao do repositório original.
 *
 * É carregado por styles.css via `@config`, então só vale para esta réplica.
 * O `content` olha apenas esta pasta: as classes do portfólio não entram aqui
 * e as daqui não entram no CSS do portfólio.
 */
const config: Config = {
  content: ["./demos/siga-fibra/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        siga: {
          primary: "#27CAA3",
          secondary: "#03C2C3",
          light: "#3ddcbc",
          sky: "#0ea5e9",
          cyan: "#06b6d4",
          dark: "#0f2d22",
          mint: "#e4f8f3",
          "mint-alt": "#edfaf6",
        },
        primary: { DEFAULT: "#27CAA3", dark: "#1fa882", light: "#3ddcbc" },
        accent: { DEFAULT: "#03C2C3", dark: "#02a8a9" },
        success: "#27CAA3",
        dark: {
          DEFAULT: "#060d0f",
          card: "#050e18",
          border: "rgba(39,202,163,0.15)",
        },
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', "Montserrat", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "siga-gradient": "linear-gradient(135deg, #27CAA3, #03C2C3)",
        "siga-gradient-hiper": "linear-gradient(135deg, #03C2C3, #0ea5e9)",
      },
    },
  },
  plugins: [],
};

export default config;
