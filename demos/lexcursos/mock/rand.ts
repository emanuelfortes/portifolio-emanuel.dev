// Gerador pseudoaleatório com semente: os dados de exemplo saem iguais no servidor
// e no navegador (sem diferença de hidratação) e a cada carregamento.
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)],
    chance: (p: number) => next() < p,
  };
}

/** Id no formato cuid (como os do Prisma), determinístico. */
export function cuid(seed: number) {
  const r = rng(seed * 7919 + 13);
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "cm";
  for (let i = 0; i < 23; i++) s += chars[Math.floor(r.next() * chars.length)];
  return s;
}
