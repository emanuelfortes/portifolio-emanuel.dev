// Todas as rotas da réplica ficam sob este prefixo (o portfólio a carrega num iframe).
export const BASE = "/demo/lexcursos";

/** Caminho do app original ("/admin/courses") → caminho da réplica. */
export const to = (path: string) => (path.startsWith("/") ? `${BASE}${path === "/" ? "" : path}` : path);

/** Arquivo em public/demos/lexcursos. */
export const asset = (file: string) => `/demos/lexcursos/${file.replace(/^\//, "")}`;
