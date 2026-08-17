"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* pixel-art do símbolo </> (células de 7x7px) */
const PX: [number, number][] = [
  [2, 1], [1, 2], [0, 3], [1, 4], [2, 5],                       // <
  [6, 0], [5, 1], [5, 2], [4, 3], [4, 4], [3, 5], [3, 6],       // /
  [7, 1], [8, 2], [9, 3], [8, 4], [7, 5],                       // >
];
const rects = PX.map(
  ([x, y]) => `<rect x='${x * 7}' y='${y * 7}' width='7' height='7' fill='white'/>`
).join("");

/* tile de 160x136 com 2 glyphs deslocados = padrão xadrez */
const GLYPH =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='136'>` +
      `<g transform='translate(19,20)'>${rects}</g>` +
      `<g transform='translate(99,88)'>${rects}</g></svg>`
  );

/**
 * A foto preenche a largura do card e encosta na base; a máscara só dissolve
 * o topo, para não cortar em linha reta logo abaixo do nome. Só é necessária
 * enquanto a foto tiver fundo — com um PNG recortado dá para remover.
 */
const SOFT =
  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 14%, black 32%)";

type Props = {
  photo?: string;
  name?: string;
  role?: string;
};

export default function ProfileCard({
  photo = "/cardprofile.png",
  name = "Emanuel Fortes",
  role = "Full Stack Developer",
}: Props) {
  const [p, setP] = useState({ x: 0.5, y: 0.5, hover: false });
  /* Sem hover real (celular) o tilt não faz sentido: fica parado no centro. */
  const [temHover, setTemHover] = useState(true);

  useEffect(() => {
    setTemHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const rotY = (p.x - 0.5) * 24;
  const rotX = (0.5 - p.y) * 24;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!temHover) return;
    const r = e.currentTarget.getBoundingClientRect();
    setP({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
      hover: true,
    });
  };
  const onLeave = () => setP({ x: 0.5, y: 0.5, hover: false });

  const mask = `url("${GLYPH}"), radial-gradient(circle at ${p.x * 100}% ${
    p.y * 100
  }%, black 10%, rgba(0,0,0,0.3) 45%, transparent 78%)`;

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 900 }}
      /* Empilhado (mobile) ocupa a largura da coluna, até 380px, centralizado.
         Em linha (desktop) volta a ser uma faixa fixa de 320px que não encolhe.
         Antes eu usava flex-none aqui embaixo, o que zerava o basis e deixava o
         card do tamanho do texto do nome — a foto encolhia junto. */
      className="w-full max-w-[380px] flex-none self-center min-[1201px]:w-80 min-[1201px]:max-w-none"
    >
      <div
        style={{
          position: "relative",
          height: 430,
          borderRadius: 26,
          overflow: "hidden",
          border: "1px solid rgba(167,139,250,0.25)",
          background: "#120d24",
          transform: `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
          transformStyle: "preserve-3d",
          transition: p.hover ? "transform .08s linear" : "transform .5s ease",
          boxShadow: p.hover
            ? `${-rotY * 1.5}px ${rotX * 1.5 + 24}px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.35)`
            : "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        {/* fundo do card */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(165deg, rgba(76,44,140,0.65), rgba(20,14,38,0.9) 55%, rgba(46,26,90,0.55))",
            pointerEvents: "none",
          }}
        />

        {/* nome */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            padding: "30px 20px 0",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              background: "linear-gradient(180deg,#f2eeff,#9d8fc7)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {name}
          </div>
          <div
            style={{
              /* usa a variável do next/font: o nome "JetBrains Mono" não
                 existe no documento, as fontes são auto-hospedadas */
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#a99ed0",
              marginTop: 8,
            }}
          >
            {role}
          </div>
        </div>

        {/* foto em duotone; a máscara esfuma o fundo que a foto ainda tem */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "78%",
            zIndex: 1,
            filter: "grayscale(1) brightness(0.95) contrast(1.05)",
            maskImage: SOFT,
            WebkitMaskImage: SOFT,
          }}
        >
          <Image
            src={photo}
            alt={name}
            fill
            sizes="320px"
            style={{ objectFit: "cover", objectPosition: "center bottom" }}
          />
        </div>

        {/* tinta roxa por cima da foto */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(91,61,240,0.28), rgba(139,92,246,0.18) 60%, rgba(30,18,60,0.5))",
            mixBlendMode: "color",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* foil arco-íris recortado pelos </> pixelados */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            background: `linear-gradient(${115 + rotY * 3}deg,
              #c98a8a ${p.x * 40 - 30}%, #c9ab7d ${p.x * 40 - 15}%, #c9c184 ${p.x * 40}%,
              #8ac99e ${p.x * 40 + 15}%, #84b8c9 ${p.x * 40 + 30}%, #9a8ac9 ${p.x * 40 + 45}%,
              #c98abb ${p.x * 40 + 60}%)`,
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: "160px 136px, 100% 100%",
            WebkitMaskSize: "160px 136px, 100% 100%",
            maskPosition: `${p.x * 60}px ${p.y * 60}px, 0 0`,
            WebkitMaskPosition: `${p.x * 60}px ${p.y * 60}px, 0 0`,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
            mixBlendMode: "color-dodge",
            opacity: p.hover ? 0.65 : 0.12,
            transition: "opacity .4s ease",
          }}
        />

        {/* glare especular seguindo o ponteiro */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            background: `radial-gradient(circle at ${p.x * 100}% ${p.y * 100}%, rgba(255,255,255,0.28), rgba(160,120,255,0.12) 30%, transparent 60%)`,
            mixBlendMode: "overlay",
            opacity: p.hover ? 1 : 0,
            transition: "opacity .4s ease",
          }}
        />
      </div>
    </div>
  );
}
