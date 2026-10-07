"use client";

import { useState } from "react";

/**
 * Réplica da home do site do Dr. Érico Diógenes.
 *
 * Diferente dos dois painéis, aqui o conteúdo é majoritariamente editorial e
 * fotográfico. A regra que seguimos: tudo que é texto, estrutura e interação
 * vira DOM, porque precisa continuar nítido e legível. Fotografia continua
 * sendo imagem, porque foto é raster por natureza e nada se ganha tentando
 * desenhá-la em CSS.
 *
 * As fotos vêm do próprio projeto, reotimizadas para 720px de largura. O
 * acordeão do FAQ é interativo de verdade.
 */

const W = 1280;

const NAV = [
  "Início",
  "Dr. Érico Diógenes",
  "Tratamentos",
  "HoLEP",
  "Cirurgia Robótica",
  "Blog",
  "Vídeos",
  "Contato",
];

const TRATAMENTOS = [
  { t: "Check-Up Urológico", itens: ["Urologia Geral de Fortaleza", "Consulta Urológica Preventiva", "Condutas Urológicas"], img: "foto-1" },
  { t: "Tratamento a Laser HoLEP para Próstata", itens: ["Próstata Aumentada", "Hiperplasia Prostática Benigna (HPB)", "Laser de Hólmio", "HoLEP"], img: "foto-5b" },
  { t: "Cirurgia Robótica e Urologia", itens: ["Cirurgia Robótica Urológica", "Prostatectomia Radical", "Cirurgia Minimamente Invasiva"], img: "foto-2" },
  { t: "Cálculos Urinários", itens: ["Cálculo Renal", "Pedra nos Rins", "Litotripsia", "Ureteroscopia"], img: "foto-3" },
  { t: "Uro-Oncologia", itens: ["Câncer de Próstata", "Câncer de Rim", "Câncer de Bexiga", "Câncer de Testículo"], img: "foto-6" },
  { t: "Andrologia e Saúde Sexual Masculina", itens: ["Disfunção Erétil", "Ejaculação Precoce", "Infertilidade Masculina", "Reposição Hormonal"], img: "foto-7" },
  { t: "Bexiga e Trato Urinário", itens: ["Bexiga Hiperativa", "Incontinência Urinária", "Infecção Urinária"], img: "foto-4" },
  { t: "Exames Urológicos", itens: ["Ultrassonografia", "Urofluxometria", "Biópsia de Próstata", "Cistoscopia"], img: "foto-5" },
  { t: "Cirurgias Urológicas", itens: ["Vasectomia", "Postectomia", "Correção de Varicocele", "Cirurgia de Hidrocele"], img: "foto-2" },
];

const DEPOIMENTOS = [
  { autor: "Odnan Feitosa", texto: "Excelente profissional, muito atencioso e competente. Explicou todo o procedimento com clareza e me deixou tranquilo do início ao fim do tratamento." },
  { autor: "Hyan Pereira da Silva", texto: "Atendimento humanizado de verdade. O doutor tirou todas as minhas dúvidas sem pressa e o resultado da cirurgia superou a expectativa." },
  { autor: "José Oliveira", texto: "Profissional de altíssimo nível. Recomendo a todos que precisam de um urologista de confiança em Fortaleza." },
  { autor: "Reinaldo Pereira", texto: "Fui muito bem atendido desde a recepção. O Dr. Érico é direto, explica o diagnóstico de forma simples e passa muita segurança." },
  { autor: "Suzanne Grangeiro", texto: "Levei meu pai para consulta e fomos muito bem recebidos. Atendimento pontual e um cuidado raro de se encontrar hoje em dia." },
];

const FAQ = [
  "O que faz um urologista?",
  "Quais sintomas são urológicos?",
  "Quando devo procurar um urologista?",
  "Com que frequência devo ir ao urologista?",
  "A partir de que idade o homem deve procurar o urologista?",
  "Qual a diferença entre andrologista e urologista?",
  "Como saber se o urologista é especialista?",
];

const FAQ_RESPOSTA =
  "O urologista é o médico responsável pelo trato urinário de homens e mulheres e pelo sistema reprodutor masculino. Ele cuida de rins, ureteres, bexiga, uretra, próstata, testículos e pênis, tratando desde infecções urinárias e cálculo renal até câncer de próstata, disfunção erétil e infertilidade masculina.";

const UNIDADES = [
  { nome: "Hólos Clinic Lab", bairro: "Fortaleza, CE" },
  { nome: "Prontoclinic Fortaleza", bairro: "Fortaleza, CE" },
  { nome: "Uni Medical Office", bairro: "Fortaleza, CE" },
];

const NAVY = "#0e2144";
const CREAM = "#f7f3ea";
const GOLD = "#b99a5b";

/* ------------------------------------------------------------------ tela -- */

export default function DrErico() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div
      style={{
        width: W,
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
      className="bg-white text-[#1a2744] antialiased"
    >
      {/* Faixa superior */}
      <div
        className="px-8 py-[5px] text-center text-[8px] text-white/70"
        style={{ background: "#0a1830" }}
      >
        Urologista em Fortaleza, cirurgia robótica e tratamento a laser para
        próstata. Agende sua consulta.
      </div>

      {/* Navegação */}
      <header
        className="flex items-center justify-between px-8 py-3"
        style={{ background: NAVY }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold text-white"
            style={{ borderColor: GOLD }}
          >
            D
          </span>
          <span className="leading-tight text-white">
            <span className="block text-[9.5px] font-semibold tracking-[0.12em]">
              ÉRICO
            </span>
            <span className="block text-[7px] tracking-[0.2em] text-white/60">
              DIÓGENES
            </span>
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {NAV.map((n) => (
            <span
              key={n}
              className={`text-[9.5px] ${
                n === "Início" ? "text-white" : "text-white/70"
              }`}
            >
              {n}
            </span>
          ))}
          <span className="rounded-full bg-[#2bb673] px-3 py-1.5 text-[9px] font-semibold text-white">
            Agendar consulta
          </span>
        </nav>
      </header>

      {/* Herói */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        <img
          src="/shots/erico/foto-1.webp"
          alt=""
          className="absolute right-0 top-0 h-full w-[52%] object-cover opacity-80"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${NAVY} 42%, rgba(14,33,68,0.75) 58%, rgba(14,33,68,0.25))`,
          }}
        />
        <div className="relative max-w-[560px] px-8 py-14">
          <h1 className="text-[27px] font-semibold leading-[1.18] tracking-[-0.02em] text-white">
            Urologista em Fortaleza com atuação em próstata, câncer e cirurgia
            robótica.
          </h1>
          <p className="mt-4 text-[10.5px] leading-[1.75] text-white/70">
            Dr. Érico Diógenes é urologista em Fortaleza, com atuação em
            cirurgia robótica, tratamento a laser para próstata e urologia
            oncológica, unindo tecnologia avançada e cuidado humanizado.
          </p>
          <span className="mt-6 inline-block rounded-full border border-white/35 px-5 py-2 text-[9.5px] font-medium text-white">
            Saiba mais
          </span>
        </div>
      </section>

      {/* Cirurgia robótica */}
      <section className="px-8 py-12 text-center" style={{ background: CREAM }}>
        <p
          className="text-[8px] uppercase tracking-[0.22em]"
          style={{ color: GOLD }}
        >
          Conheça
        </p>
        <h2 className="mx-auto mt-3 max-w-[620px] text-[21px] font-semibold leading-[1.3] tracking-[-0.02em]">
          Cirurgia Robótica,{" "}
          <span style={{ color: GOLD }}>
            o método mais eficaz para câncer de próstata, rins e bexiga.
          </span>
        </h2>

        <div className="mx-auto mt-9 flex max-w-[860px] items-center gap-8 text-left">
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold">
              Cuidado revolucionário{" "}
              <span style={{ color: GOLD }}>com a saúde masculina</span>
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                "Alta precisão na remoção do problema",
                "Menor dor e desconforto no pós-operatório",
                "Retorno mais rápido às atividades normais",
                "Menor risco de obstrução ou sangramento",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="mt-[3px] flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-[7px] text-white"
                    style={{ background: GOLD }}
                  >
                    ✓
                  </span>
                  <span className="text-[10px] leading-[1.6] text-[#4a5568]">
                    {i}
                  </span>
                </li>
              ))}
            </ul>
            <span
              className="mt-5 inline-block rounded-full px-5 py-2 text-[9.5px] font-semibold text-white"
              style={{ background: NAVY }}
            >
              Saiba mais
            </span>
          </div>
          <img
            src="/shots/erico/foto-5b.webp"
            alt=""
            className="h-[170px] w-[290px] flex-shrink-0 rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Tratamentos */}
      <section className="px-8 py-12">
        <p className="text-center text-[8px] uppercase tracking-[0.22em] text-[#9aa5b8]">
          Conheça nossos
        </p>
        <h2 className="mt-2 text-center text-[21px] font-semibold tracking-[-0.02em]">
          Tratamentos
        </h2>

        <div className="mt-7 grid grid-cols-3 gap-4">
          {TRATAMENTOS.map((t) => (
            <article
              key={t.t}
              className="overflow-hidden rounded-lg border border-[#e8eaef] bg-white"
            >
              <div className="relative h-[92px] overflow-hidden">
                <img
                  src={`/shots/erico/${t.img}.webp`}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(14,33,68,0.15), rgba(14,33,68,0.55))",
                  }}
                />
              </div>
              <div className="p-3.5">
                <h3 className="text-[10.5px] font-semibold leading-snug">
                  {t.t}
                </h3>
                <ul className="mt-2 flex flex-col gap-[3px]">
                  {t.itens.map((i) => (
                    <li key={i} className="text-[8.5px] text-[#7b8699]">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Faixa HoLEP */}
      <section
        className="flex items-center gap-8 px-8 py-11"
        style={{ background: NAVY }}
      >
        <img
          src="/shots/erico/foto-3.webp"
          alt=""
          className="h-[150px] w-[260px] flex-shrink-0 rounded-lg object-cover"
        />
        <div>
          <h2 className="max-w-[540px] text-[16px] font-semibold leading-[1.35] text-white">
            Tratamento a laser para próstata em Fortaleza:{" "}
            <span style={{ color: GOLD }}>
              o mais avançado para Hiperplasia Prostática Benigna (HPB)
            </span>
          </h2>
          <span className="mt-4 inline-block rounded-full border border-white/35 px-5 py-2 text-[9.5px] text-white">
            Saiba mais
          </span>
        </div>
      </section>

      {/* Sobre */}
      <section
        className="flex items-center gap-9 px-8 py-12"
        style={{ background: CREAM }}
      >
        <img
          src="/shots/erico/foto-4.webp"
          alt="Dr. Érico Diógenes"
          className="h-[210px] w-[165px] flex-shrink-0 rounded-lg object-cover"
        />
        <div className="max-w-[560px]">
          <p
            className="text-[8px] uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
          >
            Sobre
          </p>
          <h2 className="mt-2 text-[21px] font-semibold tracking-[-0.02em]">
            Conheça o <span style={{ color: GOLD }}>Dr. Érico Diógenes</span>
          </h2>
          <p className="mt-3.5 text-[10px] leading-[1.8] text-[#5a6678]">
            Referência em cirurgia robótica, tratamento a laser e condutas
            avançadas para a saúde masculina. Membro titular da Sociedade
            Brasileira de Urologia, com atuação em hospitais de referência em
            Fortaleza, une tecnologia de ponta a um atendimento humanizado para
            garantir mais segurança, conforto e resultado a cada paciente.
          </p>
          <span
            className="mt-5 inline-block rounded-full px-5 py-2 text-[9.5px] font-semibold text-white"
            style={{ background: NAVY }}
          >
            Conheça
          </span>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="px-8 py-12">
        <p className="text-center text-[8px] uppercase tracking-[0.22em] text-[#9aa5b8]">
          Quem já passou por aqui
        </p>
        <h2 className="mt-2 text-center text-[21px] font-semibold tracking-[-0.02em]">
          O que os pacientes dizem
        </h2>
        <p className="mt-2 text-center text-[9px] text-[#9aa5b8]">
          Avaliações publicadas por pacientes no perfil do Google do Dr. Érico
          Diógenes
        </p>

        <div className="mt-7 grid grid-cols-5 gap-3">
          {DEPOIMENTOS.map((d) => (
            <article
              key={d.autor}
              className="rounded-lg border border-[#e8eaef] bg-white p-3.5"
            >
              <div className="flex gap-[2px]" style={{ color: "#f5a623" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-[9px]">
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[8.5px] leading-[1.7] text-[#5a6678]">
                {d.texto}
              </p>
              <p className="mt-3 text-[8.5px] font-semibold">{d.autor}</p>
              <p className="text-[7.5px] text-[#9aa5b8]">Google · há 2 meses</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ interativo */}
      <section className="px-8 py-12" style={{ background: CREAM }}>
        <p className="text-center text-[8px] uppercase tracking-[0.22em] text-[#9aa5b8]">
          Dúvidas frequentes
        </p>
        <h2 className="mt-2 text-center text-[20px] font-semibold uppercase tracking-[0.06em]">
          Urologista em Fortaleza
        </h2>
        <p className="mt-2 text-center text-[9px] text-[#9aa5b8]">
          O que o especialista trata, quando procurar e onde encontrar
          atendimento na capital
        </p>

        <div className="mx-auto mt-7 flex max-w-[760px] flex-col gap-2">
          {FAQ.map((q, i) => {
            const on = faqOpen === i;
            return (
              <div
                key={q}
                className="overflow-hidden rounded-lg border border-[#e3ddd0] bg-white"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(on ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                >
                  <span className="text-[10px] font-medium">{q}</span>
                  <span
                    className="flex-shrink-0 text-[11px] transition-transform"
                    style={{
                      color: GOLD,
                      transform: on ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                {on && (
                  <p className="border-t border-[#f0ece2] px-4 py-3 text-[9.5px] leading-[1.8] text-[#5a6678]">
                    {FAQ_RESPOSTA}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Chamada final */}
      <section className="px-8 py-10">
        <div
          className="flex items-center justify-between rounded-xl px-8 py-7"
          style={{ background: NAVY }}
        >
          <h2 className="max-w-[520px] text-[15px] font-semibold leading-snug text-white">
            Marque agora sua consulta com o Dr. Érico Diógenes
          </h2>
          <span className="rounded-full bg-[#2bb673] px-5 py-2.5 text-[9.5px] font-semibold text-white">
            Agendar no WhatsApp
          </span>
        </div>
      </section>

      {/* Unidades */}
      <section className="px-8 pb-12">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
          Onde nos encontrar
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {UNIDADES.map((u) => (
            <div
              key={u.nome}
              className="rounded-lg border border-[#e8eaef] p-4"
              style={{ background: CREAM }}
            >
              <p className="text-[10.5px] font-semibold">{u.nome}</p>
              <p className="mt-1.5 text-[8.5px] leading-[1.6] text-[#7b8699]">
                {u.bairro}
              </p>
              <p className="mt-2 text-[8.5px] font-medium" style={{ color: GOLD }}>
                Ver no mapa →
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Rodapé */}
      <footer
        className="flex items-start justify-between px-8 py-8"
        style={{ background: "#0a1830" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold text-white"
            style={{ borderColor: GOLD }}
          >
            D
          </span>
          <span className="text-[9.5px] font-semibold tracking-[0.12em] text-white">
            ÉRICO DIÓGENES
          </span>
        </div>
        {[
          { t: "Links Úteis", l: ["Início", "Tratamentos", "Blog", "Contato"] },
          { t: "Especialidades", l: ["Cirurgia Robótica", "HoLEP", "Uro-Oncologia"] },
          { t: "Atendimento", l: ["Agendar consulta", "Unidades", "WhatsApp"] },
        ].map((c) => (
          <div key={c.t}>
            <p className="text-[8.5px] font-semibold text-white">{c.t}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {c.l.map((i) => (
                <li key={i} className="text-[8px] text-white/55">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
    </div>
  );
}

DrErico.width = W;
