import rotas from './routes.json'

/**
 * Endereços internos da réplica.
 *
 * O site original vive na raiz do domínio (/holep, /blog/...). Aqui ele roda
 * sob /demo/dr-erico, então todo link interno passa por demoHref(), que põe
 * o prefixo e, se o destino não existir nesta cópia, aponta para a página
 * portada mais próxima em vez de cair num 404.
 */
export const BASE = '/demo/dr-erico'

const ROTAS = new Set<string>(rotas as string[])

/** Redirecionamentos do next.config.js original que ainda recebem links. */
const REDIRECTS: Record<string, string> = {
  '/urologia/urologista-fortaleza': '/',
  '/tratamentos/holep': '/holep',
  '/condicoes-urologicas/prostata/holep': '/holep',
  '/condicoes-urologicas/uro-oncologia/cancer-prostata': '/condicoes-urologicas/prostata/cancer-prostata',
  '/blog/cirurgia-robotica-vs-laparoscopia': '/blog/cirurgia-robotica-x-laparoscopia',
  '/blog/como-funciona-e-quando-e-indicada-para-prostata-ou-calculo-renal':
    '/blog/cirurgia-robotica-o-que-e-indicacoes-beneficios',
  '/sobre': '/dr-erico-diogenes',
  '/agendamento': '/contato',
}

function resolver(caminho: string): string {
  let p = caminho.replace(/\/+$/, '') || '/'
  if (REDIRECTS[p]) p = REDIRECTS[p]
  while (p !== '/' && !ROTAS.has(p)) {
    p = p.slice(0, p.lastIndexOf('/')) || '/'
  }
  return p
}

/** Converte um href do site original para o endereço dentro da demo. */
export function demoHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (href === BASE || href.startsWith(BASE + '/') || href.startsWith(BASE + '#')) return href
  const m = /^([^?#]*)([?#].*)?$/.exec(href)
  const caminho = m?.[1] || '/'
  const resto = m?.[2] ?? ''
  const destino = resolver(caminho)
  return (destino === '/' ? BASE : BASE + destino) + resto
}

/** Caminho atual sem o prefixo da demo, como o site original o enxerga. */
export function stripBase(pathname: string): string {
  if (pathname === BASE) return '/'
  if (pathname.startsWith(BASE + '/')) return pathname.slice(BASE.length)
  return pathname
}
