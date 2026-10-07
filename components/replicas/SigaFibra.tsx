"use client";

import { useState } from "react";

/**
 * Réplica da tela de Tráfego do painel Siga Fibra.
 *
 * Reconstrução da interface em DOM real, não captura de tela. O motivo é
 * simples: imagem é raster e borra o texto assim que muda de escala, e texto de
 * interface é justamente o que interessa mostrar aqui. Em HTML a tipografia
 * continua nítida em qualquer zoom, o conteúdo fica selecionável e o gráfico
 * responde ao mouse de verdade.
 *
 * Escrita na largura natural de 1280px. Quem encaixa isso em espaço menor é o
 * ScaledFrame. Os dados abaixo são de exemplo, com a mesma ordem de grandeza da
 * operação real.
 */

const W = 1280;

/* ------------------------------------------------------------------ dados -- */

const SOURCES = [
  { name: "Google Orgânico", value: 1273, color: "#2563eb" },
  { name: "Google Ads", value: 5938, color: "#60a5fa" },
  { name: "Meta Ads", value: 7248, color: "#1d4ed8" },
  { name: "Redes Sociais", value: 14, color: "#10b981" },
  { name: "Acesso Direto", value: 114897, color: "#f97316" },
  { name: "Outros", value: 313, color: "#8b5cf6" },
];

const TOTAL = SOURCES.reduce((s, o) => s + o.value, 0);

const TILES = [
  { label: "Google Orgânico", value: 1273, color: "#2563eb" },
  { label: "Google Ads", value: 5938, color: "#60a5fa" },
  { label: "Meta Ads", value: 7248, color: "#1d4ed8" },
  { label: "TikTok Ads", value: 0, color: "#64748b" },
  { label: "Redes Sociais", value: 14, color: "#10b981" },
  { label: "Acesso Direto", value: 114897, color: "#f97316" },
  { label: "Outros", value: 313, color: "#8b5cf6" },
];

/** Série diária. O pico de 16/09 é o que o tooltip abre no painel real. */
const DAILY = [
  ["07/09", 430], ["08/09", 510], ["09/09", 8120], ["10/09", 11400],
  ["11/09", 19800], ["12/09", 23100], ["13/09", 9850], ["14/09", 4900],
  ["15/09", 9100], ["16/09", 33118], ["17/09", 980], ["18/09", 760],
  ["19/09", 540], ["20/09", 610], ["21/09", 480], ["22/09", 520],
  ["23/09", 575], ["24/09", 640], ["25/09", 590], ["26/09", 505],
  ["27/09", 472], ["28/09", 567], ["29/09", 808], ["30/09", 659],
  ["01/10", 678], ["02/10", 787], ["03/10", 701], ["04/10", 718],
  ["05/10", 802], ["06/10", 673],
] as const;

const PEAK = {
  "16/09": [
    ["Google Orgânico", 31],
    ["Google Ads", 200],
    ["Meta Ads", 3],
    ["TikTok Ads", 0],
    ["Redes Sociais", 0],
    ["Acesso Direto", 32905],
    ["Outros", 7],
  ],
} as Record<string, [string, number][]>;

const HISTORY = [
  { when: "Hoje", date: "06/10/2026", total: 673, tags: [["40 Orgânico", "#2563eb"], ["452 Pago", "#8b5cf6"], ["1 Social", "#10b981"], ["171 Direto", "#f97316"]] },
  { when: "Ontem", date: "05/10/2026", total: 802, tags: [["87 Orgânico", "#2563eb"], ["580 Pago", "#8b5cf6"], ["131 Direto", "#f97316"]] },
  { when: "há 2 dias", date: "04/10/2026", total: 718, tags: [["4 Orgânico", "#2563eb"], ["573 Pago", "#8b5cf6"], ["140 Direto", "#f97316"]] },
  { when: "há 3 dias", date: "03/10/2026", total: 701, tags: [["23 Orgânico", "#2563eb"], ["512 Pago", "#8b5cf6"], ["147 Direto", "#f97316"]] },
  { when: "há 4 dias", date: "02/10/2026", total: 787, tags: [["65 Orgânico", "#2563eb"], ["502 Pago", "#8b5cf6"], ["209 Direto", "#f97316"]] },
  { when: "há 5 dias", date: "01/10/2026", total: 678, tags: [["39 Orgânico", "#2563eb"], ["470 Pago", "#8b5cf6"], ["152 Direto", "#f97316"]] },
] as const;

/**
 * IDs sintéticos de propósito.
 *
 * As capturas originais trazem identificadores reais de campanha das contas de
 * anúncio do cliente. Isso é dado de negócio de terceiro e não entra num site
 * público, então os números abaixo foram gerados só para preservar o formato.
 */
const CAMPAIGNS = [
  ["10040927315008", "meta_ads", "cpc", 6539],
  ["11720834602", "google_ads", "cpc", 2265],
  ["11720834619", "google_ads", "cpc", 1816],
  ["11720834627", "google_ads", "cpc", 1223],
  ["11724500381", "google_ads", "cpc", 591],
  ["10040927452199", "meta_ads", "cpc", 486],
  ["10040927610744", "meta_ads", "cpc", 118],
  ["11724500398", "google_ads", "cpc", 9],
  ["10040927315008", "organic", "paid", 8],
  ["10040927744310", "meta_ads", "cpc", 3],
] as const;

/** Itens da lateral. `d` é o traçado do ícone, num viewBox 14x14. */
const NAV = [
  { label: "Visão Geral", d: "M2.5 2.5h3.5v3.5H2.5zM8 2.5h3.5v3.5H8zM2.5 8h3.5v3.5H2.5zM8 8h3.5v3.5H8z" },
  { label: "Campanha do Mês", d: "M2.5 3.5h9v8h-9zM2.5 6h9M5 2.2v2.2M9 2.2v2.2" },
  { label: "Servidor", d: "M2.5 3h9v3h-9zM2.5 8h9v3h-9z" },
  { label: "Tráfego", d: "M2 10.5l3.5-3.5 2.5 2.5L12 3.5M12 3.5H9M12 3.5v3" },
  { label: "Cliques", d: "M3.5 2.5l7.5 3.8-3.3 1.2-1.2 3.3z" },
  { label: "Edge Requests", d: "M7.8 2L4 7.6h2.8L6.2 12L10 6.4H7.2z" },
  { label: "Análise de IPs", d: "M7 2.2l4 1.5v3.4c0 2.4-4 4.7-4 4.7s-4-2.3-4-4.7V3.7z" },
];

const br = (n: number) => n.toLocaleString("pt-BR");

/* ----------------------------------------------------------------- pedaços -- */

function Card({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#e6e8ec] bg-white p-5 ${className}`}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#1a1f2e]">{title}</h3>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

/** Pizza em conic-gradient: continua vetorial e nítida em qualquer escala. */
function Pie() {
  let acc = 0;
  const stops = SOURCES.map((s) => {
    const from = (acc / TOTAL) * 100;
    acc += s.value;
    const to = (acc / TOTAL) * 100;
    return `${s.color} ${from}% ${to}%`;
  }).join(", ");

  return (
    <div className="flex flex-col items-center">
      <div
        className="h-[150px] w-[150px] rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      />
      <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
        {SOURCES.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-[2px]"
              style={{ background: s.color }}
            />
            <span className="text-[10px] text-[#5b6478]">{s.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Barras por dia. O tooltip é real: segue o mouse e abre a composição do dia. */
function DailyChart() {
  /* Abre já no pico de 16/09, que é a leitura mais interessante da série. */
  const [hover, setHover] = useState<number | null>(
    DAILY.findIndex(([day]) => day === "16/09")
  );
  const max = 34000;
  const ticks = [34000, 25500, 17000, 8500, 0];

  return (
    <div className="relative flex gap-3">
      <div className="flex w-[42px] flex-col justify-between pb-6 pt-1 text-right">
        {ticks.map((t) => (
          <span key={t} className="text-[9px] text-[#a6adbb]">
            {br(t)}
          </span>
        ))}
      </div>

      <div className="relative flex-1">
        <div className="flex h-[170px] items-end gap-[3px]">
          {DAILY.map(([day, value], i) => {
            const on = hover === i;
            const h = Math.max(2, (value / max) * 170);
            return (
              <div
                key={day}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative flex-1 cursor-pointer"
                style={{ height: 170 }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-[2px] transition-colors"
                  style={{
                    height: h,
                    background: on ? "#ea580c" : "#f97316",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-1.5 flex gap-[3px]">
          {DAILY.map(([day]) => (
            <span
              key={day}
              className="flex-1 text-center text-[7.5px] text-[#a6adbb]"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Tooltip ancorado na barra ativa */}
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-[150px] rounded-md border border-[#e6e8ec] bg-white p-2.5 shadow-lg"
            style={{
              left: `${((hover + 0.5) / DAILY.length) * 100}%`,
              transform:
                hover > DAILY.length / 2
                  ? "translateX(-108%)"
                  : "translateX(8%)",
            }}
          >
            <p className="mb-1.5 text-[10px] font-semibold text-[#1a1f2e]">
              {DAILY[hover][0]}
            </p>
            {(PEAK[DAILY[hover][0]] ?? [["Total", DAILY[hover][1]]]).map(
              ([label, v]) => (
                <p
                  key={label}
                  className="flex justify-between gap-3 text-[9px] leading-[1.6] text-[#5b6478]"
                >
                  <span>{label}:</span>
                  <span className="font-medium text-[#1a1f2e]">{br(v)}</span>
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- tela -- */

export default function SigaFibra() {
  return (
    <div
      style={{
        width: W,
        /**
         * Pilha de fonte própria, explícita.
         *
         * Sem isto a réplica herda a Space Grotesk do portfólio e a tela passa
         * a parecer uma seção deste site em vez do produto real. Um painel
         * administrativo usa tipografia de sistema, e é isso que vende a
         * ilusão de estar olhando outro software.
         */
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
      className="flex bg-[#f5f6f8] text-[#1a1f2e] antialiased"
    >
      {/* Barra lateral */}
      <aside className="flex w-[180px] flex-shrink-0 flex-col bg-[#0d0f16] py-5">
        <div className="px-5">
          <div className="text-[17px] font-bold tracking-tight text-white">
            siga<span className="text-[#10b981]">fibra</span>
          </div>
          <div className="mt-0.5 text-[7px] uppercase tracking-[0.18em] text-[#10b981]">
            Painel de controle
          </div>
        </div>

        <div className="mx-3 mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
          <div className="text-[10px] font-medium text-white">
            Todos os sites
          </div>
          <div className="text-[8px] text-[#6b7484]">Soma de tudo</div>
        </div>

        <nav className="mt-4 flex flex-col gap-0.5 px-3">
          {NAV.map((item) => {
            const on = item.label === "Tráfego";
            return (
              <span
                key={item.label}
                className={`flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[10.5px] ${
                  on
                    ? "bg-[#10b981] font-semibold text-white"
                    : "text-[#9aa3b5]"
                }`}
              >
                <svg
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 flex-shrink-0 fill-none"
                  stroke={on ? "#ffffff" : "#6b7484"}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.d} />
                </svg>
                {item.label}
              </span>
            );
          })}
        </nav>

        <span className="mt-auto border-t border-white/[0.07] px-6 pt-4 text-[10.5px] text-[#9aa3b5]">
          Sair
        </span>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 px-6 py-5">
        <header className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[#a6adbb]">
              Analytics
            </p>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight">
              Tráfego
            </h1>
            <p className="mt-0.5 text-[11px] text-[#8b93a7]">
              De onde vêm os visitantes do seu site
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex rounded-md border border-[#e6e8ec] bg-white p-0.5">
              {["Dia", "Semana", "Mês"].map((p) => (
                <span
                  key={p}
                  className={`rounded px-2.5 py-1 text-[10px] ${
                    p === "Dia"
                      ? "bg-[#10b981] font-semibold text-white"
                      : "text-[#5b6478]"
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>
            <span className="rounded-md border border-[#e6e8ec] bg-white px-3 py-[7px] text-[10px] text-[#5b6478]">
              Sem comparação ⌄
            </span>
            <span className="rounded-md border border-[#e6e8ec] bg-white px-3 py-1 text-[10px] text-[#5b6478]">
              <span className="block font-medium text-[#1a1f2e]">
                Últimos 30 dias
              </span>
              <span className="block text-[8.5px]">07/09/2026 - 06/10/2026</span>
            </span>
          </div>
        </header>

        {/* Total */}
        <Card className="mb-3">
          <p className="text-[11px] font-semibold text-[#10b981]">
            ↗ Total de Acessos
          </p>
          <p className="mt-1 text-[32px] font-bold leading-none tracking-tight">
            {br(TOTAL)}
          </p>
          <p className="mt-1.5 text-[9.5px] text-[#a6adbb]">
            07/09/2026 – 06/10/2026 · 30 dias
          </p>
        </Card>

        {/* Sete indicadores */}
        <div className="mb-3 grid grid-cols-7 gap-2">
          {TILES.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-[#e6e8ec] bg-white px-2 py-3 text-center"
            >
              <p className="text-[19px] font-bold leading-none tracking-tight">
                {br(t.value)}
              </p>
              <p
                className="mx-auto mt-1.5 h-[2px] w-5 rounded-full"
                style={{ background: t.color }}
              />
              <p className="mt-1.5 text-[7.5px] font-medium uppercase tracking-[0.07em] text-[#8b93a7]">
                {t.label}
              </p>
            </div>
          ))}
        </div>

        {/* Pizza e detalhamento */}
        <div className="mb-3 grid grid-cols-2 gap-3">
          <Card title="Origens de Tráfego">
            <Pie />
          </Card>

          <Card title="Detalhamento por Origem">
            <div className="flex flex-col gap-1.5">
              {SOURCES.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2.5 rounded-lg border border-[#eef0f3] px-2.5 py-2"
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
                    style={{ background: `${s.color}26` }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: s.color }}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-medium">{s.name}</p>
                    <div className="mt-1 h-[3px] w-full rounded-full bg-[#f0f2f5]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(1.5, (s.value / TOTAL) * 100)}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10.5px] font-semibold">
                    {br(s.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Série diária */}
        <Card title="Acessos por dia" className="mb-3">
          <DailyChart />
        </Card>

        {/* Histórico */}
        <Card
          title="Histórico de Acessos"
          right={
            <span className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[8.5px] font-medium text-[#10b981]">
              30 dias
            </span>
          }
          className="mb-3"
        >
          <div className="flex flex-col gap-1.5">
            {HISTORY.map((h) => (
              <div
                key={h.date}
                className="flex items-center justify-between rounded-lg bg-[#fafbfc] px-3 py-2"
              >
                <div>
                  <p className="text-[10.5px] font-semibold">
                    {h.when}{" "}
                    <span className="font-normal text-[#a6adbb]">{h.date}</span>
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {h.tags.map(([label, color]) => (
                      <span
                        key={label}
                        className="rounded px-1.5 py-[1px] text-[8px] font-medium"
                        style={{ background: `${color}14`, color }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10.5px] font-semibold text-[#10b981]">
                  {br(h.total)} acessos
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Campanhas */}
        <Card title="Campanhas (UTM)">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eef0f3]">
                {["Campanha", "Origem", "Meio", "Acessos"].map((h, i) => (
                  <th
                    key={h}
                    className={`pb-2 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#a6adbb] ${
                      i === 3 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map(([name, origin, medium, hits], i) => (
                <tr key={`${name}-${i}`} className="border-b border-[#f4f5f7]">
                  <td className="py-[7px] font-mono text-[10px]">{name}</td>
                  <td className="py-[7px] font-mono text-[10px] text-[#5b6478]">
                    {origin}
                  </td>
                  <td className="py-[7px] font-mono text-[10px] text-[#5b6478]">
                    {medium}
                  </td>
                  <td className="py-[7px] text-right text-[10px] font-semibold text-[#10b981]">
                    {br(hits)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}

SigaFibra.width = W;
