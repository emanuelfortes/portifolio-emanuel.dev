"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Project } from "@/data/projects";

/**
 * Aparelho com a réplica do projeto rodando dentro.
 *
 * A tela é um iframe apontando para /demo/<projeto>, uma cópia navegável do
 * sistema construída dentro deste site. No card ela aparece miniaturizada e
 * inerte; ao clicar, a tela sai do aparelho e cresce até ocupar a janela, onde
 * o visitante navega de verdade.
 *
 * O aparelho acompanha quem está vendo. No computador é um monitor com a
 * versão desktop do site; no celular é um iPhone com a versão mobile. Um site
 * de 1440px encolhido para a largura de um celular fica ilegível, enquanto a
 * versão mobile no iPhone é legível já no card.
 *
 * Duas decisões sustentam o efeito de ampliar:
 *
 * 1. O iframe nunca muda de lugar no DOM. Mover um iframe recarrega a página
 *    dentro dele, e o visitante perderia o que já navegou. Em vez disso o
 *    painel troca de `absolute` (dentro do aparelho) para `fixed` (sobre a
 *    página) e a transição entre os dois é feita com FLIP.
 *
 * 2. A réplica renderiza num viewport fixo do aparelho (1440x900 no monitor,
 *    402x874 no iPhone 17) e o que muda é só a escala. Assim o layout dentro
 *    do iframe não se rearranja durante a animação, e a escala do card e a da
 *    tela cheia casam no primeiro e no último quadro.
 */

type Device = "desktop" | "phone";

/** Viewport em que a réplica é renderizada em cada aparelho. */
const VIEWPORTS: Record<Device, { w: number; h: number }> = {
  /* 16:10, como um notebook comum. */
  desktop: { w: 1440, h: 900 },
  /* iPhone 17, em pontos CSS. */
  phone: { w: 402, h: 874 },
};

/** Abaixo disso o visitante está num celular e vê o iPhone. */
const PHONE_QUERY = "(max-width: 767px)";

/** Altura da barra que aparece sobre a tela ampliada. */
const BAR = 48;
const DURATION = 560;
const EASE = "cubic-bezier(.22,1,.36,1)";

type Phase = "closed" | "opening" | "open" | "closing";
type Rect = { left: number; top: number; width: number; height: number };
type Target = { screen: Rect; mobile: boolean };

/** Onde a tela fica quando ampliada. */
function computeTarget(device: Device): Target {
  const W = window.innerWidth;
  const H = window.innerHeight;

  /* No celular a tela ocupa o aparelho inteiro, abaixo da barra. */
  if (device === "phone") {
    return { screen: { left: 0, top: BAR, width: W, height: H - BAR }, mobile: true };
  }

  /* No computador, o maior 16:10 que cabe na janela. */
  const { w: VW, h: VH } = VIEWPORTS.desktop;
  const pad = W < 1280 ? 20 : 32;
  const width = Math.min(W - pad * 2, (H - pad * 2 - BAR) * (VW / VH));
  const height = width * (VH / VW);
  return {
    screen: {
      left: (W - width) / 2,
      top: (H - height - BAR) / 2 + BAR,
      width,
      height,
    },
    mobile: false,
  };
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Captura da tela inicial, gerada por scripts/posters.mjs. */
const posterOf = (demoPath: string, device: Device) =>
  `${demoPath.replace("/demo/", "/demos/")}/${device === "phone" ? "poster-mobile" : "poster"}.webp`;

/** Aparelho do visitante. `null` até montar, porque o servidor não sabe. */
function useDevice(): Device | null {
  const [device, setDevice] = useState<Device | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const update = () => setDevice(mq.matches ? "phone" : "desktop");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return device;
}

export default function DemoMonitor({ project }: { project: Project }) {
  const device = useDevice();

  /* Antes de saber o aparelho, os dois são desenhados e o CSS mostra o certo.
     Assim o card não pisca de monitor para iPhone ao carregar no celular, e o
     iframe só é criado uma vez, já no aparelho definitivo. */
  if (!device) {
    return (
      <>
        <div className="md:hidden">
          <PhoneFrame>
            <Poster src={posterOf(project.demo.path, "phone")} />
          </PhoneFrame>
        </div>
        <div className="hidden md:block">
          <MonitorFrame>
            <Poster src={posterOf(project.demo.path, "desktop")} />
          </MonitorFrame>
        </div>
      </>
    );
  }

  /* A key troca a tela inteira se o aparelho mudar (janela redimensionada
     através do breakpoint), começando fechada no aparelho novo. */
  return <LiveScreen key={device} project={project} device={device} />;
}

function LiveScreen({ project, device }: { project: Project; device: Device }) {
  const { demo } = project;
  const viewport = VIEWPORTS[device];
  const slotRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingAnim = useRef<Animation | null>(null);
  const hooked = useRef(new WeakSet<Document>());

  const [phase, setPhase] = useState<Phase>("closed");
  const [target, setTarget] = useState<Target | null>(null);
  const [slotWidth, setSlotWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [path, setPath] = useState("");

  const expanded = phase !== "closed";

  /* Largura da tela no card, de onde sai a escala da miniatura. */
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const ro = new ResizeObserver(() => setSlotWidth(slot.clientWidth));
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  /** Transform que leva a tela ampliada de volta ao retângulo do aparelho. */
  const collapsedTransform = (t: Target) => {
    const first = slotRef.current!.getBoundingClientRect();
    const k = first.width / t.screen.width;
    const tx = first.left - t.screen.left;
    const ty = first.top - t.screen.top;
    return `translate(${tx}px, ${ty}px) scale(${k})`;
  };

  const open = () => {
    if (phase !== "closed") return;
    setTarget(computeTarget(device));
    setPhase("opening");
  };

  const close = useCallback(() => {
    if (phase !== "open" && phase !== "opening") return;
    setPhase("closing");
  }, [phase]);

  /* Abertura: o painel já está na posição final, e o FLIP o faz partir do
     aparelho. Roda antes da pintura, então o primeiro quadro já é o do card. */
  useLayoutEffect(() => {
    if (phase !== "opening" || !target) return;
    const panel = panelRef.current!;
    const anim = panel.animate(
      [{ transform: collapsedTransform(target) }, { transform: "none" }],
      { duration: prefersReducedMotion() ? 0 : DURATION, easing: EASE }
    );
    anim.finished.then(() => setPhase("open")).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* Fechamento: o caminho inverso, e o painel só volta para dentro do aparelho
     quando a animação termina, já sobreposto ao retângulo do card. */
  useLayoutEffect(() => {
    if (phase !== "closing" || !target) return;
    const panel = panelRef.current!;
    const anim = panel.animate(
      [{ transform: "none" }, { transform: collapsedTransform(target) }],
      {
        duration: prefersReducedMotion() ? 0 : DURATION * 0.85,
        easing: EASE,
        fill: "forwards",
      }
    );
    closingAnim.current = anim;
    anim.finished.then(() => setPhase("closed")).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* O transform final do fechamento fica preso pelo `fill: forwards` até o
     painel voltar a ser `absolute`. Cancelar aqui, antes da pintura, evita um
     quadro com o painel deslocado. */
  useLayoutEffect(() => {
    if (phase !== "closed") return;
    closingAnim.current?.cancel();
    closingAnim.current = null;
  }, [phase]);

  /* Enquanto ampliada: trava a rolagem da página, fecha no Esc e acompanha o
     redimensionamento da janela. */
  useEffect(() => {
    if (!expanded) return;

    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onResize = () => setTarget(computeTarget(device));

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      html.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [expanded, close, device]);

  /* Foco: entra no botão de fechar ao abrir e volta ao aparelho ao fechar. */
  useEffect(() => {
    if (phase === "open") closeRef.current?.focus({ preventScroll: true });
    if (phase === "closed" && target) triggerRef.current?.focus({ preventScroll: true });
  }, [phase, target]);

  /**
   * Sincroniza o estado com o documento dentro do iframe.
   *
   * Não dá para depender só do evento `load`: ele pode disparar antes da
   * hidratação do React (e o handler ainda não existe), e o navegador adia o
   * evento em iframes com `loading="lazy"`. Por isso isto roda no `load`, na
   * montagem e periodicamente, e é idempotente.
   *
   * O iframe é do mesmo domínio, então dá para ouvir o Esc lá dentro e ler o
   * caminho atual para a barra de endereço.
   */
  const syncFrame = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      const doc = win.document;
      if (win.location.href === "about:blank" || doc.readyState === "loading") return;
      setLoaded(true);
      setPath(win.location.pathname.replace(demo.path, ""));
      if (!hooked.current.has(doc)) {
        hooked.current.add(doc);
        doc.addEventListener("keydown", (e) => {
          if (e.key === "Escape") window.dispatchEvent(new CustomEvent("demo:escape"));
        });
      }
    } catch {
      /* Fora do mesmo domínio (não deve acontecer): segue sem esses extras. */
    }
  }, [demo.path]);

  /* Até carregar, e depois enquanto aberta: a navegação interna das réplicas é
     client-side e não dispara `load`, então a barra de endereço confere o
     caminho periodicamente. */
  useEffect(() => {
    if (loaded && phase !== "open") return;
    syncFrame();
    const id = window.setInterval(syncFrame, 400);
    return () => window.clearInterval(id);
  }, [loaded, phase, syncFrame]);

  useEffect(() => {
    const onEscape = () => close();
    window.addEventListener("demo:escape", onEscape);
    return () => window.removeEventListener("demo:escape", onEscape);
  }, [close]);

  const restart = () => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.location.href = demo.path;
  };

  /* ---------------------------------------------------------- dimensões -- */

  /* Aberta no celular, a réplica usa a tela real do aparelho, sem escala. Em
     todo o resto ela fica no viewport do aparelho e só a escala muda. */
  const fullBleed = phase === "open" && target?.mobile;
  const frameW = fullBleed ? target!.screen.width : viewport.w;
  const frameH = fullBleed ? target!.screen.height : viewport.h;
  const scale = fullBleed
    ? 1
    : expanded && target
      ? target.screen.width / viewport.w
      : slotWidth / viewport.w;

  const panelStyle: React.CSSProperties =
    expanded && target
      ? {
          position: "fixed",
          left: target.screen.left,
          top: target.screen.top - BAR,
          width: target.screen.width,
          height: target.screen.height + BAR,
          zIndex: 120,
          /* O FLIP escala a partir do canto superior esquerdo da TELA, não do
             painel: é a tela que precisa coincidir com o aparelho. */
          transformOrigin: `0 ${BAR}px`,
        }
      : { position: "absolute", inset: 0 };

  const shownUrl = demo.secure ? `${demo.label}${path === "/" ? "" : path}` : demo.label;

  const screen = (
    <>
      {/* Enquanto a tela está ampliada, o aparelho fica com um brilho apagado
          no lugar, em vez de um buraco. */}
      {expanded && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.14),transparent_70%)]" />
      )}

      <div
        ref={panelRef}
        style={panelStyle}
        className={`flex flex-col overflow-hidden ${
          expanded
            ? "rounded-[12px] border border-lilac/20 bg-[#0d0a18] shadow-[0_40px_120px_rgba(0,0,0,0.7)] max-md:rounded-none max-md:border-0"
            : ""
        }`}
      >
        {/* Barra da tela ampliada */}
        {expanded && (
          <div
            className={`flex flex-shrink-0 items-center gap-3 border-b border-lilac/[0.14] bg-[rgba(18,14,30,0.96)] px-3 transition-opacity duration-200 sm:px-4 ${
              phase === "open" ? "opacity-100" : "opacity-0"
            }`}
            style={{ height: BAR }}
          >
            <div className="hidden flex-shrink-0 gap-1.5 sm:flex">
              {["bg-[#ff5f57]/60", "bg-[#febc2e]/60", "bg-[#28c840]/60"].map((c) => (
                <span key={c} className={`h-3 w-3 rounded-full ${c}`} />
              ))}
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-lilac/[0.12] bg-white/[0.04] px-3 py-1.5">
              {demo.secure ? (
                <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 flex-shrink-0 fill-none stroke-lilac/70" strokeWidth="1.2">
                  <rect x="2.5" y="5.2" width="7" height="5" rx="1.2" />
                  <path d="M4.2 5.2V3.9a1.8 1.8 0 0 1 3.6 0v1.3" />
                </svg>
              ) : (
                <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lilac/50" />
              )}
              <span className="truncate font-mono text-[11.5px] text-txt-label">{shownUrl}</span>
            </div>

            <button
              type="button"
              onClick={restart}
              title="Voltar ao início da réplica"
              aria-label="Voltar ao início da réplica"
              className="hidden flex-shrink-0 rounded-full border border-lilac/25 bg-white/[0.04] p-1.5 text-txt-muted transition-colors hover:border-lilac hover:text-white sm:block"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M2.5 2.5V5h2.5" />
              </svg>
            </button>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden flex-shrink-0 rounded-full border border-lilac/25 bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] text-lilac-light transition-colors hover:border-lilac hover:text-white md:block"
              >
                Site real ↗
              </a>
            )}
            <Link
              href={`/projeto/${project.slug}`}
              className="hidden flex-shrink-0 rounded-full bg-violet px-3 py-1 text-[11.5px] font-semibold text-white transition-colors hover:bg-violet-hover md:block"
            >
              Ver o caso
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="flex-shrink-0 rounded-full border border-lilac/25 bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] text-txt-muted transition-colors hover:border-lilac hover:text-white"
            >
              Fechar <span className="hidden sm:inline">· Esc</span> ✕
            </button>
          </div>
        )}

        {/* A tela */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            src={demo.path}
            title={`Réplica navegável: ${project.title}`}
            loading="lazy"
            onLoad={syncFrame}
            tabIndex={phase === "open" ? 0 : -1}
            aria-hidden={phase === "open" ? undefined : true}
            className="absolute left-0 top-0 block origin-top-left border-0"
            style={{
              width: frameW,
              height: frameH,
              transform: `scale(${scale})`,
              /* Miniatura é vitrine, não interface: o clique abre a tela. */
              pointerEvents: phase === "open" ? "auto" : "none",
              visibility: scale ? "visible" : "hidden",
            }}
          />

          {/* Enquanto a réplica carrega (um app inteiro, alguns segundos), o
              aparelho mostra a captura da tela inicial e troca pelo site ao
              vivo quando pronto. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
              loaded ? "opacity-0" : "opacity-100"
            }`}
          >
            <Poster src={posterOf(demo.path, device)} />
            <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-[rgba(13,10,24,0.78)] px-2 py-1 font-mono text-[9px] text-lilac-light">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lilac" />
              carregando
            </span>
          </div>
        </div>
      </div>

      {/* Gatilho: a tela inteira do aparelho é o botão. */}
      {!expanded && (
        <button
          ref={triggerRef}
          type="button"
          onClick={open}
          aria-label={`Abrir ${project.title} em tela ampliada e navegar`}
          className="group/screen absolute inset-0 z-[1] flex items-end justify-center bg-transparent p-3 outline-none transition-colors duration-300 hover:bg-[rgba(13,10,24,0.28)] focus-visible:bg-[rgba(13,10,24,0.28)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lilac"
        >
          <span className="flex items-center gap-1.5 rounded-full border border-lilac/30 bg-[rgba(13,10,24,0.86)] px-3 py-1.5 font-mono text-[10.5px] text-lilac-lighter opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-opacity duration-300 group-hover/screen:opacity-100 group-focus-visible/screen:opacity-100">
            {device === "phone" ? "Toque para interagir ⤢" : "Clique para interagir ⤢"}
          </span>
        </button>
      )}
    </>
  );

  return (
    <>
      {device === "phone" ? (
        <PhoneFrame slotRef={slotRef}>{screen}</PhoneFrame>
      ) : (
        <MonitorFrame slotRef={slotRef}>{screen}</MonitorFrame>
      )}

      {/* Fundo atrás da tela ampliada */}
      {expanded &&
        createPortal(<Backdrop closing={phase === "closing"} onClick={close} />, document.body)}
    </>
  );
}

/* ------------------------------------------------------------ aparelhos -- */

function Poster({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="absolute inset-0 h-full w-full bg-[#0d0a18] object-cover object-top" />
  );
}

/** Monitor desenhado em CSS: tela 16:10, queixo, pescoço e base. */
function MonitorFrame({
  slotRef,
  children,
}: {
  slotRef?: RefObject<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div className="rounded-[14px] border border-white/[0.07] bg-gradient-to-b from-[#221d2f] to-[#15121e] p-[7px] shadow-[0_22px_44px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div
          ref={slotRef}
          className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-[#0b0912]"
        >
          {children}
        </div>

        {/* Queixo */}
        <div className="flex h-[16px] items-center justify-center">
          <span className="h-[3px] w-[3px] rounded-full bg-white/20" />
        </div>
      </div>

      {/* Pescoço e base */}
      <div
        aria-hidden="true"
        className="mx-auto h-[20px] w-[16%] bg-gradient-to-b from-[#16121f] to-[#2a2439]"
        style={{ clipPath: "polygon(14% 0, 86% 0, 100% 100%, 0 100%)" }}
      />
      <div
        aria-hidden="true"
        className="mx-auto h-[5px] w-[32%] rounded-full bg-gradient-to-b from-[#2f2840] to-[#1a1624] shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}

/**
 * iPhone 17 desenhado em CSS: moldura de alumínio, bordas finas, Dynamic
 * Island e os botões laterais. A tela tem a proporção do aparelho (402x874).
 *
 * A largura é fixa, e não a do card, para o aparelho ficar do tamanho de um
 * celular de verdade na página e seis deles em coluna não virarem um
 * corredor sem fim.
 */
function PhoneFrame({
  slotRef,
  children,
}: {
  slotRef?: RefObject<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-[min(62vw,236px)]">
      {/* Botões laterais: ação, volume e câmera à esquerda; liga à direita. */}
      <span aria-hidden="true" className="absolute -left-[2px] top-[17%] h-[5%] w-[3px] rounded-l-sm bg-[#3a3448]" />
      <span aria-hidden="true" className="absolute -left-[2px] top-[25%] h-[9%] w-[3px] rounded-l-sm bg-[#3a3448]" />
      <span aria-hidden="true" className="absolute -left-[2px] top-[36%] h-[9%] w-[3px] rounded-l-sm bg-[#3a3448]" />
      <span aria-hidden="true" className="absolute -right-[2px] top-[28%] h-[14%] w-[3px] rounded-r-sm bg-[#3a3448]" />

      <div className="rounded-[40px] bg-gradient-to-b from-[#4a4357] via-[#2c2738] to-[#3d3649] p-[2px] shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
        <div className="rounded-[38px] bg-[#0a0910] p-[7px]">
          <div
            ref={slotRef}
            className="relative aspect-[402/874] overflow-hidden rounded-[31px] bg-[#0b0912]"
          >
            {children}

            {/* Dynamic Island, por cima do site como no aparelho real. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[1.6%] z-[2] h-[4%] w-[31%] -translate-x-1/2 rounded-full bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Backdrop({ closing, onClick }: { closing: boolean; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const duration = prefersReducedMotion() ? 0 : closing ? DURATION * 0.85 : DURATION;
    el.animate(
      closing ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
      { duration, easing: EASE, fill: "forwards" }
    );
  }, [closing]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      aria-hidden="true"
      className="fixed inset-0 z-[110] bg-[rgba(4,3,8,0.86)] backdrop-blur-md"
    />
  );
}
