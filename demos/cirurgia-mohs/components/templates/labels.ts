import type { ContentPage } from "@/demos/cirurgia-mohs/lib/content";

/** Etiqueta da seção a que a página pertence (o "eyebrow" acima do H1). */
export function eyebrowFor(page: ContentPage): string | undefined {
  if (page.slug.startsWith("/cancer-de-pele")) return "Tipos de câncer de pele";
  if (page.slug.startsWith("/cirurgia-de-mohs-nordeste")) return "Atendimento no Nordeste";
  if (page.slug === "/cirurgia-de-mohs-fortaleza") return "Ceará";
  if (page.slug === "/pos-operatorio") return "Guia de recuperação";
  if (page.slug === "/para-medicos") return "Área médica";
  if (page.slug === "/cirurgia-de-mohs") return "Página principal";
  return undefined;
}
