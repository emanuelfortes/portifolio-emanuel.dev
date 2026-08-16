"use client";

import { useEffect, useRef, useState } from "react";

type Group = {
  name: string;
  meta: string;
  items: { name: string; pct: number }[];
};

const groups: Group[] = [
  {
    name: "Frontend",
    meta: "07 tecnologias · interface",
    items: [
      { name: "HTML & CSS", pct: 90 },
      { name: "JavaScript (ES6+)", pct: 85 },
      { name: "React.js", pct: 80 },
      { name: "Next.js", pct: 75 },
      { name: "TypeScript", pct: 72 },
      { name: "Tailwind CSS", pct: 88 },
      { name: "UI / UX Principles", pct: 78 },
    ],
  },
  {
    name: "Backend",
    meta: "07 tecnologias · servidor & dados",
    items: [
      { name: "Node.js", pct: 80 },
      { name: "REST APIs", pct: 85 },
      { name: "PostgreSQL", pct: 75 },
      { name: "MySQL", pct: 72 },
      { name: "Autenticação & JWT", pct: 78 },
      { name: "Regras de Negócio", pct: 82 },
      { name: "Prisma ORM", pct: 70 },
    ],
  },
  {
    name: "Outros",
    meta: "06 competências · processo",
    items: [
      { name: "Git & GitHub", pct: 85 },
      { name: "Visão de Produto (PO)", pct: 80 },
      { name: "Lógica de Programação", pct: 90 },
      { name: "Metodologias Ágeis", pct: 75 },
      { name: "Docker (básico)", pct: 55 },
      { name: "Documentação técnica", pct: 78 },
    ],
  },
];

export default function Skills() {
  const [tab, setTab] = useState(0);
  const [barsIn, setBarsIn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Anima as barras na carga inicial
  useEffect(() => {
    timerRef.current = setTimeout(() => setBarsIn(true), 300);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Ao trocar de aba: zera as barras e re-anima logo em seguida
  const selectTab = (i: number) => {
    if (i === tab) return;
    clearTimeout(timerRef.current);
    setTab(i);
    setBarsIn(false);
    timerRef.current = setTimeout(() => setBarsIn(true), 40);
  };

  const active = groups[tab];

  return (
    <section id="skills" className="container-page relative pb-[90px] pt-[70px]">
      {/* Glow difuso à esquerda */}
      <div
        className="pointer-events-none absolute left-[-30%] top-[20%] h-[60vw] w-[60vw] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.13), transparent 65%)",
        }}
      />

      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-[clamp(26px,3vw,38px)] font-semibold tracking-[-0.03em]">
          Stack técnico
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-txt-label">
          do banco de dados à interface
        </span>
      </div>

      <div className="relative mt-9 overflow-hidden rounded-card-lg border border-lilac/[0.16] bg-surface-skills">
        {/* Header: segmented control + meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lilac/[0.12] px-7 py-[22px]">
          <div
            role="tablist"
            aria-label="Categorias de skills"
            className="flex gap-2 rounded-full border border-lilac/[0.14] bg-[rgba(124,92,255,0.06)] p-[5px]"
          >
            {groups.map((g, i) => (
              <button
                key={g.name}
                role="tab"
                aria-selected={i === tab}
                onClick={() => selectTab(i)}
                className={[
                  "rounded-full px-5 py-[9px] font-mono text-[11.5px] uppercase tracking-[0.1em] transition-colors",
                  i === tab
                    ? "bg-grad-pill font-semibold text-ink-deep"
                    : "font-medium text-txt-muted hover:text-txt",
                ].join(" ")}
              >
                {g.name}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-txt-label">
            {active.meta}
          </span>
        </div>

        {/* Barras */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-12 gap-y-[22px] px-7 pb-[34px] pt-[30px]">
          {active.items.map((sk) => (
            <div key={sk.name}>
              <div className="mb-[9px] flex items-baseline justify-between">
                <span className="text-sm font-medium text-txt-skill">
                  {sk.name}
                </span>
                <span className="font-mono text-[11px] text-lilac">
                  {sk.pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-[99px] bg-lilac/10">
                <div
                  className="h-full rounded-[99px] bg-grad-skill shadow-skill transition-[width] duration-700 ease-smooth"
                  style={{ width: barsIn ? `${sk.pct}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
