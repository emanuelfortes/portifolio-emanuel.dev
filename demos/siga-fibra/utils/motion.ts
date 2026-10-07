/**
 * Transições compartilhadas.
 *
 * O painel se atualiza sozinho a cada 30s. Sem transição, o número trocava
 * de golpe e a barra pulava; com ela, o valor "sobe" até o novo.
 */

// Desaceleração no fim: o movimento começa rápido e assenta no valor final
export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const DURACAO = 700

export const TRANSICAO_BARRA = `width ${DURACAO}ms ${EASE}`
export const TRANSICAO_ALTURA = `height ${DURACAO}ms ${EASE}`
export const TRANSICAO_COR = 'background-color 400ms ease-out'
export const TRANSICAO_FLEX = `flex-grow ${DURACAO}ms ${EASE}`

/** Quem pediu menos animação no sistema não deve receber tween nenhum */
export function prefereMenosMovimento(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}
