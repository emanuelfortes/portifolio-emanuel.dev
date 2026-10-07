import type { ReactNode } from "react";

/**
 * Moldura de navegador desenhada em CSS, não em PNG.
 *
 * Mockup em imagem borra ao escalar e carrega um arquivo só para enfeite. Em
 * CSS a moldura fica nítida em qualquer tamanho, acompanha os tokens do tema e
 * não pesa nada. A barra de endereço é o que sinaliza "isto é um site de
 * verdade" antes de o visitante interagir com qualquer coisa.
 */

type Props = {
  /** Texto da barra de endereço. */
  label: string;
  /** Cadeado antes do endereço. Use false em sistema interno sem domínio. */
  secure?: boolean;
  /** `sm` no card da home, `lg` na vitrine ampliada. */
  size?: "sm" | "lg";
  children: ReactNode;
  className?: string;
};

/* Pontos do canto, na paleta do tema em vez do vermelho/amarelo/verde cru. */
const DOTS = ["bg-[#ff5f57]/55", "bg-[#febc2e]/55", "bg-[#28c840]/55"];

export default function BrowserFrame({
  label,
  secure = true,
  size = "sm",
  children,
  className = "",
}: Props) {
  const lg = size === "lg";

  return (
    <div
      className={`overflow-hidden rounded-xl border border-lilac/[0.18] bg-[#0d0a18] shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Barra do navegador */}
      <div
        className={`flex items-center gap-3 border-b border-lilac/[0.14] bg-[rgba(18,14,30,0.9)] ${
          lg ? "px-4 py-2.5" : "px-3 py-2"
        }`}
      >
        <div className="flex flex-shrink-0 gap-1.5">
          {DOTS.map((dot) => (
            <span
              key={dot}
              className={`${lg ? "h-3 w-3" : "h-2.5 w-2.5"} rounded-full ${dot}`}
            />
          ))}
        </div>

        <div
          className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-lilac/[0.12] bg-white/[0.04] ${
            lg ? "px-3.5 py-1.5" : "px-3 py-1"
          }`}
        >
          {secure ? (
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className={`${lg ? "h-3 w-3" : "h-2.5 w-2.5"} flex-shrink-0 fill-none stroke-lilac/70`}
              strokeWidth="1.2"
            >
              <rect x="2.5" y="5.2" width="7" height="5" rx="1.2" />
              <path d="M4.2 5.2V3.9a1.8 1.8 0 0 1 3.6 0v1.3" />
            </svg>
          ) : (
            <span
              aria-hidden="true"
              className={`${lg ? "h-1.5 w-1.5" : "h-1 w-1"} flex-shrink-0 rounded-full bg-lilac/50`}
            />
          )}
          <span
            className={`truncate font-mono text-txt-label ${
              lg ? "text-[12px]" : "text-[10px]"
            }`}
          >
            {label}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
