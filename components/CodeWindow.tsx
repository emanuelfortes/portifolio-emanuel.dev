"use client";

import { useEffect, useRef, useState } from "react";

/* Classes de cor da sintaxe */
const kw = "text-violet"; // palavras-chave
const str = "text-lilac-light"; // strings
const ident = "text-lilac-lighter"; // nomes/identificadores
const num = "text-lilac"; // números e booleanos
const cmt = "text-txt-comment"; // comentário

type Token = { t: string; c?: string };

/** Conteúdo de dev.config.ts, quebrado em tokens para colorir enquanto digita. */
const CODE: Token[] = [
  { t: "import", c: kw },
  { t: " { Fortes } " },
  { t: "from", c: kw },
  { t: " " },
  { t: "'@dev/emanuel'", c: str },
  { t: ";\n\n" },
  { t: "const", c: kw },
  { t: " dev = " },
  { t: "new", c: kw },
  { t: " " },
  { t: "Fortes", c: ident },
  { t: "({\n  stack: [" },
  { t: "'React'", c: str },
  { t: ", " },
  { t: "'Next.js'", c: str },
  { t: ", " },
  { t: "'Node'", c: str },
  { t: "],\n  database: [" },
  { t: "'PostgreSQL'", c: str },
  { t: ", " },
  { t: "'MySQL'", c: str },
  { t: "],\n  mindset: " },
  { t: "'produto'", c: str },
  { t: ",\n  retrabalho: " },
  { t: "0", c: num },
  { t: ",\n  entrega: " },
  { t: "true", c: num },
  { t: ",\n});\n\ndev." },
  { t: "construir", c: ident },
  { t: "(" },
  { t: "'ponta a ponta'", c: str },
  { t: "); " },
  { t: "// ✓", c: cmt },
];

const TOTAL = CODE.reduce((n, tk) => n + tk.t.length, 0);
const CHARS_PER_SEC = 57; // 40% mais lento que os 95 iniciais
const START_DELAY = 650; // deixa a janela terminar o riseIn antes de digitar

/** Devolve os tokens cortados até `count` caracteres. */
function slice(count: number): Token[] {
  const out: Token[] = [];
  let left = count;
  for (const tk of CODE) {
    if (left <= 0) break;
    out.push(left >= tk.t.length ? tk : { ...tk, t: tk.t.slice(0, left) });
    left -= tk.t.length;
  }
  return out;
}

const render = (tokens: Token[]) =>
  tokens.map((tk, i) =>
    tk.c ? (
      <span key={i} className={tk.c}>
        {tk.t}
      </span>
    ) : (
      <span key={i}>{tk.t}</span>
    )
  );

const chips = ["react", "node", "postgres", "prisma"];

export default function CodeWindow() {
  const [count, setCount] = useState(0);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Sem animação para quem prefere menos movimento
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(TOTAL);
      return;
    }

    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const n = Math.min(TOTAL, Math.round(((now - start) / 1000) * CHARS_PER_SEC));
      setCount(n);
      if (n < TOTAL) rafRef.current = requestAnimationFrame(step);
    };

    timerRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, START_DELAY);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const done = count >= TOTAL;

  return (
    <div className="animate-rise-in-window rise-delay-window overflow-hidden rounded-window border border-lilac/20 bg-surface-code shadow-window backdrop-blur-[16px]">
      {/* Barra de título */}
      <div className="flex items-center justify-between border-b border-lilac/[0.12] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-lilac/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-lilac/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-lilac/25" />
        </div>
        <span className="rounded-md bg-[rgba(124,92,255,0.1)] px-3 py-1 font-mono text-[10.5px] text-txt-muted">
          dev.config.ts
        </span>
      </div>

      {/*
        Grid de uma célula só: a cópia completa (invisível) reserva a altura
        final, então a janela não "cresce" enquanto o texto é digitado.
      */}
      <pre className="grid overflow-x-auto px-6 py-[22px] font-mono text-[12.5px] leading-[1.85] text-txt-secondary">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {render(CODE)}
        </span>
        <span className="col-start-1 row-start-1">
          {render(slice(count))}
          <span
            className={`ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-lilac ${
              done ? "animate-caret" : ""
            }`}
          />
        </span>
      </pre>

      {/* Rodapé com chips da stack */}
      <div className="flex gap-2 border-t border-lilac/[0.12] px-4 py-3 font-mono text-[10px] text-txt-label">
        {chips.map((chip, i) => (
          <span
            key={chip}
            className={`rounded-[5px] bg-[rgba(124,92,255,0.12)] px-2.5 py-[3px] ${
              i === 0 ? "text-lilac-light" : ""
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
