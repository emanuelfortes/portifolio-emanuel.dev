/**
 * Gerar o PDF de UM pedaço da tela, pela impressão do navegador.
 *
 * Sem biblioteca de PDF de propósito. Diagramar à mão com jsPDF exigiria
 * quebrar linha na unha, embutir fonte para os acentos saírem e reimplementar
 * o markdown — muito código para um resultado pior. A impressão do navegador
 * entrega texto selecionável, tipografia de verdade e quebra de página
 * automática, e todo sistema tem "Salvar como PDF" no destino.
 *
 * O preço é honesto: abre o diálogo de impressão em vez de baixar direto.
 *
 * ---------------------------------------------------------------------------
 * Duas coisas que a impressão ingênua erraria:
 *
 * 1. TEMA. O app abre no escuro. Imprimir assim mandaria uma página preta para
 *    o papel — e para o PDF. Por isso o tema claro é forçado enquanto imprime,
 *    reusando o próprio `data-theme` em vez de duplicar a paleta num bloco
 *    `@media print` que sairia do lugar na primeira mudança de cor.
 *
 * 2. O RESTO DA TELA. Sem recorte, o PDF sairia com barra lateral, cabeçalho e
 *    as outras onze seções. O `data-imprimir` marca o alvo e o CSS esconde o
 *    que não é ele.
 * ---------------------------------------------------------------------------
 */
export function imprimirElemento(alvo: HTMLElement | null) {
  if (!alvo) return

  const raiz = document.documentElement
  const temaAntes = raiz.getAttribute('data-theme')

  alvo.setAttribute('data-imprimir', '')
  raiz.setAttribute('data-imprimindo', '')
  raiz.setAttribute('data-theme', 'light')

  /**
   * A limpeza vive no `afterprint`, e não logo depois do `print()`.
   *
   * Em quase todo navegador `window.print()` bloqueia até o diálogo fechar,
   * mas não em todos — e onde não bloqueia, limpar na linha seguinte
   * desmontaria o recorte ANTES de o navegador desenhar a página, gerando um
   * PDF da tela inteira no tema escuro. `once: true` evita empilhar ouvintes
   * a cada impressão.
   */
  const limpar = () => {
    alvo.removeAttribute('data-imprimir')
    raiz.removeAttribute('data-imprimindo')
    if (temaAntes) raiz.setAttribute('data-theme', temaAntes)
    else raiz.removeAttribute('data-theme')
  }

  window.addEventListener('afterprint', limpar, { once: true })
  window.print()
}
