import rotas from "./routes.json";

/**
 * Endereços internos da réplica.
 *
 * O site original vive na raiz do domínio (/cirurgia-de-mohs, /blog/...). Aqui
 * ele roda sob /demo/cirurgia-mohs, então todo link interno passa por
 * demoHref(), que põe o prefixo e, se o destino não existir nesta cópia,
 * aponta para a página portada mais próxima em vez de cair num 404.
 *
 * routes.json é a lista de todas as páginas geradas pelo original: um slug por
 * arquivo .md de content/, mais a listagem do blog, as categorias e a paginação.
 */
export const BASE = "/demo/cirurgia-mohs";

const ROTAS = new Set<string>(rotas as string[]);

function resolver(caminho: string): string {
  let p = caminho.replace(/\/+$/, "") || "/";
  while (p !== "/" && !ROTAS.has(p)) {
    p = p.slice(0, p.lastIndexOf("/")) || "/";
  }
  return p;
}

/** Converte um href do site original para o endereço dentro da demo. */
export function demoHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === BASE || href.startsWith(BASE + "/") || href.startsWith(BASE + "#")) return href;
  const m = /^([^?#]*)([?#].*)?$/.exec(href);
  const caminho = m?.[1] || "/";
  const resto = m?.[2] ?? "";
  const destino = resolver(caminho);
  return (destino === "/" ? BASE : BASE + destino) + resto;
}

/** Caminho atual sem o prefixo da demo, como o site original o enxerga. */
export function stripBase(pathname: string): string {
  if (pathname === BASE) return "/";
  if (pathname.startsWith(BASE + "/")) return pathname.slice(BASE.length);
  return pathname;
}
