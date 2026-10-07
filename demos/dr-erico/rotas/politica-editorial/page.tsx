import type { Metadata } from 'next'
import PaginaInstitucional, { type BlocoTexto } from '@/demos/dr-erico/components/ui/PaginaInstitucional'
import { site } from '@/demos/dr-erico/data/site'

const SITE_URL = 'https://drericodiogenes.com.br'

export const metadata: Metadata = {
  title: { absolute: 'Política Editorial | Dr. Érico Diógenes' },
  description:
    'Como o conteúdo do site do Dr. Érico Diógenes é escrito, revisado e publicado, e o compromisso com as regras do CFM sobre publicidade médica.',
  alternates: { canonical: '/politica-editorial' },
}

const blocos: BlocoTexto[] = [
  { tipo: 'h2', texto: 'Quem responde pelo conteúdo' },
  {
    tipo: 'p',
    texto: `Todo o conteúdo publicado neste site é escrito ou revisado pelo Dr. Érico Diógenes, ${site.crm} · ${site.rqe}, urologista responsável pela publicação. Não existe assinatura genérica: nenhum texto vai ao ar sem passar por ele.`,
  },
  {
    tipo: 'p',
    texto: 'A produção dos textos pode contar com apoio de redação, mas a revisão técnica e a decisão de publicar são sempre do médico responsável. A lista completa do que ele assina está na página [sobre o Dr. Érico Diógenes](/dr-erico-diogenes).',
  },

  { tipo: 'h2', texto: 'O que publicamos, e o que não' },
  {
    tipo: 'p',
    texto: 'O site tem duas seções com papéis diferentes. O [blog](/blog) trata de assuntos que não envelhecem, como o que é a técnica HoLEP ou o que significa um PSA alterado. A seção de [notícias](/noticias) trata de fatos com data: um estudo publicado, uma decisão regulatória, uma campanha de saúde, uma tecnologia que chegou a Fortaleza.',
  },
  {
    tipo: 'p',
    texto: 'Não publicamos como notícia aquilo que é promoção do próprio consultório. "O Dr. Érico realizou mais uma cirurgia" é publicidade, não é notícia, e não entra na seção de notícias. O critério é simples: se a informação só interessa a quem produz, e não a quem lê, ela não é notícia.',
  },

  { tipo: 'h2', texto: 'Conteúdo original' },
  {
    tipo: 'p',
    texto: 'Quando um assunto chega até nós por meio de uma matéria publicada em outro veículo, o texto daqui é original e traz a leitura do Dr. Érico sobre o tema. Nunca reproduzimos o texto do veículo.',
  },
  {
    tipo: 'p',
    texto: 'Toda notícia indica, de forma visível, qual foi a publicação de origem e traz o link para ela. O leitor pode sempre ir à fonte.',
  },

  { tipo: 'h2', texto: 'Publicidade médica e as regras do CFM' },
  {
    tipo: 'p',
    texto: 'O conteúdo segue a Resolução CFM nº 2.336/2023, que trata da publicidade médica. Isso significa, na prática:',
  },
  {
    tipo: 'lista',
    itens: [
      'Não prometemos resultado, nem garantimos cura.',
      'Não publicamos imagens de antes e depois de pacientes.',
      'Não divulgamos depoimento de paciente como forma de atrair clientela.',
      'Não usamos expressões de autopromoção que sugiram superioridade sobre outros profissionais.',
      'Toda indicação de tratamento no texto é acompanhada da ressalva de que a conduta depende de avaliação individual.',
    ],
  },

  { tipo: 'h2', texto: 'Informação não substitui consulta' },
  {
    tipo: 'p',
    texto: 'Nenhum texto deste site substitui a consulta médica. O conteúdo é informativo e serve para que o paciente chegue mais bem informado ao consultório, não para que ele decida sozinho sobre diagnóstico ou tratamento.',
  },
  {
    tipo: 'p',
    texto: 'Em caso de sintoma agudo, procure atendimento presencial.',
  },

  { tipo: 'h2', texto: 'Atualização dos textos' },
  {
    tipo: 'p',
    texto: 'Medicina muda. Quando a recomendação sobre um tema se altera, o texto correspondente é revisado e a data de atualização passa a constar na página.',
  },
  {
    tipo: 'p',
    texto: 'Só marcamos um texto como atualizado quando o conteúdo mudou de verdade. Ajuste de formatação, correção de digitação ou alteração visual não geram nova data, porque isso tornaria a informação de data inútil para quem lê.',
  },

  { tipo: 'h2', texto: 'Erros' },
  {
    tipo: 'p',
    texto: 'Erros acontecem e são corrigidos de forma aberta. O procedimento está descrito na [política de correções](/politica-de-correcoes).',
  },
]

export default function PoliticaEditorial() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Política Editorial', item: `${SITE_URL}/politica-editorial` },
    ],
  }

  return (
    <>
      <PaginaInstitucional
        titulo="Política Editorial"
        resumo="Como o conteúdo deste site é escrito, revisado e publicado, e quem responde por ele."
        atualizadoEm="2 de outubro de 2026"
        blocos={blocos}
      />
    </>
  )
}
