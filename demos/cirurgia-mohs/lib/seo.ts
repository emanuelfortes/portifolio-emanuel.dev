import type { Metadata } from "next";
import type { ContentPage } from "./content";

/**
 * Metadata do Next a partir do frontmatter de cada arquivo .md: title,
 * description e palavras-chave.
 *
 * Réplica: sem canônica, Open Graph e Twitter do original (apontariam para o
 * domínio do site e para as prévias 1200×630, que não vêm para a cópia).
 */
export function metadataFor(page: ContentPage): Metadata {
  const keywords = [page.fm.palavra_chave_principal, ...(page.fm.palavras_chave_secundarias?.split(",") ?? [])]
    .map((k) => k?.trim())
    .filter((k): k is string => Boolean(k));

  return {
    title: { absolute: page.fm.title },
    description: page.fm.description,
    keywords,
  };
}
