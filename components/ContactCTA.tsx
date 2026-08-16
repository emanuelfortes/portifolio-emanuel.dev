"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { whatsappBare, whatsappDisplay } from "@/data/site";

// A água 3D só existe no cliente e não deve entrar no bundle inicial
const WaveBackground = dynamic(() => import("./WaveBackground"), {
  ssr: false,
});

export default function ContactCTA() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copyPhone = () => {
    navigator.clipboard?.writeText(whatsappDisplay);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contato" className="container-page pb-[90px] pt-[60px]">
      <div className="relative overflow-hidden rounded-card-xl border border-lilac/[0.18] bg-ink-cta px-[8vw] py-[90px] text-center max-[640px]:px-6 max-[640px]:py-[60px]">
        <WaveBackground />

        {/* Véu do handoff, para o texto ficar legível sobre a água */}
        <div className="pointer-events-none absolute inset-0 bg-grad-veil" />

        <div className="relative">
          <h2 className="text-[clamp(30px,4vw,52px)] font-semibold tracking-[-0.035em]">
            Tem um projeto em mente?
          </h2>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappBare}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-txt px-7 py-[13px] text-sm font-semibold text-ink-deep transition-colors hover:bg-white"
            >
              Chamar no WhatsApp
            </a>
            <button
              onClick={copyPhone}
              aria-label={`Copiar telefone ${whatsappDisplay}`}
              className="rounded-full border border-lilac/30 bg-white/[0.04] px-6 py-3 font-mono text-[13px] text-txt transition-colors hover:border-lilac"
            >
              {whatsappDisplay}
              <span className="ml-1.5 text-lilac">{copied ? "✓" : "⧉"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
