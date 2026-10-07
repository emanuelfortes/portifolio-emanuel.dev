/**
 * Gera a imagem de espera de cada réplica (public/demos/<projeto>/poster.webp).
 *
 * O monitor do card carrega a réplica num iframe, e isso leva alguns segundos:
 * é um app inteiro, e no `next dev` o código vem sem otimização. Em vez de um
 * monitor vazio nesse intervalo, o card mostra na hora uma captura da tela
 * inicial e troca pelo site ao vivo quando ele termina de carregar.
 *
 * Rodar com o servidor de pé:
 *   npm run dev
 *   node scripts/posters.mjs            (usa http://localhost:3000)
 *   node scripts/posters.mjs http://localhost:3100
 *
 * Usa o Edge instalado no sistema (playwright-core não baixa navegador). Para
 * usar o Chrome, troque `channel` para "chrome".
 */

import { chromium } from "playwright-core";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";

/** Mesmo viewport em que o monitor renderiza a réplica (DemoMonitor). */
const VIEWPORT = { width: 1440, height: 900 };
/** O card exibe a tela com até ~400px; 960 cobre telas de densidade 2x. */
const WIDTH = 960;

/* Lê os caminhos das demos direto de data/projects.ts, sem duplicar a lista. */
const source = await readFile("data/projects.ts", "utf8");
const paths = [...source.matchAll(/path:\s*"(\/demo\/[^"]+)"/g)].map((m) => m[1]);

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: VIEWPORT });

for (const demoPath of paths) {
  const slug = demoPath.replace("/demo/", "");
  await page.goto(BASE + demoPath, { waitUntil: "networkidle", timeout: 180_000 });
  // Gráficos e números animados assentam em menos de 1s; a folga cobre fontes
  await page.waitForTimeout(2500);

  const png = await page.screenshot();
  const out = path.join("public", "demos", slug, "poster.webp");
  const info = await sharp(png).resize({ width: WIDTH }).webp({ quality: 78, effort: 6 }).toFile(out);
  console.log(`  ${slug.padEnd(12)} ${out}  ${(info.size / 1024).toFixed(0)} KB`);
}

await browser.close();
