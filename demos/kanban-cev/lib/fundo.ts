/**
 * O papel de parede da pessoa.
 *
 * A verdade mora no banco e chega pela sessão (`fundoUrl` e `fundoVeu` em
 * `SessionUser`). Mas a sessão é uma requisição, e requisição chega DEPOIS do
 * primeiro quadro: aplicar só quando ela responde faria a tela abrir no
 * gradiente do tema e trocar de cara na frente de quem olha, em toda
 * navegação.
 *
 * Por isso a escolha é espelhada no `localStorage` e reaplicada antes da
 * primeira pintura, pelo script do `layout.tsx` — o mesmo arranjo que o tema
 * já usa. O espelho não é a verdade: ele é corrigido assim que a sessão
 * responde, o que cobre trocar de fundo em outro aparelho ou sair da conta.
 */
export const FUNDO_STORAGE = 'acev-fundo'

/** O que fica guardado no navegador. Nulo quando a pessoa usa o tema puro. */
export interface FundoSalvo {
  url: string
  /** 0 a 100, como vem do banco. */
  veu: number
  /** Enquadramento em porcentagem. 50/50 é o centro. */
  posX: number
  posY: number
}

/**
 * Escreve as variáveis que o `globals.css` consome.
 *
 * `null` volta ao padrão: imagem `none` e véu zerado. Zerar o véu importa —
 * deixá-lo aceso sem foto abafaria o gradiente da marca com uma camada da
 * própria cor dele, escurecendo o tema sem que ninguém pedisse.
 */
export function aplicarFundo(fundo: FundoSalvo | null) {
  const raiz = document.documentElement.style
  if (!fundo) {
    raiz.setProperty('--bg-imagem', 'none')
    raiz.setProperty('--bg-veu', '0')
    raiz.removeProperty('--bg-posicao')
    return
  }
  raiz.setProperty('--bg-imagem', `url("${fundo.url}")`)
  raiz.setProperty('--bg-veu', String(fundo.veu / 100))
  raiz.setProperty('--bg-posicao', `${fundo.posX}% ${fundo.posY}%`)
}

/** Aplica e espelha, para o próximo carregamento já abrir certo. */
export function salvarFundo(fundo: FundoSalvo | null) {
  aplicarFundo(fundo)
  try {
    if (fundo) localStorage.setItem(FUNDO_STORAGE, JSON.stringify(fundo))
    else localStorage.removeItem(FUNDO_STORAGE)
  } catch {
    // Navegação privativa bloqueia o storage. O fundo vale para esta aba;
    // perder o espelho custa uma piscada no próximo carregamento, nada mais.
  }
}
