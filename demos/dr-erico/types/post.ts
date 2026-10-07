export type PostCategory =
  | 'Cirurgia Robótica'
  | 'Próstata'
  | 'HoLEP'
  | 'Cálculo Renal'
  | 'Tratamento a Laser'
  | 'Cirurgia a Laser'
  | 'Urologista'
  | 'Exames'
  | 'Saúde Masculina'
  | 'Urologia Preventiva'

export type FaqItem = {
  question: string
  answer: string
}

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: PostCategory
  categories?: PostCategory[]
  coverImage: string
  image2?: string
  author: string
  publishedAt: string // ISO date
  updatedAt?: string // ISO date da última edição (gerado por scripts/gerar-datas.js)
  readingTime?: number
  metaTitle?: string
  metaDescription?: string
  faq?: FaqItem[]
}

/**
 * O mínimo que o PostCard lê.
 *
 * Existe para o card servir tanto a post do blog quanto a notícia, sem que um
 * componente visual novo precise ser criado e sem que Noticia tenha de herdar
 * campos de Post que não fazem sentido para ela, como faq ou readingTime.
 */
export type CardData = {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: string
  category: PostCategory
  categories?: PostCategory[]
}
