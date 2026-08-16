import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/data/site";
import "./globals.css";

/**
 * Fontes auto-hospedadas em app/fonts (subset latin, baixadas do Google Fonts).
 *
 * Usamos next/font/local em vez de next/font/google de propósito: o loader do
 * Google baixa os arquivos durante o build, e quando essa requisição falha a
 * variável CSS não é gerada. Como `font-family: var(--x)` com a variável
 * indefinida invalida a declaração inteira, o texto mono caía para a fonte
 * herdada (sans) em vez de uma monoespaçada. Com os arquivos no repositório o
 * build fica hermético e isso não pode mais acontecer.
 */
/* Ambas são fontes variáveis: um arquivo cobre toda a faixa de peso, então o
   descritor precisa declarar a faixa (não um peso fixo) para o navegador
   interpolar o eixo wght nos pesos 400/500/600/700 usados no design. */
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-var.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-var.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fortes Dev | Emanuel Fortes, Full Stack Developer",
  description:
    "Código · Solução · Impacto. Desenvolvedor Full Stack especializado em construir sistemas completos, do backend à interface. Visão de produto, código limpo e foco em resultado.",
  keywords: [
    "fortes dev",
    "emanuel fortes",
    "desenvolvedor full stack",
    "frontend",
    "backend",
    "next.js",
    "react",
    "node.js",
    "portfolio",
  ],
  openGraph: {
    title: "Fortes Dev | Emanuel Fortes, Full Stack Developer",
    description:
      "Código · Solução · Impacto. Construo sistemas completos com visão de produto e foco em resultado.",
    type: "website",
    locale: "pt_BR",
    siteName: "Fortes Dev",
    url: siteUrl,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 712,
        type: "image/jpeg",
        alt: "Fortes Dev. Desenvolvo sistemas, da interface ao backend.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortes Dev | Emanuel Fortes, Full Stack Developer",
    description:
      "Código · Solução · Impacto. Construo sistemas completos com visão de produto e foco em resultado.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#08060d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="bg-ink font-sans text-txt antialiased">{children}</body>
    </html>
  );
}
