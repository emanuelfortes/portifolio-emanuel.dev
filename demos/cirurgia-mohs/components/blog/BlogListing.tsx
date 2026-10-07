import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { ContentPage } from "@/demos/cirurgia-mohs/lib/content";
import { slugify } from "@/demos/cirurgia-mohs/lib/content";
import { blogCategories } from "@/demos/cirurgia-mohs/config/site";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import { ArrowIcon } from "@/demos/cirurgia-mohs/components/ui/Button";
import Breadcrumbs from "@/demos/cirurgia-mohs/components/content/Breadcrumbs";
import ImagePlaceholder from "@/demos/cirurgia-mohs/components/content/ImagePlaceholder";
import CtaBand from "@/demos/cirurgia-mohs/components/layout/CtaBand";
import { TeaserColumn, TeaserText, postImage } from "./Teasers";

/* 1 destaque + 3 com imagem + 8 só texto por página (docs/HANDOFF.md §4). */
export const POSTS_PER_PAGE = 12;

/**
 * Listagem do blog (docs/HANDOFF.md §4): hero navy sem imagem, abas de
 * categoria, artigo em destaque com capitular, linha de três com imagem,
 * lista de jornal só texto, paginação tipográfica e faixa CTA.
 * (Réplica: sem o JSON-LD CollectionPage + ItemList do original.)
 */
export default function BlogListing({
  posts,
  page,
  totalPages,
  category,
  basePath,
}: {
  posts: ContentPage[];
  page: number;
  totalPages: number;
  category?: string;
  basePath: string; // "/blog" ou "/blog/categoria/x"
}) {
  const title = category ? `Blog: ${category}` : "Blog para pacientes";
  const description = category
    ? `Artigos sobre ${category.toLowerCase()} escritos para pacientes e familiares, revisados por médico com CRM e RQE.`
    : "Artigos claros sobre cirurgia de Mohs, tipos de câncer de pele, pós-operatório, convênios e custos, revisados por médico com CRM e RQE.";

  const crumbs = [{ name: "Início", href: "/" }, { name: "Blog", href: "/blog" }];
  if (category) crumbs.push({ name: category, href: basePath });

  const pageHref = (n: number) => (n <= 1 ? basePath : `${basePath}/pagina/${n}`);
  const tabs = [
    { label: "Todos", href: "/blog", active: !category },
    ...blogCategories.map((c) => ({ label: c, href: `/blog/categoria/${slugify(c)}`, active: category === c })),
  ];

  const [featured, ...rest] = posts;
  const row = rest.slice(0, 3);
  const columns: ContentPage[][] = [[], [], []];
  rest.slice(3).forEach((p, i) => columns[Math.min(2, Math.floor(i / 3))].push(p));

  return (
    <>
      <header className="bg-navy text-paper">
        <Container className="py-14 text-center md:pb-[72px] md:pt-16">
          <div className="flex justify-center [&_a]:text-navy-300 [&_a:hover]:text-paper [&_nav]:text-navy-300 [&_span]:text-paper">
            <Breadcrumbs items={crumbs} />
          </div>
          <p className="eyebrow mt-6 text-accent-500">Conteúdo para pacientes</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl leading-[1.06] md:text-[60px]">{title}</h1>
          <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-relaxed text-navy-200">{description}</p>
        </Container>
      </header>

      <nav aria-label="Categorias do blog" className="border-b border-navy">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-[18px] gap-y-2.5 py-3.5 md:gap-x-10 md:py-0">
            {tabs.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={t.active ? "page" : undefined}
                  className={`block border-b-2 text-[11px] font-bold uppercase tracking-[1px] md:py-5 ${
                    t.active ? "border-navy text-navy" : "border-transparent text-muted hover:text-navy"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <Container>
        {featured && (
          <article
            className="grid gap-8 border-b border-navy py-10 md:grid-cols-[7fr_5fr] md:items-center md:gap-12 md:py-12"
            data-aos="fade-up"
          >
            <Link href={featured.slug} tabIndex={-1} aria-hidden="true" className="block">
              <ImagePlaceholder
                image={postImage(featured)}
                ratio="16/10"
                frame
                priority
                sizes="(min-width: 768px) 620px, 100vw"
              />
            </Link>
            <div>
              <p className="eyebrow">Em destaque · {featured.fm.categoria ?? "Blog"}</p>
              <h2 className="mt-3 text-balance text-[28px] leading-[1.1] text-navy md:text-[40px]">
                <Link href={featured.slug} className="hover:text-gold">
                  {featured.fm.h1}
                </Link>
              </h2>
              <p className="dropcap-sm mt-4 text-sm leading-relaxed text-ink-muted">{featured.fm.description}</p>
              <p className="mt-4 flex items-center gap-2 text-[11px] text-muted">
                {featured.readingTime} min de leitura ·
                <Link href={featured.slug} className="action-link">
                  Ler <ArrowIcon className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </article>
        )}

        {row.length > 0 && (
          <div className="grid gap-6 border-b border-navy py-10 md:grid-cols-3 md:gap-x-8 md:py-12">
            {row.map((p, i) => (
              <TeaserColumn
                key={p.slug}
                post={p}
                ratio="16/10"
                thumb={96}
                showSummary
                className={`md:pr-8 ${i < 2 ? "md:border-r md:border-line" : ""}`}
              />
            ))}
          </div>
        )}

        <div className="grid py-10 md:grid-cols-3 md:gap-x-8 md:py-12">
          {columns.map((col, ci) => (
            <div key={ci} className={`md:pr-8 ${ci < 2 ? "md:border-r md:border-line" : ""}`}>
              {col.map((p) => (
                <TeaserText key={p.slug} post={p} />
              ))}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Paginação"
            className="flex flex-wrap items-center justify-center gap-7 border-t border-navy py-10 text-xs font-bold uppercase tracking-[1px] text-muted"
          >
            {page > 1 && (
              <Link href={pageHref(page - 1)} rel="prev" className="hover:text-navy">
                ← Anterior
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={pageHref(n)}
                aria-current={n === page ? "page" : undefined}
                className={n === page ? "border-b-2 border-navy pb-1 text-navy" : "hover:text-navy"}
              >
                {n}
              </Link>
            ))}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} rel="next" className="text-teal hover:underline">
                Próxima →
              </Link>
            )}
          </nav>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
