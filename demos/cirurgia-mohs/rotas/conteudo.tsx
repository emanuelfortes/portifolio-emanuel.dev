import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPage } from "@/demos/cirurgia-mohs/lib/content";
import { metadataFor } from "@/demos/cirurgia-mohs/lib/seo";
import { renderTemplate } from "@/demos/cirurgia-mohs/components/templates";

/**
 * Rota estática para todas as páginas de conteúdo (pilares, regionais,
 * artigos do blog, área médica e institucionais). Cada arquivo .md em
 * /content vira uma URL própria, gerada em build (SSG).
 *
 * Réplica: sem o JSON-LD da página, e sem dynamicParams = false, para um
 * endereço inexistente cair no 404 do próprio site (not-found.tsx), dentro
 * do cabeçalho e do rodapé dele.
 */


export function generateStaticParams() {
  return getAllSlugs()
    .filter((s) => s !== "/")
    .map((s) => ({ slug: s.split("/").filter(Boolean) }));
}

type Props = { params: { slug: string[] } };

export function generateMetadata({ params }: Props): Metadata {
  const { slug } = params;
  const page = getPage(`/${slug.join("/")}`);
  if (!page) return {};
  return metadataFor(page);
}

export default function ContentRoute({ params }: Props) {
  const { slug } = params;
  const page = getPage(`/${slug.join("/")}`);
  if (!page) notFound();

  return <>{renderTemplate(page)}</>;
}
