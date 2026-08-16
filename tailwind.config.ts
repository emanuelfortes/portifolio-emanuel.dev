import type { Config } from "tailwindcss";

/**
 * Tokens do redesign "Aurora" (design_handoff_fortesdev_redesign).
 * Estética escura com granulado, aurora roxa e superfícies translúcidas.
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
        /* Fundos */
        ink: "#08060d", // fundo da página
        "ink-deep": "#0a0812", // texto escuro sobre gradiente
        "ink-cta": "#0b0814", // card de contato
        surface: "rgba(18,14,30,0.6)", // cards bento / projetos
        "surface-skills": "rgba(14,11,24,0.65)",
        "surface-code": "rgba(10,8,18,0.75)",
        "surface-nav": "rgba(14,10,24,0.72)",
        "surface-ghost": "rgba(8,6,13,0.4)", // botões ghost

        /* Roxos */
        violet: {
          DEFAULT: "#8b5cf6",
          hover: "#9d74f8",
          deep: "#5b3df0",
        },
        lilac: {
          DEFAULT: "#a78bfa",
          light: "#c4b5fd",
          lighter: "#e9d5ff",
        },

        /* Texto */
        txt: {
          DEFAULT: "#ece9f7",
          secondary: "#b3abd0",
          muted: "#8b84a8",
          label: "#7d7599",
          skill: "#e4e0f2",
          comment: "#5f5880",
        },
      },
      fontFamily: {
        /**
         * O fallback vai DENTRO do var() de propósito. `var(--x)` sem fallback,
         * com a variável indefinida, invalida a declaração inteira e o elemento
         * herda a fonte do pai: o texto mono viraria sans em vez de cair numa
         * monoespaçada. Com `var(--x, ui-monospace)` a degradação é correta.
         */
        sans: [
          "var(--font-space-grotesk, ui-sans-serif)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono, ui-monospace)",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        card: "18px",
        "card-lg": "22px",
        "card-xl": "24px",
        window: "16px",
        btn: "12px",
      },
      boxShadow: {
        "violet-btn": "0 4px 30px rgba(139,92,246,0.45)",
        nav: "0 16px 50px rgba(0,0,0,0.5)",
        window: "0 40px 100px rgba(0,0,0,0.6)",
        skill: "0 0 12px rgba(139,92,246,0.8)",
      },
      backgroundImage: {
        "grad-pill": "linear-gradient(135deg,#a78bfa,#8b5cf6)",
        "grad-skill": "linear-gradient(90deg,#5b3df0,#a78bfa,#e9d5ff)",
        "grad-bento":
          "linear-gradient(140deg, rgba(124,92,255,0.14), rgba(18,14,30,0.6))",
        /** Véu do card de contato, exatamente como no handoff. */
        "grad-veil":
          "linear-gradient(180deg, rgba(11,8,20,0.85), rgba(11,8,20,0.15) 55%, rgba(11,8,20,0.35))",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.4,0,.2,1)",
      },
      animation: {
        "aurora-slow": "auroraShift 16s ease-in-out infinite",
        "aurora-slower": "auroraShift 20s ease-in-out infinite reverse",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "rise-in": "riseIn .7s ease both",
        "rise-in-window": "riseIn .8s ease both",
        caret: "caretBlink 1.1s step-end infinite",
      },
      keyframes: {
        auroraShift: {
          "0%, 100%": { transform: "translateX(-6%) rotate(-8deg) scaleY(1)" },
          "50%": { transform: "translateX(6%) rotate(-6deg) scaleY(1.15)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".3" },
        },
        riseIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        caretBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
