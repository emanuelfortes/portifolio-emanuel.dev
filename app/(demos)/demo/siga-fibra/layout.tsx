import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "@/demos/siga-fibra/styles.css";

export const metadata: Metadata = {
  title: "Siga Fibra · Painel de Controle",
};

export default function SigaFibraLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
