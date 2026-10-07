"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { ImageAsset } from "@/demos/cirurgia-mohs/config/images";

const LENS = 170; // diâmetro da lupa, em px
const ZOOM = 2.4; // ampliação em relação ao tamanho exibido
const MIN_RESERVA = 1.4; // só amplia se a imagem tiver pelo menos 1,4× a largura exibida

/**
 * Imagem com lupa para ler detalhes (fluxogramas, tabelas em imagem).
 *
 * Computador: a lupa segue o mouse enquanto ele está sobre a imagem.
 * Celular: um toque liga a lupa (a rolagem da página continua livre até lá),
 * o dedo arrasta a lupa e um novo toque, sem arrastar, desliga.
 * A ampliação usa o arquivo original em alta resolução; imagens pequenas
 * demais para ampliar ficam sem lupa.
 */
export default function MagnifierImage({
  asset,
  alt,
  priority = false,
  sizes,
}: {
  asset: ImageAsset;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [touchOn, setTouchOn] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const downAt = useRef<{ x: number; y: number; wasOn: boolean } | null>(null);

  useEffect(() => {
    const measure = () => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      setSize({ w: r.width, h: r.height });
      setCanZoom(asset.width >= r.width * MIN_RESERVA);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [asset.width]);

  // Baixa o original em alta resolução antes do primeiro uso, para a lupa não abrir vazia.
  useEffect(() => {
    if (!canZoom) return;
    const img = new window.Image();
    img.src = asset.src;
  }, [canZoom, asset.src]);

  const posFrom = (e: PointerEvent<HTMLDivElement>) => {
    const r = box.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - r.left, 0), r.width),
      y: Math.min(Math.max(e.clientY - r.top, 0), r.height),
    };
  };
  const isTouch = (e: PointerEvent<HTMLDivElement>) => e.pointerType === "touch";

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!canZoom || !isTouch(e)) return;
    downAt.current = { x: e.clientX, y: e.clientY, wasOn: touchOn };
    if (!touchOn) setTouchOn(true);
    setLens(posFrom(e));
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!canZoom) return;
    if (isTouch(e)) {
      if (touchOn && e.buttons) setLens(posFrom(e));
      return;
    }
    setLens(posFrom(e));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!isTouch(e) || !downAt.current) return;
    const moved = Math.hypot(e.clientX - downAt.current.x, e.clientY - downAt.current.y);
    // toque sem arrastar com a lupa já ligada: desliga
    if (downAt.current.wasOn && moved < 8) {
      setTouchOn(false);
      setLens(null);
    }
    downAt.current = null;
  }

  function onPointerLeave(e: PointerEvent<HTMLDivElement>) {
    if (!isTouch(e)) setLens(null);
  }

  const showLens = canZoom && lens !== null;

  return (
    <div>
      <div
        ref={box}
        className={`relative select-none ${canZoom ? "cursor-zoom-in" : ""}`}
        style={{ touchAction: touchOn ? "none" : "auto" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        <Image
          src={asset.src}
          alt={alt}
          width={asset.width}
          height={asset.height}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          className="h-auto w-full"
          draggable={false}
        />
        {showLens && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border-2 border-navy bg-paper bg-no-repeat shadow-[0_6px_24px_-8px_rgba(22,28,43,0.6)]"
            style={{
              width: LENS,
              height: LENS,
              left: lens.x - LENS / 2,
              top: lens.y - LENS / 2,
              backgroundImage: `url(${asset.src})`,
              backgroundSize: `${size.w * ZOOM}px ${size.h * ZOOM}px`,
              backgroundPosition: `${LENS / 2 - lens.x * ZOOM}px ${LENS / 2 - lens.y * ZOOM}px`,
            }}
          />
        )}
      </div>
      {canZoom && (
        <p className="mt-2 text-[11px] text-muted">
          {touchOn
            ? "Arraste o dedo para ver os detalhes · toque de novo para sair"
            : "Passe o mouse ou toque na imagem para ampliar os detalhes"}
        </p>
      )}
    </div>
  );
}
