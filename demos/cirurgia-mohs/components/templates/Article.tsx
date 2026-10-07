import { Fragment } from "react";
import Link from "@/demos/cirurgia-mohs/lib/Link";
import Image from "next/image";
import type { Block, ContentPage, ImageSpec, Section } from "@/demos/cirurgia-mohs/lib/content";
import { getBlogPosts, getBreadcrumbs, getPage, slugify } from "@/demos/cirurgia-mohs/lib/content";
import { siteConfig, whatsappLink, phoneLink, doctorBio, doctorName } from "@/demos/cirurgia-mohs/config/site";
import { images, slot } from "@/demos/cirurgia-mohs/config/images";
import { formatPhone } from "@/demos/cirurgia-mohs/lib/format";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import Button, { ArrowIcon, PhoneIcon, WhatsAppIcon } from "@/demos/cirurgia-mohs/components/ui/Button";
import Breadcrumbs from "@/demos/cirurgia-mohs/components/content/Breadcrumbs";
import ImagePlaceholder, { isDetailedImage } from "@/demos/cirurgia-mohs/components/content/ImagePlaceholder";
import { Blocks } from "@/demos/cirurgia-mohs/components/content/BlockRenderer";
import Markdown from "@/demos/cirurgia-mohs/components/content/Markdown";
import { TeaserColumn, postImage } from "@/demos/cirurgia-mohs/components/blog/Teasers";
import ArticleToc from "./ArticleToc";
import { eyebrowFor } from "./labels";

/**
 * Artigo do blog (docs/HANDOFF.md §5): abertura clara estilo revista com bloco
 * de autor, foto de abertura 21/9, corpo editorial com capitular e CTA sem
 * fundo, lateral fixa e "Leia também". Sem faixa CTA navy: o CTA fica no
 * bloco do autor, no fim do texto.
 */

/** Retira a primeira imagem do corpo para usá-la como foto de abertura (sem alterar a página em cache). */
function hoistFirstImage(page: ContentPage): { image?: ImageSpec; intro: Block[]; sections: Section[] } {
  const introIdx = page.intro.findIndex((b) => b.type === "image");
  if (introIdx >= 0) {
    const block = page.intro[introIdx];
    return {
      image: block.type === "image" ? block.image : undefined,
      intro: page.intro.filter((_, i) => i !== introIdx),
      sections: page.sections,
    };
  }
  for (let s = 0; s < page.sections.length; s++) {
    const idx = page.sections[s].blocks.findIndex((b) => b.type === "image");
    if (idx < 0) continue;
    const block = page.sections[s].blocks[idx];
    return {
      image: block.type === "image" ? block.image : undefined,
      intro: page.intro,
      sections: page.sections.map((sec, i) =>
        i === s ? { ...sec, blocks: sec.blocks.filter((_, j) => j !== idx) } : sec,
      ),
    };
  }
  return { intro: page.intro, sections: page.sections };
}

/** Foto do médico (id "autor-retrato" em src/config/images.ts) ou círculo reservado com as iniciais. */
function Avatar({ size, className = "" }: { size: number; className?: string }) {
  const asset = images["autor-retrato"];
  const nome = doctorName();
  if (asset) {
    return (
      <Image
        src={asset.src}
        alt={nome}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = siteConfig.nomeMedico
    ? nome
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "DR";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-dashed border-navy-300 bg-navy-50 font-display text-navy ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      aria-hidden="true"
      data-image-id="autor-retrato"
    >
      {initials}
    </span>
  );
}

/** CTA do conteúdo sem fundo (docs/HANDOFF.md §5.3): frase em display, texto e botão WhatsApp entre regras finas. */
function CtaInline({ title, text, href }: { title: string; text?: string; href: string }) {
  return (
    <aside
      className="not-prose my-12 flex flex-col gap-5 border-y border-navy py-7 md:flex-row md:items-center md:justify-between md:gap-10"
      aria-label="Fale com o especialista"
    >
      <div>
        <p className="font-display text-[22px] leading-snug text-navy">{title}</p>
        {text && <Markdown md={text} className="mt-2 text-[13px] leading-relaxed text-ink-muted [&_a]:underline" />}
      </div>
      <Button href={href} variant="whatsapp" className="shrink-0" data-track="click_whatsapp">
        <WhatsAppIcon /> Falar no WhatsApp
      </Button>
    </aside>
  );
}

export default function ArticleTemplate({ page }: { page: ContentPage }) {
  const medico = doctorName();
  const crm = siteConfig.crm || "[CRM]";
  const rqe = siteConfig.rqe || "[RQE]";
  const categoria = page.fm.categoria;
  const { image: opening, intro, sections } = hoistFirstImage(page);
  const tocItems = sections.filter((s) => !s.isReferences).map((s) => ({ id: s.id, title: s.title }));
  const siblings = getBlogPosts()
    .filter((p) => p.slug !== page.slug && p.fm.categoria === categoria)
    .slice(0, 3);
  // "Leia também": todos os relacionados do próprio texto, completados com artigos da categoria até 3.
  const related = [...page.related.map((r) => getPage(r.href)), ...siblings]
    .filter((p): p is ContentPage => p !== null && p.slug !== page.slug)
    .filter((p, i, arr) => arr.findIndex((q) => q.slug === p.slug) === i)
    .slice(0, 4);
  const relatedCols = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }[
    Math.min(4, related.length) as 1 | 2 | 3 | 4
  ];
  // Post do blog: trilha e etiqueta pela categoria. Página de conteúdo que usa
  // este layout (ver editorialPillars): trilha real do site e etiqueta da seção.
  const isBlogPost = page.source === "blog-pacientes";
  const crumbs = isBlogPost
    ? [
        { name: "Início", href: "/" },
        { name: "Blog", href: "/blog" },
        ...(categoria ? [{ name: categoria, href: `/blog/categoria/${slugify(categoria)}` }] : []),
      ]
    : getBreadcrumbs(page);
  const eyebrow = categoria ?? eyebrowFor(page) ?? (isBlogPost ? "Blog" : "Guia");
  const whatsapp =
    page.cta?.buttons.find((b) => b.kind === "whatsapp")?.href ??
    whatsappLink(`Olá! Li "${page.fm.h1}" no site ${siteConfig.marca} e gostaria de agendar uma avaliação.`);
  const phoneLabel = siteConfig.telefone ? `Ligar ${formatPhone(siteConfig.telefone)}` : "Ligar";
  const introHasText = intro.some((b) => b.type === "markdown");
  // CTA do conteúdo após a 3ª seção em textos longos; em textos curtos, após a última seção.
  const ctaAfter = sections.length >= 4 ? 2 : sections.length - 1;

  return (
    <>
      {/* Abertura */}
      <Container as="header" className="pt-10 md:pt-12">
        <Breadcrumbs items={crumbs} />
        {/* Título e resumo na largura toda da seção; o bloco do autor vira uma linha abaixo. */}
        <div className="mt-8 md:mt-10">
          <p className="eyebrow">
            {eyebrow} · {page.readingTime} min de leitura
          </p>
          <h1 className="mt-4 text-balance text-[32px] leading-[1.04] text-navy md:text-[60px]">{page.fm.h1}</h1>
          {/* Sem serifa: é texto de apoio, não título. A serifa fica nos títulos. */}
          <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-[19px]">{page.lead}</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t-2 border-navy pt-4 text-xs md:flex-row md:items-center md:justify-between md:gap-8">
          {/* "Revisado por…" vem do conteúdo (E-E-A-T); o avatar e o nome só com autoria nomeada */}
          {page.reviewedBy ? (
            <div className="flex items-center gap-3">
              {siteConfig.mostrarAutoria && <Avatar size={44} />}
              <Markdown md={page.reviewedBy} className="leading-relaxed text-muted [&_strong]:text-navy" />
            </div>
          ) : siteConfig.mostrarAutoria ? (
            <div className="flex items-center gap-3">
              <Avatar size={44} />
              <div>
                <p className="font-semibold text-navy">{medico}</p>
                <p className="text-muted">
                  Dermatologista · CRM {crm} · RQE {rqe}
                </p>
              </div>
            </div>
          ) : null}
        </div>
        {opening && (
          <div className="mt-10 md:mt-12">
            {/* Foto: recorte panorâmico (4:3 no celular). Infográfico: inteiro, para não cortar texto. */}
            <ImagePlaceholder
              image={opening}
              ratio={isDetailedImage(opening) ? "auto" : "21/9"}
              priority
              className={isDetailedImage(opening) ? "max-md:-mx-6" : "max-md:-mx-6 max-md:aspect-[4/3]"}
              sizes="(min-width: 1200px) 1072px, 100vw"
            />
            <p className="border-b border-navy pb-4 pt-3 text-xs text-muted">{opening.alt}</p>
          </div>
        )}
      </Container>

      {/* Corpo + lateral */}
      <Container className="grid gap-12 pt-12 md:grid-cols-[1fr_300px] md:items-start md:gap-16 md:pt-14">
        <article className="prose-editorial min-w-0">
          {intro.length > 0 && (
            <div className={introHasText ? "dropcap" : undefined}>
              <Blocks blocks={intro} />
            </div>
          )}
          {sections.map((section, i) => (
            <Fragment key={section.id}>
              <section
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className={`${section.isReferences ? "text-sm [&_li]:break-words [&_ol]:text-[0.85rem]" : ""} ${
                  !introHasText && i === 0 ? "dropcap" : ""
                }`}
              >
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <Blocks blocks={section.blocks} />
              </section>
              {/* Só com "## CTA"/"## Fecho" no conteúdo; a copy v2 usa [INDICACAO] no lugar */}
              {i === ctaAfter && page.cta && <CtaInline title={page.cta.title} text={page.cta.text} href={whatsapp} />}
            </Fragment>
          ))}

          {/* Bloco do autor + CTA (docs/HANDOFF.md §5.3) */}
          {siteConfig.mostrarAutoria && (
            <section
              className="not-prose mt-14 grid items-center gap-7 border-b border-t-2 border-navy py-8 md:grid-cols-[120px_1fr_auto]"
              aria-label="Quem escreve"
            >
              <Avatar size={120} />
              <div>
                <p className="eyebrow">Quem escreve</p>
                <h2 className="mt-1 text-2xl leading-tight text-navy">{medico}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{doctorBio()}</p>
                {page.cta?.note && <Markdown md={page.cta.note} className="mt-2 text-xs text-muted [&_a]:underline" />}
              </div>
              <div className="flex flex-col gap-2.5">
                <Button href={whatsapp} variant="whatsapp" data-track="click_whatsapp">
                  <WhatsAppIcon /> Falar no WhatsApp
                </Button>
                <Button href={phoneLink()} variant="secondary" data-track="click_telefone">
                  <PhoneIcon /> {phoneLabel}
                </Button>
              </div>
            </section>
          )}
        </article>

        <aside className="max-md:order-first md:sticky md:top-20 md:space-y-7" aria-label="Navegação do artigo">
          <ArticleToc items={tocItems} />
          <div className="hidden border-t border-line pt-6 md:block">
            {/* Só com a foto de verdade: um espaço reservado numa lateral estreita
                ocupa meia tela sem dizer nada a quem está lendo. */}
            {images["contato-consultorio"] && (
              <ImagePlaceholder
                image={slot(
                  "contato-consultorio",
                  "consultório ou recepção em Fortaleza, sem pacientes",
                  `Consultório de ${medico} em Fortaleza`,
                )}
                ratio="4/3"
                sizes="300px"
              />
            )}
            <p className="mt-4 font-display text-[19px] leading-snug text-navy">Recebeu um diagnóstico de câncer de pele?</p>
            {siteConfig.mostrarAutoria && (
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                {medico}, cirurgião de Mohs em Fortaleza, atende pacientes de todo o Ceará e estados vizinhos.
              </p>
            )}
            <Button size="sm" variant="whatsapp" href={whatsapp} className="mt-4" data-track="click_whatsapp">
              <WhatsAppIcon /> Falar no WhatsApp
            </Button>
          </div>
          {categoria && siblings.length > 0 && (
            <div className="hidden border-t border-line pt-6 md:block">
              <p className="eyebrow">Mais sobre {categoria}</p>
              <ul className="mt-2" role="list">
                {siblings.map((p) => (
                  <li key={p.slug} className="grid grid-cols-[56px_1fr] items-center gap-3 border-b border-line py-2.5">
                    <ImagePlaceholder image={postImage(p)} ratio="1/1" sizes="56px" />
                    <Link href={p.slug} className="font-display text-sm leading-snug text-navy hover:text-gold">
                      {p.fm.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      {/* Leia também */}
      {related.length > 0 ? (
        <Container as="section" className="pb-14 pt-16" aria-labelledby="leia-tambem">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-navy pt-6">
            <h2 id="leia-tambem" className="text-[26px] leading-tight text-navy md:text-[30px]">
              Leia também
            </h2>
            <Link href="/blog" className="action-link">
              Todos os artigos <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className={`mt-8 grid gap-6 md:gap-8 ${relatedCols}`}>
            {related.map((p) => (
              <TeaserColumn key={p.slug} post={p} ratio="16/10" thumb={80} titleClass="text-xl" />
            ))}
          </div>
        </Container>
      ) : (
        <div className="pb-14" />
      )}
    </>
  );
}
