"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Encaixa uma interface de largura fixa dentro de um container fluido.
 *
 * As réplicas são escritas na largura natural em que foram desenhadas (1280px),
 * como qualquer tela de verdade. Este componente mede o espaço disponível e
 * aplica um `scale` para caber, mantendo tudo que está dentro como DOM real.
 *
 * É essa a diferença para uma captura: `transform: scale` é composto pela GPU
 * em cima do texto vetorial, então a tipografia continua nítida em qualquer
 * fator de escala. Uma imagem, no mesmo lugar, borraria. Além disso o conteúdo
 * segue selecionável, acessível a leitor de tela e indexável.
 */

type Props = {
  /** Largura em que a réplica foi desenhada. */
  width: number;
  /** Limita a escala. Use 1 para nunca ampliar além do tamanho natural. */
  maxScale?: number;
  children: ReactNode;
  className?: string;
};

export default function ScaledFrame({
  width,
  maxScale = 1,
  children,
  className = "",
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const next = Math.min(maxScale, outer.clientWidth / width);
      setScale(next);
      setHeight(inner.offsetHeight * next);
    };

    measure();

    /* Observa os dois: o container muda com o viewport, o conteúdo muda quando
       fontes carregam ou quando a réplica abre alguma seção. */
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width, maxScale]);

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-hidden ${className}`}
      /* Antes da primeira medição o height fica 0 e nada vaza para fora. */
      style={{ height: height || undefined }}
    >
      <div
        ref={innerRef}
        style={{
          width,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          /* Evita um frame com a réplica em tamanho natural antes de medir. */
          visibility: scale ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
