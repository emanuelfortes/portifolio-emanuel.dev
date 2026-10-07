import type { FaqItem } from "@/demos/cirurgia-mohs/lib/content";
import { slugify } from "@/demos/cirurgia-mohs/lib/content";
import Markdown from "./Markdown";
import FaqAutoOpen from "./FaqAutoOpen";

/**
 * Perguntas frequentes em HTML nativo (<details>/<summary>): acessível, sem
 * JavaScript e com o texto das respostas indexável. Estilo editorial
 * (docs/HANDOFF.md §5.3): regras finas e "+" que vira "×" ao abrir. A classe
 * "disclosure" dá a abertura e o fechamento suaves (ver globals.css).
 * Cada pergunta tem id próprio para receber links (#pergunta).
 * O schema FAQPage correspondente vem do JSON-LD de cada página.
 */
export default function Faq({
  items,
  openFirst = false,
  compact = false,
}: {
  items: FaqItem[];
  openFirst?: boolean;
  /** Versão menor para colunas estreitas (home) */
  compact?: boolean;
}) {
  return (
    <div className={`faq not-prose border-t border-line ${compact ? "mt-4" : "my-6"}`}>
      <FaqAutoOpen />
      {items.map((item, i) => (
        <details
          key={i}
          id={slugify(item.question)}
          className="disclosure group border-b border-line"
          open={openFirst && i === 0}
        >
          <summary className={`flex items-center justify-between gap-4 text-left ${compact ? "py-3" : "py-[18px]"}`}>
            <h3 className={`font-sans font-semibold leading-snug text-navy ${compact ? "text-[15px]" : "text-base"}`}>
              {item.question}
            </h3>
            <span className="faq-plus shrink-0 font-display text-2xl leading-none text-navy" aria-hidden="true">
              +
            </span>
          </summary>
          {/* Sem prose-mohs no compacto: a regra global de tamanho venceria o texto menor. */}
          <Markdown
            md={item.answer}
            className={
              compact
                ? "pb-4 text-[13px] leading-relaxed text-ink-muted [&_a]:text-navy [&_a]:underline [&_p+p]:mt-2"
                : "prose-mohs pb-5 text-[15px] text-ink-muted"
            }
          />
        </details>
      ))}
    </div>
  );
}
