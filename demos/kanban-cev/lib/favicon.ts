/**
 * O favicon que acompanha o tema da página.
 *
 * Existe como módulo, e não como duas strings soltas, porque os caminhos são
 * usados em dois lugares que não se enxergam: o script síncrono do
 * `layout.tsx`, que roda antes de qualquer React e recebe o valor interpolado
 * no texto, e o botão de tema no `shell.tsx`. Separados, o dia em que os
 * arquivos fossem renomeados um dos dois ficaria para trás e a aba mostraria
 * um ícone quebrado só depois de alguém clicar no botão.
 *
 * Por que não `media="(prefers-color-scheme: dark)"`, que dispensaria script:
 * porque aquilo segue o SISTEMA, e aqui quem manda é o botão. O app abre
 * sempre no escuro e só muda por escolha explícita, guardada em
 * `localStorage`. Quem usa o Windows no claro e escolheu o tema escuro veria a
 * aba discordando da tela.
 *
 * Ícone de PWA e imagem de link não entram nesta história: são carimbados na
 * instalação e no cache de quem exibe, fora do alcance da página. Ver
 * `scripts/gerar-icones.mjs`.
 */
export const FAVICON = {
  dark: '/demos/kanban-cev/favicon-dark.png',
  light: '/demos/kanban-cev/favicon-light.png',
} as const

/** O id vive no `<link>` que o `layout.tsx` escreve à mão. */
export const FAVICON_ID = 'favicon'

export function aplicarFavicon(tema: 'dark' | 'light') {
  const link = document.getElementById(FAVICON_ID) as HTMLLinkElement | null
  if (link) link.href = FAVICON[tema]
}
