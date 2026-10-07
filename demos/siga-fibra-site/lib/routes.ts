/**
 * Endereços internos da réplica.
 *
 * O site original vive na raiz do domínio (/pessoa-fisica/..., /empresa/...).
 * Aqui ele roda sob /demo/siga-fibra-site, então todo link interno passa por
 * demoHref(), que põe o prefixo e, se o destino não foi portado, aponta para a
 * página portada mais próxima em vez de cair num 404.
 */
export const BASE = '/demo/siga-fibra-site'

/** Páginas portadas, como o site original as endereça. */
const ROTAS = new Set<string>([
  '/',
  '/pessoa-fisica/internet-fibra',
  '/pessoa-fisica/checkout',
  '/pessoa-fisica/checkout/mes-das-criancas',
  '/empresa',
])

/**
 * Páginas do original que só redirecionam para o WhatsApp
 * (app/<segmento>/atendimento/*). Aqui viram o próprio link externo.
 */
const WHATSAPP_PF = 'https://wa.me/558531989550'
const WHATSAPP_EMPRESA = 'https://wa.me/558531989555'
const EXTERNOS: Record<string, string> = {
  '/pessoa-fisica/atendimento/canais': WHATSAPP_PF,
  '/pessoa-fisica/atendimento/suporte-tecnico': WHATSAPP_PF,
  '/pessoa-fisica/atendimento/autoatendimento': WHATSAPP_PF,
  '/empresa/atendimento/canais': WHATSAPP_EMPRESA,
  '/empresa/atendimento/suporte-tecnico': WHATSAPP_EMPRESA,
  '/empresa/atendimento/autoatendimento': WHATSAPP_EMPRESA,
}

/** Páginas não portadas com um equivalente melhor que a home do segmento. */
const REDIRECTS: Record<string, string> = {
  '/pessoa-fisica': '/',
  '/pessoa-fisica/hipervelocidade': '/pessoa-fisica/internet-fibra',
}

function resolver(caminho: string): string {
  let p = caminho.replace(/\/+$/, '') || '/'
  if (EXTERNOS[p]) return EXTERNOS[p]
  for (;;) {
    if (REDIRECTS[p]) p = REDIRECTS[p]
    if (p === '/' || ROTAS.has(p)) return p
    p = p.slice(0, p.lastIndexOf('/')) || '/'
  }
}

export function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href)
}

/** Converte um href do site original para o endereço dentro da demo. */
export function demoHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (href === BASE || /^\/demo\/siga-fibra-site[/?#]/.test(href)) return href
  const m = /^([^?#]*)([?#].*)?$/.exec(href)
  const caminho = m?.[1] || '/'
  const resto = m?.[2] ?? ''
  const destino = resolver(caminho)
  if (isExternal(destino)) return destino
  return (destino === '/' ? BASE : BASE + destino) + resto
}

/** Caminho atual sem o prefixo da demo, como o site original o enxerga. */
export function stripBase(pathname: string): string {
  if (pathname === BASE) return '/'
  if (pathname.startsWith(BASE + '/')) return pathname.slice(BASE.length)
  return pathname
}

/** Imagens do public/ original, re-encodadas em public/demos/siga-fibra-site. */
export const IMG = '/demos/siga-fibra-site/img'
