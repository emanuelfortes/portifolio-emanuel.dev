import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { ContentPage } from "@/demos/cirurgia-mohs/lib/content";
import { getTechnicalArticles, shortTitle } from "@/demos/cirurgia-mohs/lib/content";
import { locaisMohs } from "@/demos/cirurgia-mohs/config/site";
import PageHeader from "@/demos/cirurgia-mohs/components/content/PageHeader";
import { eyebrowFor } from "./labels";
import ContentLayout from "./ContentLayout";
import SidebarCta from "./SidebarCta";
import ArticleTemplate from "./Article";

/* -------------------------------------------------------------------------- */
/*  Pilar: /cirurgia-de-mohs, /cancer-de-pele/*, /pos-operatorio, hubs         */
/* -------------------------------------------------------------------------- */
export function PillarTemplate({ page }: { page: ContentPage }) {
  const topic = shortTitle(page.fm.h1).toLowerCase();
  return (
    <>
      <PageHeader page={page} eyebrow={eyebrowFor(page)} tone="dark" />
      <div className="pt-12">
        <ContentLayout page={page} sidebar={<SidebarCta topic={topic} variant={page.fm.cta === "medico" ? "medico" : "paciente"} />} />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Artigo de blog: /blog/* (layout editorial em ./Article.tsx)                 */
/* -------------------------------------------------------------------------- */
export { ArticleTemplate };

/* -------------------------------------------------------------------------- */
/*  Regional: /cirurgia-de-mohs-nordeste/*                                     */
/* -------------------------------------------------------------------------- */
export function RegionalTemplate({ page }: { page: ContentPage }) {
  const topic = shortTitle(page.fm.h1).toLowerCase();
  // Fortaleza primeiro (serviço de referência), depois os demais estados, sem a página atual
  const locais = locaisMohs.filter((l) => l.href !== page.slug);
  return (
    <>
      <PageHeader page={page} eyebrow="Atendimento a pacientes de outros estados" tone="dark" />
      <div className="pt-12">
        <ContentLayout
          page={page}
          sidebar={
            <>
              <SidebarCta topic={topic} />
              <nav aria-labelledby="outros-estados" className="rounded-2xl border border-line bg-white p-5">
                <p id="outros-estados" className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                  Onde fazer
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {locais.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-navy-700 hover:underline underline-offset-2">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/cirurgia-de-mohs-nordeste" className="font-semibold text-navy-800 hover:underline underline-offset-2">
                      Ver todo o Nordeste
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          }
        />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Técnico: /para-medicos/*                                                   */
/* -------------------------------------------------------------------------- */
export function TechnicalTemplate({ page }: { page: ContentPage }) {
  const others = getTechnicalArticles().filter((p) => p.slug !== page.slug);
  return (
    <>
      <PageHeader page={page} eyebrow="Área médica · conteúdo técnico" />
      <ContentLayout
        page={page}
        proseClass="prose-mohs prose-tecnico"
        sidebar={
          <>
            <SidebarCta topic={page.fm.h1} variant="medico" />
            <nav aria-labelledby="outros-tecnicos" className="rounded-2xl border border-line bg-white p-5">
              <p id="outros-tecnicos" className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                Outros artigos técnicos
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.slug} className="text-navy-700 hover:underline underline-offset-2">
                      {shortTitle(p.fm.h1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        }
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Institucional: /perguntas-frequentes, /politica-de-privacidade             */
/* -------------------------------------------------------------------------- */
export function InstitutionalTemplate({ page }: { page: ContentPage }) {
  const isPrivacy = page.slug === "/politica-de-privacidade";
  const topic = shortTitle(page.fm.h1).toLowerCase();
  return (
    <>
      <PageHeader page={page} showMeta={!isPrivacy} eyebrow={isPrivacy ? "LGPD" : undefined} />
      <ContentLayout
        page={page}
        intermediateCta={false}
        sidebar={isPrivacy ? undefined : <SidebarCta topic={topic} variant={page.fm.cta === "medico" ? "medico" : "paciente"} />}
      />
    </>
  );
}

/**
 * Páginas-pilar que abrem no layout editorial das páginas filhas, para o grupo
 * inteiro ter a mesma cara. É só estilo: o `tipo` do conteúdo continua "pilar",
 * e com ele a prioridade no sitemap e o Open Graph.
 */
const editorialPillars = new Set(["/cancer-de-pele"]);

/** Escolhe o template pelo campo `tipo` do frontmatter. */
export function renderTemplate(page: ContentPage) {
  switch (page.fm.tipo) {
    case "artigo":
      return <ArticleTemplate page={page} />;
    case "tecnico":
      return <TechnicalTemplate page={page} />;
    case "regional":
      return <RegionalTemplate page={page} />;
    case "pilar":
    case "hub regional":
    case "página local":
      return editorialPillars.has(page.slug) ? <ArticleTemplate page={page} /> : <PillarTemplate page={page} />;
    default:
      return <InstitutionalTemplate page={page} />;
  }
}
