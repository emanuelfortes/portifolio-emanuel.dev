import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Portfolio | Full Stack Developer",
  description:
    "Desenvolvedor Full Stack especializado em construir sistemas completos — do backend à interface. Visão de produto, código limpo e foco em resultado.",
  keywords: [
    "desenvolvedor full stack",
    "frontend",
    "backend",
    "next.js",
    "react",
    "node.js",
    "portfolio",
  ],
  openGraph: {
    title: "Dev Portfolio | Full Stack Developer",
    description:
      "Construo sistemas completos com visão de produto e foco em resultado.",
    type: "website",
  },
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
