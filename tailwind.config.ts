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
        bg: "#0B0F19",
        surface: "#111827",
        "surface-2": "#1A2235",
        blue: {
          primary: "#3B82F6",
          glow: "#60A5FA",
          dim: "#1D4ED8",
        },
        text: {
          primary: "#E5E7EB",
          muted: "#9CA3AF",
          dim: "#4B5563",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "blue-sm": "0 0 16px rgba(59,130,246,0.15)",
        "blue-md": "0 0 32px rgba(59,130,246,0.2)",
        "blue-lg": "0 0 48px rgba(59,130,246,0.25)",
      },
      backgroundImage: {
        "aurora": "radial-gradient(ellipse 70% 50% at 20% 90%, rgba(59,130,246,0.18) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(139,92,246,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 50% 50%, rgba(20,184,166,0.06) 0%, transparent 55%)",
        "aurora-subtle": "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 60%, rgba(139,92,246,0.07) 0%, transparent 50%)",
        "aurora-projects": "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(59,130,246,0.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 50%, rgba(139,92,246,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(20,184,166,0.08) 0%, transparent 50%)",
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
