"use client";

import { useState } from "react";

/**
 * Réplica da tela de Cursos do painel administrativo do LexCursos.
 *
 * Reconstrução em DOM real, pelos mesmos motivos do SigaFibra: texto de
 * interface precisa continuar nítido em qualquer escala, e aqui há muita
 * informação pequena (etiquetas de estado, contagem de aulas, ações por linha)
 * que uma captura reduzida apagaria.
 *
 * A expansão de módulo é interativa de verdade. Dados de exemplo.
 */

const W = 1280;

/* ------------------------------------------------------------------ dados -- */

const NAV_MAIN = [
  { label: "Dashboard", d: "M2.5 2.5h3.5v3.5H2.5zM8 2.5h3.5v3.5H8zM2.5 8h3.5v3.5H2.5zM8 8h3.5v3.5H8z" },
];

const NAV_GESTAO = [
  { label: "Usuários", d: "M7 7a2.2 2.2 0 100-4.4A2.2 2.2 0 007 7zM2.8 12c0-2.3 1.9-3.6 4.2-3.6s4.2 1.3 4.2 3.6" },
  { label: "Produtos", d: "M2.5 4.5L7 2.3l4.5 2.2v5L7 11.7 2.5 9.5zM2.5 4.5L7 6.7l4.5-2.2M7 6.7v5" },
  { label: "Cursos", d: "M2.5 3.2h4c.8 0 1.5.6 1.5 1.4v6.2c0-.6-.6-1.1-1.3-1.1H2.5zM11.5 3.2h-4c-.8 0-1.5.6-1.5 1.4v6.2c0-.6.6-1.1 1.3-1.1h4.2z" },
  { label: "Pedidos", d: "M2.3 2.8h1.6l1.3 6.4h5.5M5.2 11.4a.8.8 0 100-1.6.8.8 0 000 1.6zM10 11.4a.8.8 0 100-1.6.8.8 0 000 1.6zM4.6 5h7l-.7 3.2h-5.7" },
  { label: "Financeiro", d: "M7 1.8v10.4M9.4 3.9H5.8a1.7 1.7 0 000 3.4h2.4a1.7 1.7 0 010 3.4H4.3" },
  { label: "Analytics", d: "M2.5 11.5V7M6 11.5V3.4M9.5 11.5V8.4" },
];

const NAV_SISTEMA = [
  { label: "Integrações", d: "M5.6 8.4L2.9 11a1.9 1.9 0 102.7 2.7M8.4 5.6L11 2.9M4.8 4.8l4.4 4.4" },
  { label: "Logs", d: "M3.2 2.3h5.3l2.3 2.3v7.1H3.2zM8.5 2.3v2.3h2.3M5 7.5h4M5 9.5h3" },
  { label: "Configurações", d: "M7 8.6a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM7 1.9v1.3M7 10.8v1.3M11.4 7h-1.3M3.9 7H2.6M10.1 3.9l-.9.9M4.8 9.2l-.9.9M10.1 10.1l-.9-.9M4.8 4.8l-.9-.9" },
];

type Modulo = {
  badge: string;
  badgeTone: "dark" | "orange";
  title: string;
  prof?: string;
  state: "Publicado" | "Rascunho";
  aulas: number;
  bulk?: boolean;
  lessons?: { n: number; title: string; free?: boolean }[];
};

const MODULOS: Modulo[] = [
  { badge: "EC", badgeTone: "dark", title: "Língua Portuguesa Aulas", prof: "Prof. Eli", state: "Publicado", aulas: 0 },
  { badge: "RN", badgeTone: "orange", title: "Língua Portuguesa PDFs", prof: "Prof. Riccardo", state: "Publicado", aulas: 3, bulk: true },
  { badge: "03", badgeTone: "dark", title: "Raciocínio Lógico Matemático Aulas", state: "Publicado", aulas: 0 },
  { badge: "RN", badgeTone: "orange", title: "Raciocínio Lógico Matemático PDFs", prof: "Prof. Riccardo", state: "Publicado", aulas: 3, bulk: true },
  { badge: "TC", badgeTone: "dark", title: "Informática Aulas", prof: "Prof. Thiago", state: "Publicado", aulas: 0 },
  { badge: "RN", badgeTone: "orange", title: "Informática PDFs", prof: "Prof. Riccardo", state: "Publicado", aulas: 3, bulk: true },
  { badge: "07", badgeTone: "dark", title: "Conhecimentos Fortaleza Aulas", state: "Rascunho", aulas: 0 },
  { badge: "RN", badgeTone: "orange", title: "Conhecimentos Fortaleza PDFs", prof: "Prof. Riccardo", state: "Publicado", aulas: 3, bulk: true },
  { badge: "RN", badgeTone: "orange", title: "Direito Penal Aulas", prof: "Prof. Riccardo", state: "Publicado", aulas: 0 },
  { badge: "AO", badgeTone: "dark", title: "Direito Constitucional Aulas", prof: "Prof. Aldeido", state: "Publicado", aulas: 0 },
  {
    badge: "RN", badgeTone: "orange", title: "Direito Administrativo PDFs",
    prof: "Prof. Riccardo", state: "Publicado", aulas: 3, bulk: true,
    lessons: [
      { n: 1, title: "Estado e Administração Pública", free: true },
      { n: 2, title: "Princípios e Poderes Administrativos" },
      { n: 3, title: "Atos Administrativos" },
    ],
  },
  { badge: "GS", badgeTone: "dark", title: "Direito Processual Penal Aulas", prof: "Prof. Gabriel", state: "Publicado", aulas: 0 },
  { badge: "19", badgeTone: "dark", title: "Leis Municipais Aulas", state: "Publicado", aulas: 0 },
];

/* ---------------------------------------------------------------- pedaços -- */

function Icon({ d, color = "#8a8578" }: { d: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="h-3.5 w-3.5 flex-shrink-0 fill-none"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

/** Ações por linha: subir, descer, ocultar, editar, reordenar. */
function RowActions() {
  const acts = [
    "M7 11V3M7 3L4 6M7 3l3 3",
    "M7 3v8M7 11l-3-3M7 11l3-3",
    "M1.8 7S3.9 3.2 7 3.2 12.2 7 12.2 7 10.1 10.8 7 10.8 1.8 7 1.8 7zM2 2l10 10",
    "M9.4 2.4l2.2 2.2-7 7H2.4V9.4z",
    "M11.3 6.2A4.4 4.4 0 103 7M11.3 3v3.2H8.1",
  ];
  return (
    <div className="flex items-center gap-2.5">
      {acts.map((d, i) => (
        <Icon key={i} d={d} color={i === 4 ? "#e07a5f" : "#9d978a"} />
      ))}
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "gray" | "orange";
}) {
  const tones = {
    green: "bg-[#dcfce7] text-[#15803d]",
    gray: "bg-[#f1efea] text-[#78716c]",
    orange: "bg-[#ffedd5] text-[#c2410c]",
  };
  return (
    <span
      className={`rounded px-1.5 py-[2px] text-[8.5px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- tela -- */

export default function LexCursos() {
  /* O módulo que começa aberto é o mesmo da captura de referência. */
  const [openIndex, setOpenIndex] = useState<number | null>(10);

  return (
    <div
      style={{
        width: W,
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
      className="flex bg-[#fdfcfa] text-[#292524] antialiased"
    >
      {/* Lateral */}
      <aside className="flex w-[165px] flex-shrink-0 flex-col border-r border-[#eae7e0] bg-white py-4">
        <div className="flex items-center gap-2 px-4">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1c1917] text-[8px] font-bold text-[#f97316]">
            LEX
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a8a29e]">
            Admin
          </span>
        </div>

        <nav className="mt-4 flex flex-col px-2.5">
          {NAV_MAIN.map((i) => (
            <span
              key={i.label}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-[6px] text-[10.5px] text-[#57534e]"
            >
              <Icon d={i.d} />
              {i.label}
            </span>
          ))}

          <p className="mb-1 mt-3.5 px-2.5 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-[#b8b2a7]">
            Gestão
          </p>
          {NAV_GESTAO.map((i) => {
            const on = i.label === "Cursos";
            return (
              <span
                key={i.label}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-[6px] text-[10.5px] ${
                  on
                    ? "bg-[#fff2e8] font-semibold text-[#c2410c]"
                    : "text-[#57534e]"
                }`}
              >
                <Icon d={i.d} color={on ? "#ea580c" : "#8a8578"} />
                {i.label}
              </span>
            );
          })}

          <p className="mb-1 mt-3.5 px-2.5 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-[#b8b2a7]">
            Sistema
          </p>
          {NAV_SISTEMA.map((i) => (
            <span
              key={i.label}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-[6px] text-[10.5px] text-[#57534e]"
            >
              <Icon d={i.d} />
              {i.label}
            </span>
          ))}
        </nav>

        <span className="mt-8 flex items-center gap-2 px-4 text-[10px] text-[#a8a29e]">
          ‹ Recolher
        </span>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1">
        {/* Topo */}
        <div className="flex items-center justify-between border-b border-[#eae7e0] bg-white px-5 py-2.5">
          <div className="flex w-[250px] items-center justify-between rounded-md border border-[#eae7e0] px-2.5 py-1.5">
            <span className="flex items-center gap-2 text-[10px] text-[#a8a29e]">
              <Icon d="M6.3 10.3a4 4 0 100-8 4 4 0 000 8zM11.5 11.5L9.2 9.2" color="#a8a29e" />
              Buscar...
            </span>
            <span className="rounded border border-[#eae7e0] bg-[#faf9f7] px-1 text-[8px] text-[#a8a29e]">
              ⌘K
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <Icon d="M11.3 8.2A4.6 4.6 0 015.8 2.7 4.6 4.6 0 107 11.5c1.8 0 3.4-1.1 4.3-3.3z" color="#78716c" />
            <Icon d="M7 2.3a3.3 3.3 0 00-3.3 3.3c0 3.8-1.4 4.9-1.4 4.9h9.4s-1.4-1.1-1.4-4.9A3.3 3.3 0 007 2.3zM8 12.2a1.2 1.2 0 01-2 0" color="#78716c" />
            <span className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded bg-[#1c1917] text-center text-[8px] font-bold leading-5 text-[#f97316]">
                L
              </span>
              <span className="text-[10px] font-medium">Lex</span>
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          {/* Cabeçalho */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-[19px] font-bold tracking-tight">Cursos</h1>
              <p className="mt-0.5 text-[10.5px] text-[#a8a29e]">
                1 curso cadastrado
              </p>
            </div>
            <span className="rounded-md bg-[#ea580c] px-3 py-2 text-[10.5px] font-semibold text-white">
              + Novo curso
            </span>
          </div>

          {/* Card do curso */}
          <div className="rounded-xl border border-[#eae7e0] bg-white">
            <div className="flex items-center gap-3 border-b border-[#f1efea] p-3.5">
              <span className="text-[11px] text-[#a8a29e]">⌄</span>
              <span className="flex h-10 w-[58px] flex-shrink-0 items-center justify-center rounded bg-[#1c1917] text-[9px] font-bold text-[#f97316]">
                LEX
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold">
                  Guarda Municipal Fortaleza
                </p>
                <p className="mt-1 flex gap-3 text-[9.5px] text-[#a8a29e]">
                  <span>21 aulas</span>
                  <span>0m 00s</span>
                  <span>0 alunos</span>
                  <span>R$ 277,00</span>
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <Badge tone="green">Publicado</Badge>
                <span className="rounded-md border border-[#eae7e0] px-2.5 py-1.5 text-[9.5px] font-medium">
                  Editar
                </span>
                <span className="rounded-md border border-[#eae7e0] px-2.5 py-1.5 text-[9.5px] font-medium">
                  Despublicar
                </span>
                <Icon d="M2.8 3.7h8.4M5.6 3.7V2.6h2.8v1.1M3.7 3.7l.5 7.7h5.6l.5-7.7" color="#dc2626" />
              </div>
            </div>

            {/* Barra de módulos */}
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="text-[10.5px] text-[#78716c]">21 módulos</span>
              <div className="flex gap-2">
                {["Assistir (preview)", "Usar módulo existente", "+ Novo módulo"].map(
                  (b) => (
                    <span
                      key={b}
                      className="rounded-md border border-[#eae7e0] px-2.5 py-1.5 text-[9.5px] font-medium text-[#44403c]"
                    >
                      {b}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Lista de módulos */}
            <div className="flex flex-col gap-1.5 px-3.5 pb-3.5">
              {MODULOS.map((m, i) => {
                const open = openIndex === i && m.lessons;
                return (
                  <div
                    key={`${m.title}-${i}`}
                    className="rounded-lg border border-[#f1efea] bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        m.lessons && setOpenIndex(open ? null : i)
                      }
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left ${
                        m.lessons ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span className="w-2 text-[10px] text-[#c4bfb5]">
                        {open ? "⌄" : "›"}
                      </span>
                      <span
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-[9px] font-bold ${
                          m.badgeTone === "orange"
                            ? "bg-[#1c1917] text-[#f97316]"
                            : "bg-[#1c1917] text-white"
                        }`}
                      >
                        {m.badge}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold">{m.title}</p>
                        <p className="mt-1 flex items-center gap-1.5">
                          {m.prof && <Badge tone="orange">{m.prof}</Badge>}
                          <Badge tone={m.state === "Publicado" ? "green" : "gray"}>
                            {m.state}
                          </Badge>
                          <span className="text-[9px] text-[#a8a29e]">
                            {m.aulas} aulas
                          </span>
                          {m.bulk && (
                            <span className="rounded border border-[#eae7e0] px-1.5 py-[1px] text-[8.5px] text-[#57534e]">
                              Despublicar tudo
                            </span>
                          )}
                        </p>
                      </div>
                      <RowActions />
                    </button>

                    {open && (
                      <div className="border-t border-[#f5f3ef] px-3 pb-2">
                        {m.lessons!.map((l) => (
                          <div
                            key={l.n}
                            className="flex items-center gap-2.5 border-b border-[#faf9f7] py-2 last:border-0"
                          >
                            <Icon d="M3.2 2.3h5.3l2.3 2.3v7.1H3.2zM8.5 2.3v2.3h2.3" color="#ea580c" />
                            <span className="flex-1 text-[10.5px]">
                              {l.n} {l.title}
                            </span>
                            {l.free && <Badge tone="gray">Grátis</Badge>}
                            <Badge tone="green">Publicada</Badge>
                            <RowActions />
                          </div>
                        ))}
                        <p className="py-2 text-[10px] font-medium text-[#a8a29e]">
                          + Adicionar aula
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

LexCursos.width = W;
