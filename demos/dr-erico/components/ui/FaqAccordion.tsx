import { Plus } from 'lucide-react'

export type FaqItem = { q: string; a: string }

/**
 * Lista de perguntas frequentes, em sanfona.
 *
 * ── Por que <details> e não o acordeão controlado por estado ──────────────
 * Os componentes antigos (components/urologia/UrologiaFaq.tsx e os
 * equivalentes de HoLEP e cálculo renal) renderizam APENAS a resposta aberta:
 *
 *   {aberto === i && <div>{item.a}</div>}
 *
 * Com o estado inicial em 0, o HTML servido contém só a primeira resposta. As
 * outras nunca chegam ao DOM até alguém clicar. Só que essas páginas publicam
 * um FAQPage no JSON-LD declarando todas — ou seja, o dado estruturado afirma
 * um conteúdo que a página não mostra, que é justamente a condição que o
 * Google exige para aceitar FAQPage.
 *
 * <details> mantém todas as respostas no HTML, abertas ou fechadas. De brinde
 * funciona sem JavaScript, é navegável por teclado de origem e dispensa
 * 'use client', então quem usa este componente continua Server Component.
 *
 * Use sempre junto com um FAQPage montado do MESMO array, para que a página e
 * o dado estruturado não possam divergir.
 */
export default function FaqAccordion({
  faq,
  className = '',
}: {
  faq: FaqItem[]
  /** Espaçamento externo. Os wrappers antigos passam "mt-10" para preservar
   *  o layout das páginas que já existiam. */
  className?: string
}) {
  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {faq.map((item, i) => (
        <details
          key={item.q}
          className="group bg-brand-beige-light rounded-2xl overflow-hidden"
          data-aos="fade-up"
          data-aos-delay={i * 40}
        >
          <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <h3 className="font-medium text-brand-navy text-[15px]">{item.q}</h3>
            <Plus
              size={18}
              aria-hidden="true"
              className="shrink-0 text-brand-gold transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <div className="px-5 pb-5 text-sm text-brand-muted leading-relaxed">{item.a}</div>
        </details>
      ))}
    </div>
  )
}

/** Monta o FAQPage do mesmo array que a página renderiza. */
export function faqPageSchema(faq: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
