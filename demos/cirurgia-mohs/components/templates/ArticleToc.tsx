"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string };

/**
 * "Neste artigo" (docs/HANDOFF.md §5.3): lista fixa na lateral no desktop, com
 * o item ativo acompanhando a rolagem, e barra recolhível no celular.
 */
export default function ArticleToc({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);
  const key = items.map((i) => i.id).join("|");

  useEffect(() => {
    const els = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  if (items.length < 2) return null;

  const list = (
    <ol className="text-[13px]">
      {items.map((s) => (
        <li key={s.id} className="border-b border-line">
          <a
            href={`#${s.id}`}
            className={`block py-2 transition-colors hover:text-navy ${active === s.id ? "font-semibold text-navy" : "text-ink-muted"}`}
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <nav aria-label="Neste artigo" className="hidden border-t-2 border-navy pt-4 md:block">
        <p className="eyebrow">Neste artigo</p>
        <div className="mt-2">{list}</div>
      </nav>
      <details className="disclosure border-b border-t-2 border-navy md:hidden">
        <summary className="flex items-center justify-between py-3.5 text-[11px] font-bold uppercase tracking-[1px] text-navy">
          Neste artigo
          <span className="faq-plus font-display text-xl leading-none" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="pb-3">{list}</div>
      </details>
    </>
  );
}
