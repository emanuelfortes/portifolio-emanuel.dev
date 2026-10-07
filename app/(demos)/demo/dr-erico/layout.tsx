import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@/demos/dr-erico/styles.css";
import SiteLayout from "@/demos/dr-erico/SiteLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://drericodiogenes.com.br"),
  title: {
    default: "Dr. Érico Diógenes | Urologista em Fortaleza",
    template: "%s | Dr. Érico Diógenes",
  },
  description:
    "Dr. Érico Diógenes, Urologista em Fortaleza especialista em Cirurgia Robótica, HoLEP e Uro-oncologia. Atendimento humanizado com tecnologia de ponta no Ceará.",
  icons: { icon: "/demos/dr-erico/favicon.svg" },
};

export default function DrEricoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteLayout>{children}</SiteLayout>;
}
