import type { Section } from "@/demos/cirurgia-mohs/lib/content";

/** Índice lateral (TOC) com as seções H2 da página. */
export default function Toc({ sections, title = "Nesta página" }: { sections: Section[]; title?: string }) {
  const items = sections.filter((s) => !s.isReferences);
  if (items.length < 2) return null;
  return (
    <nav aria-labelledby="toc-title" className="rounded-2xl border border-line bg-white p-5">
      <p id="toc-title" className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-600">
        {title}
      </p>
      <ol className="mt-3 space-y-2 text-sm leading-snug">
        {items.map((s, i) => (
          <li key={s.id} className="flex gap-2">
            <span className="w-5 shrink-0 text-right font-display text-navy-400">{i + 1}</span>
            <a href={`#${s.id}`} className="text-navy-700 transition-colors hover:text-navy-900 hover:underline underline-offset-2">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
