import type { PostCategory } from './post'

/**
 * Notícia é diferente de post, e a separação é proposital.
 *
 * O post do blog trata de assunto que não envelhece: o que é HoLEP, o que
 * significa um PSA alterado, quando operar a próstata. Ele é marcado como
 * BlogPosting e traz busca o ano inteiro.
 *
 * A notícia tem data de acontecimento: um estudo publicado, uma decisão
 * regulatória, uma campanha, uma tecnologia que chegou a Fortaleza, uma
 * participação do médico na imprensa. Ela é marcada como NewsArticle e entra
 * no sitemap de notícias.
 *
 * Declarar texto atemporal como matéria jornalística é sinal falso, e o Google
 * é mais rigoroso com conteúdo de saúde do que com qualquer outro tema. Por
 * isso os dois vivem em arquivos separados, com tipos separados, e nada impede
 * que a estrutura visual seja a mesma.
 */

/** De onde veio o assunto. Toda notícia tem uma origem verificável. */
export type FonteNoticia = {
  /** Nome do veículo: ACEV News, Repórter Ceará, TV Câmara Fortaleza... */
  veiculo: string
  /** URL da matéria original. Conferida, respondendo 200. */
  url: string
  /** Mês e ano da publicação original. Ex: 'abril de 2026' */
  data: string
}

export type Noticia = {
  id: string
  slug: string
  /** Manchete. Vai para o headline do NewsArticle. */
  title: string
  excerpt: string
  /** Mesmo formato do content dos posts: ## h2, ### h3, - lista, | tabela, **negrito**, [texto](/destino) */
  content: string
  category: PostCategory
  categories?: PostCategory[]
  /**
   * Capa. O NewsArticle pede imagem com pelo menos 1.200px de largura, então
   * aqui só entram arquivos que cumprem isso. Os recortes de /img/midias/ não
   * servem: são prints recortados, menores que o mínimo.
   */
  coverImage: string
  image2?: string
  author: string
  /** Data de publicação NESTE site, não a da matéria de origem. */
  publishedAt: string
  updatedAt?: string
  readingTime?: number
  metaTitle?: string
  metaDescription?: string
  /**
   * A matéria que deu origem ao assunto.
   *
   * Não é opcional de propósito. O conteúdo aqui é original, com a visão do
   * médico, e nunca cópia do que o veículo publicou: texto repetido de outro
   * site tende a ficar como "Rastreada, mas não indexada". Apontar para a
   * origem faz as duas peças se reforçarem em vez de disputarem, e é o que
   * sustenta a notícia como notícia.
   */
  fonte: FonteNoticia
}
