import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/data/site";
import "./globals.css";

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
        height: 675,
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
  themeColor: "#0D0A17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}
