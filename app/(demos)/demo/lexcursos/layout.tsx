import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/archivo";
import "@fontsource-variable/source-serif-4";
import "@/demos/lexcursos/styles.css";
import { ToastProvider } from "@/demos/lexcursos/components/ui/toast";
import { asset } from "@/demos/lexcursos/lib/paths";

export const metadata: Metadata = {
  title: { default: "LEX Concursos — Sua aprovação começa aqui", template: "%s | LEX Concursos" },
  description: "A plataforma de preparação para concursos públicos com cursos para GMF, PPCE, TJCE, GCM e muito mais.",
  icons: { icon: asset("favicon.png") },
};

export default function LexCursosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ToastProvider>{children}</ToastProvider>;
}
