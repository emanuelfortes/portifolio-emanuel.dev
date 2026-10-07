"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Project } from "@/data/projects";
import BrowserFrame from "./BrowserFrame";
import ScaledFrame from "./ScaledFrame";
import { REPLICAS } from "./replicas";

/**
 * Vitrine de projeto em largura total.
 *
 * Quando existe réplica para o slug, a tela é DOM real: tipografia nítida em
 * qualquer escala, texto selecionável, gráfico respondendo ao mouse. Captura de
 * tela é o caminho de fallback, usado enquanto a réplica daquele projeto não
 * existe, e tem a limitação conhecida de borrar o texto ao escalar.
 *
 * O bloco ocupa a largura inteira do container de propósito. Em grade de três
 * colunas a tela fica com menos de 400px e nenhuma interface é legível nesse
 * tamanho, seja imagem ou DOM.
 */

/** Altura da janela de navegação dentro da moldura. */
const VIEWPORT = 620;

export default function ProjectShowcase({ project }: { project: Project }) {
  const { shot } = project;
  const replica = REPLICAS[project.slug];
  const [open, setOpen] = useState(false);

  return (
    <article className="relative">
      {/* Cabeçalho do projeto */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[620px]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-lilac">
              {project.tag}
            </span>
            <span className="font-mono text-[10px] text-txt-label">
              {project.year}
            </span>
            {replica && (
              <span className="rounded-full border border-lilac/25 bg-lilac/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-lilac-light">
                Interface ao vivo
              </span>
            )}
          </div>

          <h3 className="mt-2.5 text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.03em] text-txt">
            {project.title}
          </h3>
          <p className="mt-2.5 text-[14px] leading-[1.75] text-txt-muted">
            {project.shortDescription}
          </p>
        </div>

        <div className="flex flex-shrink-0 gap-2.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-btn border border-lilac/25 bg-surface-ghost px-4 py-2.5 text-[13px] font-medium text-txt transition-colors hover:border-lilac hover:text-white"
            >
              Abrir o site ↗
            </a>
          )}
          <Link
            href={`/projeto/${project.slug}`}
            className="rounded-btn bg-violet px-4 py-2.5 text-[13px] font-semibold text-white shadow-violet-btn transition-colors hover:bg-violet-hover"
          >
            Ver o caso →
          </Link>
        </div>
      </div>

      {/* A tela */}
      <BrowserFrame label={shot.label} secure={shot.secure} size="lg">
        <div
          className="relative overflow-y-auto overscroll-contain bg-[#0d0a18]"
          style={{ height: VIEWPORT }}
        >
          {replica ? (
            <ScaledFrame width={replica.width}>
              <replica.Component />
            </ScaledFrame>
          ) : (
            <img
              src={shot.full}
              alt={`Interface do projeto ${project.title}`}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              className="block w-full"
            />
          )}
        </div>

        {/* Rodapé da moldura */}
        <div className="flex items-center justify-between border-t border-lilac/[0.14] bg-[rgba(18,14,30,0.9)] px-4 py-2">
          <span className="font-mono text-[10px] text-txt-label">
            {replica?.hint ?? "Role dentro da janela para navegar a página."}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-lilac/30 bg-white/[0.04] px-3 py-1 font-mono text-[10px] text-lilac-light transition-colors hover:border-lilac hover:text-white"
          >
            Tela cheia ⤢
          </button>
        </div>
      </BrowserFrame>

      {open && <Lightbox project={project} onClose={() => setOpen(false)} />}
    </article>
  );
}

/* -------------------------------------------------------------- tela cheia -- */

function Lightbox({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { shot } = project;
  const replica = REPLICAS[project.slug];
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (active !== null) setActive(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /** Leva a captura até o ponto escolhido e abre a nota. */
  const goTo = (index: number) => {
    const next = index === active ? null : index;
    setActive(next);
    const scroller = scrollRef.current;
    const image = imageRef.current;
    if (!scroller || !image || next === null) return;

    const top = (shot.hotspots[index].box[1] / 100) * image.offsetHeight;
    scroller.scrollTo({
      top: Math.max(0, top - scroller.clientHeight * 0.2),
      behavior: "smooth",
    });
  };

  if (!mounted) return null;

  /* Com réplica não há pontos sobrepostos: as coordenadas em porcentagem foram
     medidas sobre a captura e não correspondem ao DOM reconstruído. A versão
     ancorada aos elementos reais vem depois. */
  const showHotspots = !replica && shot.hotspots.length > 0;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Interface do projeto ${project.title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-[rgba(4,3,8,0.9)] p-4 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div className="mx-auto mb-4 flex w-full max-w-[1500px] flex-shrink-0 items-start justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-lilac">
            {project.tag}
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-txt">
            {project.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex-shrink-0 rounded-full border border-lilac/25 bg-white/[0.04] px-4 py-2 font-mono text-[11px] text-txt-muted transition-colors hover:border-lilac hover:text-white"
        >
          Fechar ✕
        </button>
      </div>

      <div
        className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col gap-4 lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <BrowserFrame
          label={shot.label}
          secure={shot.secure}
          size="lg"
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#0d0a18]"
          >
            {replica ? (
              <ScaledFrame width={replica.width}>
                <replica.Component />
              </ScaledFrame>
            ) : (
              <div ref={imageRef} className="relative">
                <img
                  src={shot.full}
                  alt={`Interface completa do projeto ${project.title}`}
                  width={shot.width}
                  height={shot.height}
                  className="block w-full"
                />

                {showHotspots &&
                  shot.hotspots.map((spot, i) => {
                    const [x, y, w, h] = spot.box;
                    const on = active === i;
                    return (
                      <button
                        key={spot.title}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={spot.title}
                        aria-pressed={on}
                        className={`group/spot absolute rounded-lg border-2 transition-all duration-200 ${
                          on
                            ? "border-lilac bg-lilac/15 shadow-[0_0_0_9999px_rgba(4,3,8,0.55)]"
                            : "border-transparent hover:border-lilac/70 hover:bg-lilac/10"
                        }`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${w}%`,
                          height: `${h}%`,
                        }}
                      >
                        <span
                          className={`absolute -top-2.5 left-2 flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] ${
                            on
                              ? "border-lilac bg-lilac text-ink-deep"
                              : "border-lilac/50 bg-[rgba(18,14,30,0.92)] text-lilac-light"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </BrowserFrame>

        <aside className="flex max-h-[32vh] w-full flex-shrink-0 flex-col overflow-y-auto overscroll-contain rounded-xl border border-lilac/[0.14] bg-[rgba(18,14,30,0.75)] p-4 lg:max-h-none lg:w-[320px]">
          {showHotspots ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-txt-label">
                {shot.hotspots.length} decisões de projeto
              </p>
              <ul className="mt-3 space-y-1.5">
                {shot.hotspots.map((spot, i) => {
                  const on = active === i;
                  return (
                    <li key={spot.title}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          on
                            ? "border-lilac/50 bg-lilac/10"
                            : "border-transparent hover:border-lilac/25 hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className="flex items-start gap-2.5">
                          <span
                            className={`mt-px flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                              on
                                ? "bg-lilac text-ink-deep"
                                : "bg-white/[0.07] text-lilac-light"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[13px] font-medium leading-snug text-txt">
                            {spot.title}
                          </span>
                        </span>
                        {on && (
                          <span className="mt-2.5 block pl-[30px] text-[12.5px] leading-[1.65] text-txt-muted">
                            {spot.note}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-txt-label">
                Sobre esta tela
              </p>
              <p className="mt-3 text-[13px] leading-[1.7] text-txt-muted">
                {project.fullDescription}
              </p>
              <ul className="mt-4 space-y-2">
                {project.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lilac" />
                    <span className="text-[12.5px] leading-[1.6] text-txt-muted">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-auto pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-btn border border-lilac/30 bg-surface-ghost px-4 py-2.5 text-center text-[12.5px] font-medium text-txt transition-colors hover:border-lilac hover:text-white"
              >
                Abrir o site real ↗
              </a>
            )}
            <Link
              href={`/projeto/${project.slug}`}
              className="mt-2 block rounded-btn bg-violet px-4 py-2.5 text-center text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-hover"
            >
              Ver o caso completo →
            </Link>
          </div>
        </aside>
      </div>
    </div>,
    document.body
  );
}
