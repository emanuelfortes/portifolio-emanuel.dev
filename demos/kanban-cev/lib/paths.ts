// Todas as rotas da réplica ficam sob este prefixo (o portfólio a carrega num iframe).
export const BASE = '/demo/kanban-cev'

/**
 * Caminho do app original ("/demandas/123") → caminho da réplica.
 *
 * Link externo, âncora e `mailto:` passam intactos. A Home do original é
 * `/inicio`; aqui ela também responde na raiz da réplica.
 */
export const to = (path: string) => {
  if (!path.startsWith('/') || path.startsWith(BASE)) return path
  return `${BASE}${path === '/' ? '' : path}`
}

/** Arquivo em public/demos/kanban-cev. */
export const asset = (file: string) => `/demos/kanban-cev/${file.replace(/^\//, '')}`
