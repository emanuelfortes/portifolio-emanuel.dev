import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fortes Dev | Emanuel Fortes — Full Stack Developer",
  description:
    "Código · Solução · Impacto. Desenvolvedor Full Stack especializado em construir sistemas completos — do backend à interface. Visão de produto, código limpo e foco em resultado.",
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
    title: "Fortes Dev | Emanuel Fortes — Full Stack Developer",
    description:
      "Código · Solução · Impacto. Construo sistemas completos com visão de produto e foco em resultado.",
    type: "website",
    images: [{ url: "/logo-on-dark.png", width: 954, height: 806 }],
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
