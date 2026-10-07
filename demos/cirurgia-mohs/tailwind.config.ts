import type { Config } from "tailwindcss";

/**
 * Tailwind do portal Cirurgia de Mohs.
 *
 * O original usa Tailwind 4, com os tokens no bloco @theme do globals.css. O
 * portfólio roda Tailwind 3, então os mesmos tokens vêm para cá (carregado por
 * styles.css via `@config`, só para esta réplica). Os ajustes de v3 para v4:
 * borda padrão em currentColor e `shadow-sm` com a sombra que ele tem no v4.
 */
const config: Config = {
  content: ["./demos/cirurgia-mohs/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#252d42",
          950: "#161c2b",
          900: "#1d2436",
          800: "#252d42",
          700: "#2f3a55",
          600: "#3d4a6b",
          500: "#55628a",
          400: "#7d88aa",
          300: "#a9b1c8",
          200: "#d0d5e2",
          100: "#e7eaf1",
          50: "#f2f4f8",
        },
        paper: { DEFAULT: "#fbfbfb", 2: "#f4f4f5" },
        ink: { DEFAULT: "#1d2436", muted: "#5b6478" },
        line: "#e3e5ea",
        accent: { 600: "#b58a3c", 500: "#c9a45c", 100: "#f6efe0" },
        whatsapp: { DEFAULT: "#25d366", dark: "#128c7e" },
        /* Aliases do redesign editorial (docs/HANDOFF.md) */
        muted: "#55628a",
        gold: "#b58a3c",
        teal: "#128c7e",
      },
      fontFamily: {
        display: ["var(--font-bodoni)", '"Bodoni Moda"', '"Didot"', "Georgia", "serif"],
        sans: ["var(--font-montserrat)", '"Montserrat"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderColor: { DEFAULT: "currentColor" },
      boxShadow: {
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
