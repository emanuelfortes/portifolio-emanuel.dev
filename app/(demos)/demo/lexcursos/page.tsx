import type { Metadata } from "next";
import { LandingPage } from "@/demos/lexcursos/pages/landing";

export const metadata: Metadata = {
  title: { absolute: "LEX Concursos — Seu próximo concurso. Sua preparação começa aqui." },
  description: "Aulas, materiais de apoio e uma plataforma feita para você estudar com mais organização, praticidade e foco — de onde estiver.",
};

export default function Page() {
  return <LandingPage />;
}
