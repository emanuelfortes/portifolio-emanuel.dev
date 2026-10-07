/**
 * Gera as imagens de espera de cada réplica:
 *   public/demos/<projeto>/poster.webp         monitor (versão desktop)
 *   public/demos/<projeto>/poster-mobile.webp  iPhone (versão mobile)
 *
 * O aparelho do card carrega a réplica num iframe, e isso leva alguns
 * segundos: é um app inteiro, e no `next dev` o código vem sem otimização. Em
 * vez de uma tela vazia nesse intervalo, o card mostra na hora uma captura da
 * tela inicial e troca pelo site ao vivo quando ele termina de carregar.
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

/** Mesmos viewports em que o DemoMonitor renderiza a réplica. */
const DEVICES = [
  {
    file: "poster.webp",
    context: { viewport: { width: 1440, height: 900 } },
    /* O card exibe a tela com até ~400px; 960 cobre telas de densidade 2x. */
    width: 960,
  },
  {
    file: "poster-mobile.webp",
    /* iPhone 17. isMobile e hasTouch fazem o site se comportar como no
       aparelho, não só encolher. */
    context: {
      viewport: { width: 402, height: 874 },
      deviceScaleFactor: 1.25,
      isMobile: true,
      hasTouch: true,
    },
    /* O iPhone do card tem ~220px de tela; 480 cobre densidade 2x. */
    width: 480,
  },
];

/* Lê os caminhos das demos direto de data/projects.ts, sem duplicar a lista. */
const source = await readFile("data/projects.ts", "utf8");
const paths = [...source.matchAll(/path:\s*"(\/demo\/[^"]+)"/g)].map((m) => m[1]);

const browser = await chromium.launch({ channel: "msedge" });

for (const device of DEVICES) {
  const context = await browser.newContext(device.context);
  const page = await context.newPage();

  for (const demoPath of paths) {
    const slug = demoPath.replace("/demo/", "");
    await page.goto(BASE + demoPath, { waitUntil: "networkidle", timeout: 180_000 });
    // Gráficos e números animados assentam em menos de 1s; a folga cobre fontes
    await page.waitForTimeout(2500);

    const png = await page.screenshot();
    const out = path.join("public", "demos", slug, device.file);
    const info = await sharp(png)
      .resize({ width: device.width })
      .webp({ quality: 78, effort: 6 })
      .toFile(out);
    console.log(`  ${slug.padEnd(16)} ${out}  ${(info.size / 1024).toFixed(0)} KB`);
  }

  await context.close();
}

await browser.close();
