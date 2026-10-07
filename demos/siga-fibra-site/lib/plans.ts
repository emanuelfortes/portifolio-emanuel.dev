// ─── Internet (fibra) plans ───────────────────────────────────────────────────

export interface InternetPlan {
  id: string
  name: string
  detail: string
  price: number
  priceAfter: number
}

export const INTERNET_PLANS: InternetPlan[] = [
  { id: 'nitro-600',  name: 'Internet Hipervelocidade', detail: 'SIGA NITRO 600 Mb',     price: 84.90,  priceAfter: 104.90 },
  { id: 'nitro-800',  name: 'Internet Hipervelocidade', detail: 'SIGA NITRO 800 Mb',     price: 99.90,  priceAfter: 119.90 },
  { id: 'nitro-1g',   name: 'Internet Hipervelocidade', detail: 'SIGA NITRO 1 Gb',       price: 109.90, priceAfter: 129.90 },
  { id: 'hiper-flow', name: 'Internet Hipervelocidade', detail: 'SIGA HIPER FLOW 2 Gb',  price: 159.90, priceAfter: 179.90 },
  { id: 'hiper-max',  name: 'Internet Hipervelocidade', detail: 'SIGA HIPER MAX 2.5 Gb', price: 199.90, priceAfter: 219.90 },
]

export const DEFAULT_PLAN = INTERNET_PLANS[0]

export function getPlanById(id?: string): InternetPlan {
  return INTERNET_PLANS.find(p => p.id === id) ?? DEFAULT_PLAN
}

// ─── Chip Móvel plans ─────────────────────────────────────────────────────────

export interface ChipPlan {
  id: string
  name: string
  gb: number
  price: number
  badge?: string
}

export const CHIP_PLANS: ChipPlan[] = [
  { id: 'movel-5gb',  name: 'Chip Móvel 5 GB',  gb: 5,  price: 34.99 },
  { id: 'movel-8gb',  name: 'Chip Móvel 8 GB',  gb: 8,  price: 44.99 },
  { id: 'movel-12gb', name: 'Chip Móvel 12 GB', gb: 12, price: 55.99 },
  { id: 'movel-19gb', name: 'Chip Móvel 19 GB', gb: 19, price: 59.99, badge: 'Popular' },
  { id: 'movel-30gb', name: 'Chip Móvel 30 GB', gb: 30, price: 69.99 },
  { id: 'movel-40gb', name: 'Chip Móvel 40 GB', gb: 40, price: 79.99 },
  { id: 'movel-45gb', name: 'Chip Móvel 45 GB', gb: 45, price: 89.99 },
]

// ─── Streaming / Entretenimento tiers ────────────────────────────────────────

export interface StreamingApp {
  name: string
  icon?: string
  hasAds?: boolean
}

export interface StreamingTier {
  id: string
  name: string
  price: number
  color: string
  apps: StreamingApp[]
}

export const STREAMING_TIERS: StreamingTier[] = [
  {
    id: 'entretenimento-standard',
    name: 'Standard',
    price: 9.90,
    color: '#27CAA3',
    apps: [
      { name: 'Deezer',            icon: '/demos/siga-fibra-site/img/icons/deezer.webp' },
      { name: 'Sky+',              icon: '/demos/siga-fibra-site/img/icons/sky-plus-amazonprime.webp' },
      { name: 'Playkids',          icon: '/demos/siga-fibra-site/img/icons/playkids.webp' },
      { name: 'Looke',             icon: '/demos/siga-fibra-site/img/icons/looke.webp' },
      { name: 'Ubook',             icon: '/demos/siga-fibra-site/img/icons/ubookgo.webp' },
      { name: 'Estuda+',           icon: '/demos/siga-fibra-site/img/icons/estuda-plus.webp' },
      { name: 'Playlist',          icon: '/demos/siga-fibra-site/img/icons/playlist.webp' },
      { name: 'Kiddle Pass',       icon: '/demos/siga-fibra-site/img/icons/kiddlepass.webp' },
      { name: 'Hub Vantagens',     icon: '/demos/siga-fibra-site/img/icons/hubvantagens.webp' },
      { name: 'Social Comics',     icon: '/demos/siga-fibra-site/img/icons/socialcomics.webp' },
      { name: 'Kaspersky 1 Lic',   icon: '/demos/siga-fibra-site/img/icons/kaspersky-standard-1lic.webp' },
      { name: 'Qnutri',            icon: '/demos/siga-fibra-site/img/icons/qnutri.webp' },
      { name: 'Hub Revistas',      icon: '/demos/siga-fibra-site/img/icons/revistaria.webp' },
      { name: 'Fluid',    icon: '/demos/siga-fibra-site/img/icons/fluid.webp' },
      { name: '+Leitura', icon: '/demos/siga-fibra-site/img/icons/mais-leitura.webp' },
    ],
  },
  {
    id: 'entretenimento-advanced',
    name: 'Advanced',
    price: 14.90,
    color: '#03C2C3',
    apps: [
      { name: 'Sky+',            icon: '/demos/siga-fibra-site/img/icons/sky-plus-amazonprime.webp' },
      { name: 'Globoplay',       icon: '/demos/siga-fibra-site/img/icons/globoplay.webp', hasAds: true },
      { name: 'HotGo',           icon: '/demos/siga-fibra-site/img/icons/hotgo.webp' },
      { name: 'Curta On',        icon: '/demos/siga-fibra-site/img/icons/curtaon.webp' },
      { name: 'DocWay',          icon: '/demos/siga-fibra-site/img/icons/docway.webp' },
      { name: 'Kaspersky 3 Lic', icon: '/demos/siga-fibra-site/img/icons/kaspersky-standard-3lic.webp' },
      { name: 'O Jornalista',    icon: '/demos/siga-fibra-site/img/icons/ojornalista.webp' },
    ],
  },
  {
    id: 'entretenimento-top',
    name: 'TOP',
    price: 29.90,
    color: '#f59e0b',
    apps: [
      { name: 'Disney+',          icon: '/demos/siga-fibra-site/img/icons/disney-plus.webp',     hasAds: true },
      { name: 'HBO Max',          icon: '/demos/siga-fibra-site/img/icons/hbo.webp',         hasAds: true },
      { name: 'Prime Video',      icon: '/demos/siga-fibra-site/img/icons/sky-plus-amazonprime.webp' },
      { name: 'Pequenos Leitores',icon: '/demos/siga-fibra-site/img/icons/pequenosleitores.webp' },
      { name: 'CINDIE',           icon: '/demos/siga-fibra-site/img/icons/cindie.webp' },
    ],
  },
  {
    id: 'entretenimento-premium',
    name: 'Premium',
    price: 46.90,
    color: '#a855f7',
    apps: [
      { name: 'Disney+',     icon: '/demos/siga-fibra-site/img/icons/disney-plus.webp' },
      { name: 'HBO Max',     icon: '/demos/siga-fibra-site/img/icons/hbo.webp' },
      { name: 'Globoplay',   icon: '/demos/siga-fibra-site/img/icons/globoplay.webp' },
      { name: 'Kaspersky',   icon: '/demos/siga-fibra-site/img/icons/kaspersky.webp' },
      { name: 'Leitura 360', icon: '/demos/siga-fibra-site/img/icons/leitura360.webp' },
      { name: 'Queima Diária', icon: '/demos/siga-fibra-site/img/icons/qnutri.webp' },
    ],
  },
]

// ─── Checkout add-on categories ───────────────────────────────────────────────

export type CheckoutAddonType = 'simple' | 'chip' | 'streaming'

export interface CheckoutAddonCategory {
  id: string
  name: string
  description: string
  type: CheckoutAddonType
  price?: number
}

export const CHECKOUT_CATEGORIES: CheckoutAddonCategory[] = [
  {
    id: 'celular',
    name: 'Chip Móvel',
    description: 'Escolha seu plano de dados com ligações ilimitadas',
    type: 'chip',
  },
  {
    id: 'entretenimento',
    name: 'Playhub',
    description: 'Streaming, apps e conteúdo ilimitado no seu plano',
    type: 'streaming',
  },
  {
    id: 'fixo',
    name: 'Telefone Fixo',
    description: 'Ligações ilimitadas para qualquer operadora',
    type: 'simple',
    price: 39.90,
  },
]

// ─── Campanha do mês ──────────────────────────────────────────────────────────
// Fonte única da promoção. O combo é vendido como uma linha só: o preço do app
// nunca existe isolado, então não há como aplicá-lo a outro plano.

export interface CampanhaApp {
  name: string
  icon: string
  hasAds?: boolean
}

export interface Campanha {
  id: string
  slug: string
  name: string
  tagline: string
  planId: string
  speed: string
  unit: string
  upload: string
  detail: string
  price: number
  priceFrom: number
  priceAfter: number
  months: number
  apps: CampanhaApp[]
  benefits: string[]
  disclaimer: string
}

export const CAMPANHA: Campanha = {
  id: 'campanha-mes-das-criancas',
  slug: 'mes-das-criancas',
  name: 'Mês das Crianças',
  tagline: 'Dê play na diversão em família!',
  planId: 'nitro-800',
  speed: '800',
  unit: 'Mb',
  upload: '400Mb',
  detail: 'SIGA NITRO 800 Mb + 1 streaming',
  price: 109.90,
  priceFrom: 129.90,
  priceAfter: 129.90,
  months: 12,
  apps: [
    { name: 'Disney+', icon: '/demos/siga-fibra-site/img/icons/disney-plus.webp', hasAds: true },
    { name: 'HBO Max', icon: '/demos/siga-fibra-site/img/icons/hbo.webp',    hasAds: true },
  ],
  benefits: [
    'Internet 100% Fibra Óptica',
    'Roteador Padrão',
    '1 streaming à sua escolha',
  ],
  disclaimer: 'Pacote de streaming com anúncios. Após 12 meses, o valor passa a R$ 129,90/mês. Consulte condições e disponibilidade.',
}

export const CAMPANHA_CHECKOUT_URL = `/pessoa-fisica/checkout/${CAMPANHA.slug}`
