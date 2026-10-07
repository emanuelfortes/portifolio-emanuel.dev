import type { Metadata } from 'next'
import PaginaInstitucional, { type BlocoTexto } from '@/demos/dr-erico/components/ui/PaginaInstitucional'
import { site } from '@/demos/dr-erico/data/site'

const SITE_URL = 'https://drericodiogenes.com.br'

export const metadata: Metadata = {
  title: { absolute: 'Política de Privacidade | Dr. Érico Diógenes' },
  description:
    'Quais dados o site do Dr. Érico Diógenes coleta, para quê, com quem compartilha e como exercer seus direitos pela LGPD.',
  alternates: { canonical: '/politica-de-privacidade' },
}

const blocos: BlocoTexto[] = [
  { tipo: 'h2', texto: 'O que este site não faz' },
  {
    tipo: 'p',
    texto: 'Começando pelo que costuma preocupar mais: este site não tem formulário. Não pedimos nome, e-mail, telefone, CPF nem qualquer dado de saúde para você navegar. Não há cadastro, não há login e não há área restrita.',
  },
  {
    tipo: 'p',
    texto: 'Nenhuma informação sobre sua saúde é coletada aqui. Se você nos procura pelo WhatsApp, a conversa acontece fora do site, no aplicativo, sob as regras dele.',
  },

  { tipo: 'h2', texto: 'O que é coletado automaticamente' },
  {
    tipo: 'p',
    texto: 'Como quase todo site, usamos ferramentas de medição que registram dados de navegação. São elas:',
  },
  {
    tipo: 'lista',
    itens: [
      'Google Analytics, do Google, que registra páginas visitadas, tempo de permanência, origem do acesso, tipo de aparelho e localização aproximada por cidade.',
      'Pixel do Facebook, da Meta, que registra visitas às páginas para medir o resultado de anúncios e formar públicos de remarketing.',
    ],
  },
  {
    tipo: 'p',
    texto: 'Essas ferramentas usam cookies e identificadores guardados no seu navegador. Elas não recebem seu nome nem qualquer informação clínica, porque o site não os coleta.',
  },

  { tipo: 'h2', texto: 'Para que usamos' },
  {
    tipo: 'p',
    texto: 'Para entender quais conteúdos são procurados, corrigir o que está confuso e medir se os anúncios estão alcançando quem procura um urologista. Não usamos esses dados para tomar decisão automatizada sobre ninguém.',
  },
  {
    tipo: 'p',
    texto: 'A base legal é o legítimo interesse, no caso da medição de audiência, e o consentimento, no caso dos cookies de publicidade, nos termos da Lei nº 13.709/2018 (LGPD).',
  },

  { tipo: 'h2', texto: 'Com quem é compartilhado' },
  {
    tipo: 'p',
    texto: 'Com o Google e com a Meta, operadores das ferramentas acima, que tratam os dados conforme as próprias políticas. Não vendemos dados, não cedemos cadastros e não enviamos informação a terceiros fora disso.',
  },
  {
    tipo: 'p',
    texto: 'O site é hospedado na Vercel, que registra dados técnicos de acesso para funcionamento e segurança, como endereço IP e tipo de navegador.',
  },

  { tipo: 'h2', texto: 'Como recusar' },
  {
    tipo: 'p',
    texto: 'Você pode bloquear cookies nas configurações do seu navegador, usar o modo anônimo, ou instalar a extensão oficial do Google que desativa o Analytics. O site continua funcionando normalmente sem eles.',
  },

  { tipo: 'h2', texto: 'Seus direitos' },
  {
    tipo: 'p',
    texto: 'A LGPD garante a você o direito de confirmar se há tratamento de dados seus, acessá-los, corrigi-los, pedir anonimização ou eliminação, saber com quem foram compartilhados e revogar consentimento.',
  },
  {
    tipo: 'p',
    texto: `Para exercer qualquer um deles, escreva para ${site.email}. Respondemos no prazo da lei.`,
  },

  { tipo: 'h2', texto: 'Prontuário é outra coisa' },
  {
    tipo: 'p',
    texto: 'Os dados de pacientes atendidos em consultório não têm relação com este site. Eles seguem as regras de sigilo médico e de guarda de prontuário previstas na legislação e nas resoluções do Conselho Federal de Medicina, e não são tratados aqui.',
  },

  { tipo: 'h2', texto: 'Mudanças' },
  {
    tipo: 'p',
    texto: 'Se esta política mudar, a data de atualização no topo da página muda junto. Alterações relevantes ficam registradas nesta página.',
  },
]

export default function PoliticaDePrivacidade() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Política de Privacidade', item: `${SITE_URL}/politica-de-privacidade` },
    ],
  }

  return (
    <>
      <PaginaInstitucional
        titulo="Política de Privacidade"
        resumo="Quais dados este site coleta, para quê, com quem compartilha e como você pode recusar ou pedir exclusão."
        atualizadoEm="2 de outubro de 2026"
        blocos={blocos}
      />
    </>
  )
}
