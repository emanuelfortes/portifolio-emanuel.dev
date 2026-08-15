import type { Config } from "tailwindcss";

/**
 * Paleta derivada da logo Fortes Dev.
 * O gradiente da marca vai de #28213F (indigo profundo) até #6124C9 (violeta vivo).
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0D0A17",
        surface: "#161122",
        "surface-2": "#211934",
        brand: {
          primary: "#6124C9", // violeta dominante da logo
          glow: "#955FF2", // hover / links
          light: "#B794FF", // texto de destaque sobre fundo escuro
          dim: "#442283", // meio do gradiente da logo
          deep: "#28213F", // ponta escura do gradiente da logo
        },
        text: {
          primary: "#E9E6F2",
          muted: "#A29BB8",
          dim: "#5F5878",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "brand-sm": "0 0 16px rgba(97,36,201,0.25)",
        "brand-md": "0 0 32px rgba(97,36,201,0.32)",
        "brand-lg": "0 0 48px rgba(97,36,201,0.4)",
      },
      backgroundImage: {
        "aurora":
          "radial-gradient(ellipse 70% 50% at 20% 90%, rgba(97,36,201,0.22) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(149,95,242,0.16) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 50% 50%, rgba(68,34,131,0.12) 0%, transparent 55%)",
        "aurora-subtle":
          "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(97,36,201,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 60%, rgba(149,95,242,0.08) 0%, transparent 50%)",
        "aurora-projects":
          "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(97,36,201,0.26) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 50%, rgba(149,95,242,0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(40,33,63,0.5) 0%, transparent 50%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
