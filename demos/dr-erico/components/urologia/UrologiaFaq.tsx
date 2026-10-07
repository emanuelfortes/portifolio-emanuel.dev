import FaqAccordion, { type FaqItem } from '@/demos/dr-erico/components/ui/FaqAccordion'

/**
 * Wrapper mantido para não alterar as 24 páginas que já importam este caminho.
 *
 * A implementação real vive em components/ui/FaqAccordion.tsx. Este arquivo
 * era uma cópia idêntica de outros dois, e os três renderizavam APENAS a
 * resposta aberta:
 *
 *   {aberto === i && <div>{item.a}</div>}
 *
 * Com o estado inicial em 0, o HTML servido continha só a primeira resposta.
 * As demais nunca chegavam ao DOM. Só que essas páginas publicam um FAQPage
 * no JSON-LD declarando TODAS as perguntas, ou seja, o dado estruturado
 * afirmava um conteúdo que a página não mostrava. É justamente a condição que
 * o Google exige para aceitar FAQPage.
 *
 * O FaqAccordion usa <details>, que mantém todas as respostas no HTML. De
 * brinde funciona sem JavaScript, é navegável por teclado de origem e não
 * precisa de 'use client', então as páginas deixam de carregar este
 * componente no bundle.
 *
 * Os três wrappers podem ser colapsados num só quando alguém quiser trocar os
 * imports das 24 páginas. Foram mantidos aqui para que a correção do bug não
 * dependesse de mexer em todas elas.
 */
export default function UrologiaFaq({ faq }: { faq: FaqItem[] }) {
  return <FaqAccordion faq={faq} className="mt-10" />
}
