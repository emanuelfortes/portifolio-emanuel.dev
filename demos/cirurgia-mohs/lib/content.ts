import fs from "node:fs";
import path from "node:path";
import { applyPlaceholders, siteUrl } from "@/demos/cirurgia-mohs/config/site";

/**
 * Frontmatter simples "chave: valor" (uma linha por campo).
 * Os arquivos entregues usam dois-pontos e colchetes dentro dos valores,
 * o que um parser YAML estrito rejeitaria.
 */
function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const m = raw.match(/^\uFEFF?---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return { data: {} as Frontmatter, content: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([\w_]+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return { data: data as unknown as Frontmatter, content: raw.slice(m[0].length) };
}

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

export type SourceDir = "paginas" | "blog-pacientes" | "area-medica";

export type PageKind =
  | "institucional"
  | "pilar"
  | "página local"
  | "hub regional"
  | "regional"
  | "artigo"
  | "tecnico";

export interface Frontmatter {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tipo: PageKind;
  categoria?: string;
  publico: "paciente" | "medico" | "ambos";
  palavra_chave_principal?: string;
  palavras_chave_secundarias?: string;
  cta?: "paciente" | "medico";
  revisado_por?: string;
  data_publicacao?: string;
  data_revisao?: string;
}

export interface ImageSpec {
  id: string;
  description: string;
  alt: string;
  /** Nome de arquivo sugerido (WebP) */
  suggestedFile: string;
  page: string;
}

export interface CardItem {
  title: string;
  href: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ButtonItem {
  label: string;
  href: string;
  kind: "whatsapp" | "phone" | "email" | "link";
}

export type Block =
  | { type: "markdown"; md: string }
  | { type: "image"; image: ImageSpec }
  | { type: "indicacao"; image: ImageSpec }
  | { type: "cards"; items: CardItem[] }
  | { type: "buttons"; items: ButtonItem[] }
  | { type: "faq"; items: FaqItem[] };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
  isFaq: boolean;
  isReferences: boolean;
}

export interface CtaBlock {
  title: string;
  text: string;
  buttons: ButtonItem[];
  note?: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface ContentPage {
  slug: string;
  source: SourceDir;
  file: string;
  fm: Frontmatter;
  /** Parágrafo de resposta direta (primeiro parágrafo) */
  lead: string;
  reviewedBy?: string;
  intro: Block[];
  sections: Section[];
  cta?: CtaBlock;
  related: RelatedLink[];
  schema: Record<string, unknown> | null;
  images: ImageSpec[];
  /** Espaços de indicação de médico ou serviço ([INDICACAO], docs/01-reposicionamento-portal.md) */
  indicacoes: ImageSpec[];
  wordCount: number;
  readingTime: number;
  faqs: FaqItem[];
}

/* -------------------------------------------------------------------------- */
/*  Utilidades                                                                  */
/* -------------------------------------------------------------------------- */

/* Réplica: os .md originais ficam em demos/cirurgia-mohs/content. */
const CONTENT_DIR = path.join(process.cwd(), "demos", "cirurgia-mohs", "content");
const SOURCES: SourceDir[] = ["paginas", "blog-pacientes", "area-medica"];

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pageKey(slug: string): string {
  return slug === "/" ? "home" : slugify(slug.replace(/^\//, "").replace(/\//g, "-"));
}

/** Rótulo curto de uma página a partir do H1 (parte antes dos dois-pontos). */
export function shortTitle(h1: string): string {
  return h1.split(":")[0].trim();
}

function stripMarkdown(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* -------------------------------------------------------------------------- */
/*  Índice bruto (frontmatter de todos os arquivos)                             */
/* -------------------------------------------------------------------------- */

interface RawEntry {
  source: SourceDir;
  file: string;
  raw: string;
  fm: Frontmatter;
  body: string;
}

let rawIndex: Map<string, RawEntry> | null = null;

function loadRawIndex(): Map<string, RawEntry> {
  if (rawIndex) return rawIndex;
  const map = new Map<string, RawEntry>();
  for (const source of SOURCES) {
    const dir = path.join(CONTENT_DIR, source);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = parseFrontmatter(applyPlaceholders(raw));
      const fm = parsed.data;
      if (!fm.slug) continue;
      map.set(fm.slug, { source, file, raw, fm, body: parsed.content });
    }
  }
  rawIndex = map;
  return map;
}

function linkLabel(href: string): string {
  const entry = loadRawIndex().get(href);
  if (entry) return shortTitle(entry.fm.h1);
  if (href === "/blog") return "Blog";
  return href;
}

/**
 * Converte [LINK: /slug] em link Markdown com o título da página de destino
 * e [Botão: url] embutido em texto (ex.: dentro de tabelas) em link simples.
 */
function resolveLinks(md: string): string {
  return md
    .replace(/\[LINK:\s*([^\]\s]+)\s*\]/g, (_m, href: string) => `[${linkLabel(href)}](${href})`)
    .replace(/\[Botão[^:\]]*:\s*([^\]]+?)\]/g, (_m, href: string) => {
      const h = href.trim();
      const label = h.startsWith("https://wa.me")
        ? "Abrir WhatsApp"
        : h.startsWith("tel:")
          ? "Ligar"
          : h.startsWith("mailto:")
            ? "Enviar e-mail"
            : "Acessar";
      return `[${label}](${h})`;
    });
}

/* -------------------------------------------------------------------------- */
/*  Parser de blocos                                                            */
/* -------------------------------------------------------------------------- */

const IMAGE_RE = /^\[(?:IMAGEM|MAPA):\s*(.+?)\s*(?:—|-)\s*alt:\s*"([^"]*)"\s*\]\s*$/;
/* [INDICACAO: contexto — alt: "…"]: espaço de indicação de médico ou serviço, com id "indicacao-<página>-NN" */
const INDICACAO_RE = /^\[INDICACAO:\s*(.+?)\s*(?:—|-)\s*alt:\s*"([^"]*)"\s*\]\s*$/;
const CARD_RE =
  /^-\s*\*\*\[Card\]\s*(.+?)\*\*\s*(?:—\s*(.*?)\s*)?→\s*(\S+)\s*(?:—\s*(.*))?$/;
const BUTTON_RE = /^\[Botão\s*([^:\]]*):\s*(.+?)\]\s*$/;

function parseButton(line: string): ButtonItem | null {
  const m = line.match(BUTTON_RE);
  if (!m) return null;
  const rawLabel = m[1].trim();
  const href = m[2].trim();
  if (href.startsWith("https://wa.me")) {
    return {
      label: rawLabel.toLowerCase().includes("profissional")
        ? "WhatsApp profissional"
        : "Falar no WhatsApp",
      href,
      kind: "whatsapp",
    };
  }
  if (href.startsWith("tel:")) {
    return { label: `Ligar ${href.replace("tel:", "")}`, href, kind: "phone" };
  }
  if (href.startsWith("mailto:")) {
    return { label: "Enviar e-mail", href, kind: "email" };
  }
  return { label: rawLabel || "Saiba mais", href, kind: "link" };
}

function parseBlocks(
  text: string,
  ctx: {
    key: string;
    page: string;
    images: ImageSpec[];
    counter: { n: number };
    indicacoes: ImageSpec[];
    adCounter: { n: number };
  },
): Block[] {
  const blocks: Block[] = [];
  const lines = text.split("\n");
  let buf: string[] = [];

  const flush = () => {
    const md = buf.join("\n").trim();
    if (md) blocks.push({ type: "markdown", md: resolveLinks(md) });
    buf = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Imagem ilustrativa
    const img = line.match(IMAGE_RE);
    if (img) {
      flush();
      ctx.counter.n += 1;
      const n = String(ctx.counter.n).padStart(2, "0");
      const image: ImageSpec = {
        id: `${ctx.key}-${n}`,
        description: img[1].trim(),
        alt: img[2].trim(),
        suggestedFile: `${ctx.key}-${n}-${slugify(img[2]).slice(0, 60)}.webp`,
        page: ctx.page,
      };
      ctx.images.push(image);
      blocks.push({ type: "image", image });
      continue;
    }

    // Espaço de indicação de médico ou serviço
    const ad = line.match(INDICACAO_RE);
    if (ad) {
      flush();
      ctx.adCounter.n += 1;
      const n = String(ctx.adCounter.n).padStart(2, "0");
      const image: ImageSpec = {
        id: `indicacao-${ctx.key}-${n}`,
        description: ad[1].trim(),
        alt: ad[2].trim(),
        suggestedFile: `indicacao-${ctx.key}-${n}.webp`,
        page: ctx.page,
      };
      ctx.indicacoes.push(image);
      blocks.push({ type: "indicacao", image });
      continue;
    }

    // Formulário: o site não tem componente de formulário; o bloco é omitido
    if (line.trim() === "[FORMULÁRIO]") {
      flush();
      while (i < lines.length && lines[i].trim() !== "[/FORMULÁRIO]") i++;
      continue;
    }

    // Lista de cards
    if (CARD_RE.test(line)) {
      flush();
      const items: CardItem[] = [];
      while (i < lines.length && CARD_RE.test(lines[i])) {
        const m = lines[i].match(CARD_RE)!;
        const before = (m[2] ?? "").trim();
        const after = (m[4] ?? "").replace(/\[LINK:[^\]]*\]/g, "").trim();
        items.push({
          title: m[1].trim(),
          href: m[3].trim(),
          description: [before, after].filter(Boolean).join(" "),
        });
        i++;
      }
      i--;
      blocks.push({ type: "cards", items });
      continue;
    }

    // Botões avulsos
    if (BUTTON_RE.test(line)) {
      flush();
      const items: ButtonItem[] = [];
      while (i < lines.length && BUTTON_RE.test(lines[i])) {
        const b = parseButton(lines[i]);
        if (b) items.push(b);
        i++;
      }
      i--;
      blocks.push({ type: "buttons", items });
      continue;
    }

    buf.push(line);
  }
  flush();
  return blocks;
}

function parseFaq(text: string): { intro: string; items: FaqItem[] } {
  const parts = text.split(/\n(?=### )/);
  const intro = parts[0].startsWith("### ") ? "" : parts.shift()!.trim();
  const items: FaqItem[] = [];
  for (const part of parts) {
    const m = part.match(/^###\s+(.+)\n([\s\S]*)$/);
    if (!m) continue;
    items.push({ question: m[1].trim(), answer: resolveLinks(m[2].trim()) });
  }
  return { intro, items };
}

function parseCta(text: string): CtaBlock {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const buttons: ButtonItem[] = [];
  let title = "";
  const body: string[] = [];
  let note: string | undefined;
  for (const line of lines) {
    if (line === "---") continue;
    const b = parseButton(line);
    if (b) {
      buttons.push(b);
      continue;
    }
    if (!title && /^\*\*.+\*\*$/.test(line)) {
      title = line.replace(/^\*\*|\*\*$/g, "");
      continue;
    }
    if (/^\*.+\*$/.test(line) && !line.startsWith("**")) {
      note = resolveLinks(line.replace(/^\*|\*$/g, ""));
      continue;
    }
    body.push(line);
  }
  return { title, text: resolveLinks(body.join(" ")), buttons, note };
}

function parseRelated(text: string): RelatedLink[] {
  const out: RelatedLink[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^-\s*\[LINK:\s*(\S+)\s*\]\s*(.*)$/);
    if (!m) continue;
    // Ignora links para páginas que não existem mais no índice.
    if (m[1] !== "/blog" && !loadRawIndex().has(m[1])) continue;
    out.push({ href: m[1], label: m[2].trim() || linkLabel(m[1]) });
  }
  return out;
}

function parseSchema(text: string): Record<string, unknown> | null {
  const m = text.match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]) as Record<string, unknown>;
  } catch (err) {
    console.warn("JSON-LD inválido:", (err as Error).message);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Montagem da página                                                          */
/* -------------------------------------------------------------------------- */

const pageCache = new Map<string, ContentPage>();

function buildPage(entry: RawEntry): ContentPage {
  const { fm, source, file } = entry;
  let body = entry.body.replace(/\r\n/g, "\n");

  // Remove o H1 (é renderizado pelo template)
  body = body.replace(/^\s*#\s+.+\n/, "");

  // Schema JSON-LD
  let schema: Record<string, unknown> | null = null;
  const schemaIdx = body.search(/\n##\s+Schema JSON-LD/);
  if (schemaIdx >= 0) {
    schema = parseSchema(body.slice(schemaIdx));
    body = body.slice(0, schemaIdx);
  }

  // Bloco "Revisado por"
  let reviewedBy: string | undefined;
  body = body.replace(/^>\s*\*\*Revisado por[^\n]*\n?/m, (m) => {
    // Sem datas no site: a frase "Última revisão: …" sai do texto
    reviewedBy = resolveLinks(
      m
        .replace(/^>\s*/, "")
        .replace(/\s*Última revisão:\s*[^.]*\.\s*/i, " ")
        .replace(/\s{2,}/g, " ")
        .trim(),
    );
    return "";
  });

  const key = pageKey(fm.slug);
  const ctx = {
    key,
    page: fm.slug,
    images: [] as ImageSpec[],
    counter: { n: 0 },
    indicacoes: [] as ImageSpec[],
    adCounter: { n: 0 },
  };

  // Divide por H2
  const rawSections = body.split(/\n(?=## )/);
  const introText = rawSections[0].startsWith("## ") ? "" : rawSections.shift()!;

  const intro = parseBlocks(introText, ctx);
  const sections: Section[] = [];
  let cta: CtaBlock | undefined;
  let related: RelatedLink[] = [];
  const faqs: FaqItem[] = [];

  for (const chunk of rawSections) {
    const m = chunk.match(/^##\s+(.+)\n([\s\S]*)$/);
    if (!m) continue;
    const title = m[1].trim();
    const text = m[2].replace(/\n---\s*$/, "").trim();

    // "## CTA" (copy v1) ou "## Fecho" (copy v2): bloco de fechamento da página
    if (/^(CTA|Fecho)/i.test(title)) {
      cta = parseCta(text);
      continue;
    }
    if (/^Artigos relacionados/i.test(title)) {
      related = parseRelated(text);
      continue;
    }
    if (/^Rodapé/i.test(title)) continue;

    const isFaq = (/perguntas frequentes|^FAQ/i.test(title) || fm.slug === "/perguntas-frequentes") && /^###\s/m.test(text);
    const isReferences = /^Refer[êe]ncias/i.test(title);

    if (isFaq) {
      const { intro: faqIntro, items } = parseFaq(text);
      const blocks: Block[] = [];
      if (faqIntro) blocks.push(...parseBlocks(faqIntro, ctx));
      blocks.push({ type: "faq", items });
      faqs.push(...items);
      sections.push({ id: slugify(title), title, blocks, isFaq, isReferences });
      continue;
    }

    sections.push({
      id: slugify(title),
      title,
      blocks: parseBlocks(text, ctx),
      isFaq: false,
      isReferences,
    });
  }

  // Lead: primeiro parágrafo de texto
  const firstMd = intro.find((b) => b.type === "markdown");
  let lead = fm.description;
  if (firstMd && firstMd.type === "markdown") {
    const paragraphs = firstMd.md.split(/\n\s*\n/);
    lead = stripMarkdown(paragraphs[0]);
    // O parágrafo de resposta direta é exibido no cabeçalho da página;
    // removemos do corpo para não duplicar.
    const rest = paragraphs.slice(1).join("\n\n").trim();
    const idx = intro.indexOf(firstMd);
    if (rest) intro[idx] = { type: "markdown", md: rest };
    else intro.splice(idx, 1);
  }

  const wordCount = stripMarkdown(body).split(/\s+/).filter(Boolean).length;

  return {
    slug: fm.slug,
    source,
    file,
    fm,
    lead,
    reviewedBy,
    intro,
    sections,
    cta,
    related,
    schema,
    images: ctx.images,
    indicacoes: ctx.indicacoes,
    wordCount,
    readingTime: Math.max(1, Math.round(wordCount / 200)),
    faqs,
  };
}

/* -------------------------------------------------------------------------- */
/*  API pública                                                                 */
/* -------------------------------------------------------------------------- */

export function getPage(slug: string): ContentPage | null {
  const normalized = slug === "" ? "/" : slug.startsWith("/") ? slug : `/${slug}`;
  if (pageCache.has(normalized)) return pageCache.get(normalized)!;
  const entry = loadRawIndex().get(normalized);
  if (!entry) return null;
  const page = buildPage(entry);
  pageCache.set(normalized, page);
  return page;
}

export function getAllSlugs(): string[] {
  return [...loadRawIndex().keys()];
}

export function getAllPages(): ContentPage[] {
  return getAllSlugs()
    .map((s) => getPage(s)!)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getBlogPosts(): ContentPage[] {
  return getAllPages().filter((p) => p.source === "blog-pacientes");
}

export function getTechnicalArticles(): ContentPage[] {
  return getAllPages().filter((p) => p.source === "area-medica");
}

export function getRegionalPages(): ContentPage[] {
  return getAllPages().filter((p) => p.fm.tipo === "regional");
}

export function getPostsByCategory(category: string): ContentPage[] {
  return getBlogPosts().filter(
    (p) => p.fm.categoria && slugify(p.fm.categoria) === slugify(category),
  );
}

export function getAllImageSpecs(): ImageSpec[] {
  return getAllPages().flatMap((p) => p.images);
}

export function getAllIndicacaoSpecs(): ImageSpec[] {
  return getAllPages().flatMap((p) => p.indicacoes);
}

export function absoluteUrl(slug: string): string {
  return slug === "/" ? `${siteUrl}/` : `${siteUrl}${slug}`;
}

/** Breadcrumbs a partir do BreadcrumbList do schema, com fallback pelo slug. */
export function getBreadcrumbs(page: ContentPage): { name: string; href: string }[] {
  const graph = (page.schema?.["@graph"] as Record<string, unknown>[] | undefined) ?? [];
  const bc = graph.find((n) => n["@type"] === "BreadcrumbList") as
    | { itemListElement: { name: string; item: string }[] }
    | undefined;
  if (bc?.itemListElement?.length) {
    return bc.itemListElement.map((li) => ({
      name: li.name,
      href: li.item.replace(/^https?:\/\/[^/]+/, "") || "/",
    }));
  }
  const parts = page.slug.split("/").filter(Boolean);
  const crumbs = [{ name: "Início", href: "/" }];
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    const p = getPage(acc);
    crumbs.push({ name: p ? shortTitle(p.fm.h1) : part, href: acc });
  }
  return crumbs;
}
