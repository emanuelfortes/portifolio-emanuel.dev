import type { Metadata } from 'next'
import PaginaInstitucional, { type BlocoTexto } from '@/demos/dr-erico/components/ui/PaginaInstitucional'
import { site } from '@/demos/dr-erico/data/site'

const SITE_URL = 'https://drericodiogenes.com.br'

export const metadata: Metadata = {
  title: { absolute: 'Política de Correções | Dr. Érico Diógenes' },
  description:
    'Como um erro publicado no site do Dr. Érico Diógenes é corrigido, sinalizado e comunicado ao leitor.',
  alternates: { canonical: '/politica-de-correcoes' },
}

const blocos: BlocoTexto[] = [
  { tipo: 'h2', texto: 'Por que esta página existe' },
  {
    tipo: 'p',
    texto: 'Conteúdo de saúde erra caro. Um dado desatualizado sobre quando começar o rastreamento, ou sobre o que um exame significa, pode mudar a decisão de quem lê. Por isso o compromisso aqui não é o de nunca errar, que ninguém pode assumir, e sim o de corrigir de forma aberta.',
  },
  {
    tipo: 'p',
    texto: 'Correção silenciosa, feita sem avisar, é pior do que o erro original: ela tira do leitor a chance de saber que leu algo equivocado.',
  },

  { tipo: 'h2', texto: 'Como avisar sobre um erro' },
  {
    tipo: 'p',
    texto: `Qualquer pessoa pode apontar um erro, por e-mail para ${site.email} ou pela [página de contato](/contato). Ajuda muito informar o endereço da página e o trecho específico.`,
  },
  {
    tipo: 'p',
    texto: 'Avaliamos todo aviso recebido. A resposta vem mesmo quando a conclusão é que não houve erro, com a explicação do porquê.',
  },

  { tipo: 'h2', texto: 'O que fazemos com cada tipo de erro' },
  {
    tipo: 'p',
    texto: 'Nem todo erro merece o mesmo tratamento, e tratar tudo igual esvazia o aviso. A regra é esta:',
  },
  {
    tipo: 'lista',
    itens: [
      'Erro de digitação, grafia ou formatação: corrigido sem nota, porque não altera o sentido do que foi dito.',
      'Erro que muda o sentido, como um número, uma data, um nome ou uma indicação clínica: corrigido e sinalizado com uma nota no fim do texto, dizendo o que foi corrigido e quando.',
      'Erro grave, que possa ter levado alguém a uma decisão errada de saúde: além da nota, o texto recebe um aviso no topo, visível antes da leitura.',
      'Informação que envelheceu, sem ter sido errada quando publicada: o texto é atualizado e a data de atualização muda, sem nota de correção.',
    ],
  },

  { tipo: 'h2', texto: 'O que a nota de correção traz' },
  {
    tipo: 'p',
    texto: 'A nota diz o que estava escrito antes, o que passou a estar, e a data da mudança. Não apagamos o registro de que houve correção, mesmo depois de muito tempo.',
  },
  {
    tipo: 'p',
    texto: 'O texto original não é removido do ar quando o erro é corrigível. Remoção fica reservada a casos em que manter a página no ar seja, por si, um risco.',
  },

  { tipo: 'h2', texto: 'Prazo' },
  {
    tipo: 'p',
    texto: 'Erro grave é corrigido assim que confirmado, no mesmo dia sempre que possível. Os demais entram na revisão seguinte do conteúdo.',
  },

  { tipo: 'h2', texto: 'Quem decide' },
  {
    tipo: 'p',
    texto: `A decisão sobre corrigir, e como sinalizar, é do Dr. Érico Diógenes, ${site.crm} · ${site.rqe}, responsável editorial pela publicação. O critério e o fluxo de produção do conteúdo estão na [política editorial](/politica-editorial).`,
  },
]

export default function PoliticaDeCorrecoes() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Política de Correções', item: `${SITE_URL}/politica-de-correcoes` },
    ],
  }

  return (
    <>
      <PaginaInstitucional
        titulo="Política de Correções"
        resumo="Como um erro publicado aqui é corrigido, sinalizado e comunicado a quem lê."
        atualizadoEm="2 de outubro de 2026"
        blocos={blocos}
      />
    </>
  )
}
