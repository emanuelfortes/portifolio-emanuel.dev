export interface NavChild {
  label: string
  to: string
  highlight?: boolean
  external?: boolean
}

export interface NavCategory {
  id: string
  label: string
  children: NavChild[]
}

export interface NavItem {
  id: string
  label: string
  href?: string           // direct link, no dropdown
  absoluteHref?: boolean  // when true, skip basePath prefix
  children?: NavChild[] | NavCategory[]
}

export const pfNavConfig: NavItem[] = [
  {
    id: 'pra-sua-casa',
    label: 'Pra sua casa',
    children: [
      { label: 'Internet Fibra', to: '/internet-fibra' },
      { label: 'Hipervelocidade', to: '/hipervelocidade' },
      { label: 'Amigo Indica', to: '/amigo-indica', highlight: true },
    ],
  },
  {
    id: 'telefonia',
    label: 'Telefonia',
    children: [
      { label: 'Fixo', to: '/fixo' },
      { label: 'Celular', to: '/celular/pre-pago' },
    ],
  },
  {
    id: 'aplicativos',
    label: 'Aplicativos',
    href: '/servicos-digitais/veja-mais',
  },
  {
    id: 'atendimento',
    label: 'Atendimento',
    children: [
      { label: 'Canal de Atendimento',        to: 'https://wa.me/558531989550', external: true },
      { label: 'Suporte Técnico',              to: 'https://wa.me/558531989550', external: true },
      { label: 'Autoatendimento Via WhatsApp', to: 'https://wa.me/558531989550', external: true },
      { label: 'Baixe nosso App',              to: '/atendimento/baixe-app', highlight: true },
    ],
  },
]

export const empresaNavConfig: NavItem[] = [
  {
    id: 'servicos',
    label: 'Serviços',
    children: [
      { label: 'Hipervelocidade', to: '/internet/fibra' },
      { label: 'Link Dedicado', to: '/internet/link-dedicado' },
      { label: 'Lan To Lan', to: '/internet/lan-to-lan' },
    ],
  },
  {
    id: 'telefonia',
    label: 'Telefonia',
    children: [
      { label: 'Fixo', to: '/telefonia/fixo' },
      { label: 'Móvel', to: '/telefonia/celular' },
    ],
  },
  {
    id: 'aplicativos',
    label: 'Aplicativos',
    href: '/pessoa-fisica/servicos-digitais/veja-mais',
    absoluteHref: true,
  },
  {
    id: 'atendimento',
    label: 'Atendimento',
    children: [
      { label: 'Canal de Atendimento',        to: 'https://wa.me/558531989555', external: true },
      { label: 'Suporte Técnico',              to: 'https://wa.me/558531989555', external: true },
      { label: 'Autoatendimento Via WhatsApp', to: 'https://wa.me/558531989555', external: true },
      { label: 'Baixe nosso App',              to: '/atendimento/baixe-app', highlight: true },
    ],
  },
]
