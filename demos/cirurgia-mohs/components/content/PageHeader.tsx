import Image from "next/image";
import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { ContentPage } from "@/demos/cirurgia-mohs/lib/content";
import { getBreadcrumbs, pageKey, slugify } from "@/demos/cirurgia-mohs/lib/content";
import { images, type ImageAsset } from "@/demos/cirurgia-mohs/config/images";
import { siteConfig } from "@/demos/cirurgia-mohs/config/site";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import Breadcrumbs from "./Breadcrumbs";

/** Fotos "<chave>-fundo", "-b" e "-c" registradas para uma chave de página. */
function framesFor(key: string): ImageAsset[] {
  return [images[`${key}-fundo`], images[`${key}-fundo-b`], images[`${key}-fundo-c`]].filter(
    (a): a is ImageAsset => Boolean(a),
  );
}

/** Fundo da página; uma página filha sem foto própria herda a da página-mãe (estados ← hub Nordeste). */
function backdropFrames(slug: string): ImageAsset[] {
  const own = framesFor(pageKey(slug));
  if (own.length) return own;
  const parent = slug.split("/").slice(0, -1).join("/");
  return parent ? framesFor(pageKey(parent)) : [];
}

/**
 * Cabeçalho de página: breadcrumbs, categoria/etiqueta, H1, resposta direta
 * (primeiro parágrafo, otimizado para featured snippet) e metadados de autoria.
 *
 * No tom escuro, se existir a imagem "<chave-da-página>-fundo" (por exemplo
 * "cirurgia-de-mohs-fundo"), ela entra como fundo sob uma película navy; havendo
 * também "-b" e "-c", as três se alternam em transição lenta, como no hero da
 * home. A foto não interfere na altura: quem manda continua sendo o texto.
 */
export default function PageHeader({
  page,
  eyebrow,
  showMeta = true,
  tone = "light",
}: {
  page: ContentPage;
  eyebrow?: string;
  showMeta?: boolean;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const medico = siteConfig.nomeMedico || "[NOME DO MÉDICO]";
  const backdrop = dark ? backdropFrames(page.slug) : [];

  return (
    <header className={dark ? "relative isolate overflow-hidden bg-navy-800 text-paper" : ""}>
      {backdrop.map((f, i) => (
        <Image
          key={f.src}
          src={f.src}
          alt=""
          aria-hidden
          fill
          priority={i === 0}
          loading={i === 0 ? "eager" : "lazy"}
          sizes="100vw"
          className={`-z-20 object-cover ${i > 0 ? "hero-fundo" : ""}`}
          style={i === 2 ? { animationDelay: "6s" } : undefined}
        />
      ))}
      {backdrop.length > 0 && <div aria-hidden className="absolute inset-0 -z-10 bg-navy-800/85" />}
      <Container className="relative pb-10 pt-8">
        <div className={dark ? "[&_a]:text-navy-300 [&_a:hover]:text-paper [&_span]:text-navy-200" : ""}>
          <Breadcrumbs items={getBreadcrumbs(page)} />
        </div>
        <div className="mt-8 max-w-4xl" data-aos="fade-up">
          {(eyebrow || page.fm.categoria) && (
            <p className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-accent-500" : "text-accent-600"}`}>
              {eyebrow ??
                (page.fm.categoria ? (
                  <Link href={`/blog/categoria/${slugify(page.fm.categoria)}`} className="hover:underline">
                    {page.fm.categoria}
                  </Link>
                ) : null)}
            </p>
          )}
          <h1 className="mt-3 text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]">{page.fm.h1}</h1>
          {/* 15 → 16 → 18px, contra um H1 de 30 → 36 → 44px: mantém o título pelo
              menos duas vezes maior que o texto de apoio em qualquer largura. */}
          <p
            className={`mt-5 text-[15px] leading-relaxed sm:text-base lg:text-lg ${
              dark ? "text-navy-200" : "text-navy-700"
            }`}
          >
            {page.lead}
          </p>
          {showMeta && (
            <dl className={`mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm ${dark ? "text-navy-300" : "text-ink-muted"}`}>
              {siteConfig.mostrarAutoria && (
                <div className="flex gap-1.5">
                  <dt className="sr-only">Autor</dt>
                  <dd>
                    Por{" "}
                    <span className={`font-medium ${dark ? "text-paper" : "text-navy-800"}`}>{medico}</span>
                    {siteConfig.crm && <>, CRM {siteConfig.crm}</>}
                    {siteConfig.rqe && <> · RQE {siteConfig.rqe}</>}
                  </dd>
                </div>
              )}
              {/* Sem datas de publicação/revisão: o site não as exibe */}
              <div className="flex gap-1.5">
                <dt className="sr-only">Tempo de leitura</dt>
                <dd>{page.readingTime} min de leitura</dd>
              </div>
            </dl>
          )}
        </div>
      </Container>
    </header>
  );
}
