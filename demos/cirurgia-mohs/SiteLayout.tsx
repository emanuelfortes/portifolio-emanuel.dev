import localFont from "next/font/local";
import Masthead from "@/demos/cirurgia-mohs/components/layout/Masthead";
import Footer from "@/demos/cirurgia-mohs/components/layout/Footer";
import AosInit from "@/demos/cirurgia-mohs/components/AosInit";

/* Duas famílias, self-hosted (sem requisição ao Google Fonts, melhor para LCP e LGPD),
   font-display: swap (requisito 9.1 da estratégia).
   Bodoni Moda reproduz o serifado de alto contraste do logotipo "MOHS";
   Montserrat, a geométrica de "Especialidade em Câncer de Pele". */
const bodoni = localFont({
  src: [
    { path: "./fonts/bodoni-moda-latin-wght-normal.woff2", style: "normal" },
    { path: "./fonts/bodoni-moda-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  weight: "400 900",
  fallback: ["Didot", "Georgia", "serif"],
});

const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-latin-wght-normal.woff2", style: "normal" },
    { path: "./fonts/montserrat-latin-ext-wght-normal.woff2", style: "normal" },
    { path: "./fonts/montserrat-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

/**
 * Corpo do app/layout.tsx original, sem <html>/<body> (o layout raiz das
 * demos cuida disso). As variáveis das fontes, que o original põe no <html>,
 * ficam na div raiz, junto com as classes do <body> (min-h-screen flex flex-col);
 * styles.css define os tokens de cor e fonte nessa mesma div (.mohs-root).
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`mohs-root ${bodoni.variable} ${montserrat.variable} min-h-screen flex flex-col`}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-paper"
      >
        Pular para o conteúdo
      </a>
      <Masthead />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
      <AosInit />
    </div>
  );
}
