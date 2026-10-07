import { SONS_DE_AVISO, SOM_NENHUM, type SomDeAviso } from '@/demos/kanban-cev/shared'

/**
 * Os sons dos avisos de peça, do lado de quem ouve.
 *
 * O catálogo é o de `@acev/shared`; aqui só se resolve o arquivo e se toca.
 */

/** O arquivo de um som, ou nulo para `nenhum` e para id que não existe. */
export function arquivoDoSom(id: string | null | undefined): string | null {
  if (!id || id === SOM_NENHUM) return null
  return SONS_DE_AVISO.find((s) => s.id === id)?.arquivo ?? null
}

/** Um `<audio>` por arquivo, reaproveitado: tocar de novo não baixa de novo. */
const cache = new Map<string, HTMLAudioElement>()

/**
 * Toca o som escolhido. Nunca lança.
 *
 * O navegador só deixa tocar depois de a pessoa ter clicado em algo na
 * página desde que a abriu; antes disso `play()` rejeita, e o aviso na tela
 * segue sendo o principal — o som é o reforço.
 */
export function tocarSom(id: SomDeAviso | null | undefined) {
  const arquivo = arquivoDoSom(id)
  if (!arquivo || typeof window === 'undefined') return
  let audio = cache.get(arquivo)
  if (!audio) {
    audio = new Audio(arquivo)
    audio.preload = 'auto'
    cache.set(arquivo, audio)
  }
  audio.currentTime = 0
  void audio.play().catch(() => {})
}
