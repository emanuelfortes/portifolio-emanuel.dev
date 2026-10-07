import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { RelatedLink } from "@/demos/cirurgia-mohs/lib/content";
import { getPage } from "@/demos/cirurgia-mohs/lib/content";
import { ArrowIcon } from "@/demos/cirurgia-mohs/components/ui/Button";

/**
 * Lista "Artigos relacionados" (links internos do cluster).
 *
 * No máximo 4, em duas colunas: a partir daí o quinto item fica sozinho numa
 * linha inteira, e a lista deixa de parecer um bloco.
 */
const MAXIMO = 4;

export default function RelatedArticles({ items, title = "Artigos relacionados" }: { items: RelatedLink[]; title?: string }) {
  if (!items.length) return null;
  const lista = items.slice(0, MAXIMO);
  return (
    <nav aria-labelledby="relacionados" className="not-prose mt-16" data-aos="fade-up">
      <h2 id="relacionados" className="font-display text-2xl text-navy-800">
        {title}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="list">
        {lista.map((r) => {
          const target = getPage(r.href);
          return (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group flex h-full items-start justify-between gap-3 rounded-xl border border-line bg-white p-4 transition-all hover:border-navy-300 hover:shadow-sm"
              >
                <span>
                  <span className="block font-semibold leading-snug text-navy-800">{r.label}</span>
                  {target?.fm.categoria && (
                    <span className="mt-1 block text-xs uppercase tracking-wider text-accent-600">
                      {target.fm.categoria}
                    </span>
                  )}
                </span>
                <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-navy-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-600" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
