import type { ImageSpec } from "@/demos/cirurgia-mohs/lib/content";
import manifest from "./images.manifest.json";

/**
 * Mapa de imagens ilustrativas.
 *
 * Cada [IMAGEM: ...] do conteúdo recebe um identificador estável
 * (veja docs/imagens-necessarias.md). Enquanto o id não estiver neste mapa,
 * o site mostra um espaço reservado com a descrição do que a imagem precisa
 * conter.
 *
 * O caminho normal é soltar as fotos em public/imagens-blog, com o nome igual
 * ao id ou à descrição do espaço, e rodar `npm run imagens`: o script converte
 * para WebP em /public/images e registra em images.manifest.json. Entradas
 * manuais podem ser adicionadas abaixo e têm prioridade sobre o manifesto:
 *
 *   "cirurgia-de-mohs-01": { src: "/images/cirurgia-de-mohs-etapas.webp", width: 1600, height: 900 },
 *
 * Além das imagens do conteúdo, o layout tem espaços fixos:
 *   "home-01" + "home-01-b" → as duas fotos do hero da home, em transição suave
 *                             (21:9; a base fica coberta pela seção seguinte)
 *   "autor-retrato"         → foto do médico (redonda; abertura e bloco do autor nos artigos)
 *   "contato-consultorio"   → consultório ou recepção (card de contato na lateral dos
 *                             artigos); sem a foto, o card aparece sem imagem, em vez
 *                             do espaço reservado
 *   "<pagina>-fundo"        → fundo do cabeçalho escuro da página, sob a película navy
 *                             (ex.: "cirurgia-de-mohs-fundo"); opcional
 *   "home-fundo" + "-b"/"-c" → fundo do hero da home; havendo 2 ou 3, elas se
 *                             alternam em transição lenta
 */
/** `og`: versão JPG 1200×630 para a prévia do link (WhatsApp, redes), gerada por `npm run imagens`. */
export type ImageAsset = { src: string; width: number; height: number; og?: string };


const manual: Record<string, ImageAsset> = {};

export const images: Record<string, ImageAsset> = { ...(manifest as Record<string, ImageAsset>), ...manual };

/** Espaço fixo de imagem do layout (fora dos arquivos .md). */
export function slot(id: string, description: string, alt: string): ImageSpec {
  return { id, description, alt, suggestedFile: `${id}.webp`, page: "layout" };
}
