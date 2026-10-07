/**
 * Gera as imagens da vitrine de projetos a partir das capturas em docs/.
 *
 * Cada projeto vira dois arquivos em public/shots:
 *   <slug>-thumb.webp  recorte do topo, 16:10, carregado junto com o card
 *   <slug>.webp        a página inteira, carregada só quando o visitante interage
 *
 * A separação existe porque as capturas originais chegam a 10.550px de altura e
 * 17 MB. Carregar isso em três cards de uma vez inviabiliza a home, então o card
 * mostra o recorte leve e a captura completa só desce no hover ou no clique.
 *
 * Rodar com: node scripts/shots.mjs
 */

import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DOCS = "docs";
const OUT = path.join("public", "shots");

/** Largura final. As capturas vêm em 1920, e o frame exibe no máximo ~1000px. */
const WIDTH = 1280;
/** Altura do recorte do topo, em pixels da imagem ORIGINAL (antes do resize). */
const THUMB_SOURCE_HEIGHT = 1200;

/**
 * Qual captura vira qual projeto. A chave é o slug usado em data/projects.ts e
 * o valor é um trecho do nome do arquivo, porque os nomes trazem timestamp.
 */
const MAP = {
  sigafibra: "143-95-214-125-3001-2026-10-06-23_58_02",
  lexcursos: "lexcursos-site-admin-courses",
  "dr-erico": "drericodiogenes",
};

const kb = (n) => (n / 1024).toFixed(0) + " KB";

async function build(slug, match, files) {
  const file = files.find((f) => f.includes(match));
  if (!file) {
    console.log(`  ${slug}: nenhuma captura casou com "${match}"`);
    return;
  }

  const src = path.join(DOCS, file);
  const original = (await stat(src)).size;
  const meta = await sharp(src).metadata();

  // Página inteira. O esforço 6 custa alguns segundos a mais e economiza banda.
  const fullPath = path.join(OUT, `${slug}.webp`);
  const full = await sharp(src)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 74, effort: 6 })
    .toFile(fullPath);

  // Recorte do topo. Cortamos ANTES do resize para a proporção sair exata.
  const cropHeight = Math.min(THUMB_SOURCE_HEIGHT, meta.height);
  const thumbPath = path.join(OUT, `${slug}-thumb.webp`);
  const thumb = await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(thumbPath);

  console.log(
    `  ${slug.padEnd(11)} ${String(meta.width + "x" + meta.height).padStart(11)} ${kb(original).padStart(9)}` +
      `  ->  full ${String(full.width + "x" + full.height).padStart(10)} ${kb(full.size).padStart(8)}` +
      `   thumb ${String(thumb.width + "x" + thumb.height).padStart(9)} ${kb(thumb.size).padStart(7)}`
  );

  return { slug, full, thumb, original };
}

const files = (await readdir(DOCS)).filter((f) => /\.png$/i.test(f));
await mkdir(OUT, { recursive: true });

console.log("Gerando vitrine a partir de docs/\n");
const results = [];
for (const [slug, match] of Object.entries(MAP)) {
  const r = await build(slug, match, files);
  if (r) results.push(r);
}

const before = results.reduce((s, r) => s + r.original, 0);
const after = results.reduce((s, r) => s + r.full.size + r.thumb.size, 0);
console.log(
  `\nTotal: ${kb(before)} -> ${kb(after)} ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% menor)`
);
