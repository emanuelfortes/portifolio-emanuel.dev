import type { ContentPage } from "@/demos/cirurgia-mohs/lib/content";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import { Blocks, SectionRenderer } from "@/demos/cirurgia-mohs/components/content/BlockRenderer";
import Toc from "@/demos/cirurgia-mohs/components/content/Toc";
import CtaBlock from "@/demos/cirurgia-mohs/components/content/CtaBlock";
import ReviewedBy from "@/demos/cirurgia-mohs/components/content/ReviewedBy";
import RelatedArticles from "@/demos/cirurgia-mohs/components/content/RelatedArticles";
import type { ReactNode } from "react";

/**
 * Layout editorial comum: coluna de conteúdo + coluna lateral (TOC e CTA fixo).
 * Um CTA intermediário discreto é inserido após a 3ª seção em páginas longas
 * (regra 6.3 da estratégia: nunca mais de 2 CTAs além do final).
 */
export default function ContentLayout({
  page,
  proseClass = "prose-mohs",
  sidebar,
  intermediateCta = true,
  children,
}: {
  page: ContentPage;
  proseClass?: string;
  sidebar?: ReactNode;
  intermediateCta?: boolean;
  children?: ReactNode;
}) {
  const ctaVariant = page.fm.cta === "medico" ? "medico" : "paciente";
  const midIndex = intermediateCta && page.sections.length >= 6 ? 2 : -1;

  return (
    <Container className="pb-24">
      <div className="grid gap-12 lg:grid-cols-12">
        {/* min-w-0: item de grid não pode ser esticado por um conteúdo largo (tabela, URL) no celular */}
        <article className={`${proseClass} min-w-0 lg:col-span-8`} itemScope>
          {/* "Revisado por…" vem do conteúdo; na copy v2 é a equipe editorial, sem nome */}
          {page.reviewedBy && <ReviewedBy text={page.reviewedBy} />}
          <Blocks blocks={page.intro} priorityImage />
          {children}
          {page.sections.map((section, i) => (
            <div key={section.id}>
              <SectionRenderer section={section} />
              {i === midIndex && page.cta && (
                <CtaBlock
                  cta={{
                    title:
                      ctaVariant === "medico"
                        ? "Tem um paciente com indicação de Mohs? Use o canal de encaminhamento profissional."
                        : "Quer saber se o seu caso tem indicação? Fale com o especialista.",
                    text: "",
                    buttons: page.cta.buttons.slice(0, 1),
                  }}
                  variant={ctaVariant}
                  compact
                />
              )}
            </div>
          ))}
          {page.cta && <CtaBlock cta={page.cta} variant={ctaVariant} />}
          <RelatedArticles items={page.related} />
        </article>

        <aside className="lg:col-span-4" aria-label="Navegação da página">
          <div className="space-y-6 lg:sticky lg:top-20">
            <Toc sections={page.sections} />
            {sidebar}
          </div>
        </aside>
      </div>
    </Container>
  );
}
