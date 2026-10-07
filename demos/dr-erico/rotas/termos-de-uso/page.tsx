import type { Metadata } from 'next'
import PaginaInstitucional, { type BlocoTexto } from '@/demos/dr-erico/components/ui/PaginaInstitucional'
import { site } from '@/demos/dr-erico/data/site'

const SITE_URL = 'https://drericodiogenes.com.br'

export const metadata: Metadata = {
  title: { absolute: 'Termos de Uso | Dr. Érico Diógenes' },
  description:
    'Condições de uso do site do Dr. Érico Diógenes: finalidade do conteúdo, limites de responsabilidade e direitos sobre o material publicado.',
  alternates: { canonical: '/termos-de-uso' },
}

const blocos: BlocoTexto[] = [
  { tipo: 'h2', texto: 'Para que serve este site' },
  {
    tipo: 'p',
    texto: `Este site apresenta a atuação do Dr. Érico Diógenes, ${site.crm} · ${site.rqe}, urologista em Fortaleza, e publica conteúdo informativo sobre urologia. Ao navegar aqui, você concorda com as condições desta página.`,
  },

  { tipo: 'h2', texto: 'O conteúdo não substitui consulta' },
  {
    tipo: 'p',
    texto: 'Esta é a condição mais importante do documento. Os textos têm finalidade informativa e educativa. Eles não estabelecem relação médico-paciente, não constituem diagnóstico, não indicam tratamento para o seu caso e não substituem a avaliação presencial.',
  },
  {
    tipo: 'p',
    texto: 'Cada pessoa tem um quadro clínico próprio. A mesma queixa pode ter causas diferentes, e a conduta certa depende de exame, histórico e avaliação individual. Nunca inicie, interrompa ou altere tratamento com base no que leu aqui.',
  },
  {
    tipo: 'p',
    texto: 'Diante de sintoma agudo, dor intensa, febre alta, retenção urinária ou sangramento, procure atendimento presencial imediato. Não use este site, nem qualquer site, para decidir se o caso pode esperar.',
  },

  { tipo: 'h2', texto: 'Agendamento e comunicação' },
  {
    tipo: 'p',
    texto: 'O contato por WhatsApp ou e-mail serve para agendar consulta e tirar dúvidas administrativas. Não realizamos atendimento clínico, não damos diagnóstico e não prescrevemos por esses canais.',
  },
  {
    tipo: 'p',
    texto: 'Não envie exames, laudos, fotos ou descrição detalhada de sintomas por esses meios. Além de não permitir avaliação adequada, são canais que não oferecem a segurança exigida para dado de saúde.',
  },

  { tipo: 'h2', texto: 'Conteúdo de terceiros' },
  {
    tipo: 'p',
    texto: 'Algumas páginas trazem links para matérias publicadas em veículos de imprensa e para outros sites. Esses conteúdos são de responsabilidade de quem os publicou, e o link não significa que concordamos com tudo o que está lá.',
  },
  {
    tipo: 'p',
    texto: 'Links externos podem sair do ar ou mudar sem aviso, porque não estão sob nosso controle.',
  },

  { tipo: 'h2', texto: 'Direitos sobre o material' },
  {
    tipo: 'p',
    texto: 'Os textos, as imagens e a identidade visual deste site são protegidos por direito autoral. É permitido citar trechos com indicação da fonte e link para a página original.',
  },
  {
    tipo: 'p',
    texto: 'Não é permitido reproduzir textos por inteiro em outro site, nem usar o nome, a imagem ou a marca do Dr. Érico Diógenes para sugerir vínculo, endosso ou parceria que não existam.',
  },

  { tipo: 'h2', texto: 'Disponibilidade' },
  {
    tipo: 'p',
    texto: 'Procuramos manter o site no ar e as informações corretas, mas não garantimos funcionamento ininterrupto nem ausência de falhas. Conteúdo pode ser alterado ou removido a qualquer momento, e erros são tratados conforme a [política de correções](/politica-de-correcoes).',
  },

  { tipo: 'h2', texto: 'Limites de responsabilidade' },
  {
    tipo: 'p',
    texto: 'Não nos responsabilizamos por decisões tomadas exclusivamente com base no conteúdo publicado aqui, sem avaliação médica, nem por danos decorrentes de indisponibilidade do site ou de conteúdo de terceiros acessado por meio dele.',
  },

  { tipo: 'h2', texto: 'Privacidade' },
  {
    tipo: 'p',
    texto: 'O tratamento de dados de navegação está descrito na [política de privacidade](/politica-de-privacidade). A forma como o conteúdo é produzido e revisado está na [política editorial](/politica-editorial).',
  },

  { tipo: 'h2', texto: 'Foro e contato' },
  {
    tipo: 'p',
    texto: `Estes termos seguem a legislação brasileira, com foro na comarca de Fortaleza, Ceará. Dúvidas podem ser enviadas para ${site.email}.`,
  },
]

export default function TermosDeUso() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Termos de Uso', item: `${SITE_URL}/termos-de-uso` },
    ],
  }

  return (
    <>
      <PaginaInstitucional
        titulo="Termos de Uso"
        resumo="As condições de uso deste site, começando pela principal: o conteúdo informa, mas não substitui consulta."
        atualizadoEm="2 de outubro de 2026"
        blocos={blocos}
      />
    </>
  )
}
