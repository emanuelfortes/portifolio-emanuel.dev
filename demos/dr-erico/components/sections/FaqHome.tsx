import Link from '@/demos/dr-erico/lib/Link'
import { Plus } from 'lucide-react'
import { faqHome } from '@/demos/dr-erico/data/faq-home'
import { site } from '@/demos/dr-erico/data/site'

/**
 * FAQ da home, sobre a especialidade e onde encontrar atendimento em Fortaleza.
 *
 * ── Por que <details> e não o acordeão de UrologiaFaq ─────────────────────
 * O acordeão que as páginas internas usam renderiza APENAS a resposta aberta
 * (`{aberto === i && <div>…}`), então as demais não existem no HTML, só no
 * bundle. Isso briga com o FAQPage do JSON-LD, que declara todas: o dado
 * estruturado afirma um conteúdo que não está na página.
 *
 * <details> resolve mantendo todas as respostas no HTML, abertas ou fechadas,
 * que é o que o Google pede. De brinde funciona sem JavaScript, é navegável
 * por teclado de origem e dispensa 'use client', então esta seção continua
 * sendo Server Component.
 *
 * As páginas internas têm a mesma inconsistência e ficaram como estavam, por
 * estarem fora do escopo. Ver docs/plano-recuperacao-dev.md.
 */
export default function FaqHome() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-site max-w-4xl">
        <div className="text-center mb-10" data-aos="fade-up">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 className="section-title mt-2">UROLOGISTA EM FORTALEZA</h2>
          <p className="text-brand-muted mt-4 max-w-2xl mx-auto text-sm md:text-base">
            O que a especialidade trata, quando procurar e onde encontrar atendimento na cidade.
          </p>
        </div>

        <div className="space-y-3">
          {faqHome.map((item, i) => (
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

        <div className="text-center mt-10" data-aos="fade-up">
          <p className="text-brand-muted text-sm">
            Ficou com outra dúvida? Fale direto com a equipe.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Agendar consulta
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors px-4 py-2"
            >
              Ver os três endereços
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
