import Image from "next/image";
import type { ImageSpec } from "@/demos/cirurgia-mohs/lib/content";
import { images } from "@/demos/cirurgia-mohs/config/images";
import MagnifierImage from "./MagnifierImage";

/** "auto": a imagem real aparece inteira, na proporção original (o espaço reservado usa 16:9). */
export type Ratio = "3/1" | "21/9" | "16/9" | "16/10" | "4/3" | "4/5" | "1/1" | "auto";

const ratioClass: Record<Ratio, string> = {
  "3/1": "aspect-[3/1]",
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  auto: "aspect-video",
};

const ratioHint: Record<Ratio, string> = {
  "3/1": "1800 × 600 px",
  "21/9": "1920 × 823 px",
  "16/9": "1600 × 900 px",
  "16/10": "1600 × 1000 px",
  "4/3": "1600 × 1200 px",
  "4/5": "1200 × 1500 px",
  "1/1": "1200 × 1200 px",
  auto: "1600 px de largura",
};

/** Imagem de detalhe (fluxograma, infográfico, esquema, mapa, tabela): não se recorta e ganha lupa. */
export function isDetailedImage(image: ImageSpec): boolean {
  return /fluxograma|infogr[aá]fico|esquema|mapa|diagrama|tabela|compara/i.test(image.description);
}

/**
 * Espaço reservado para imagem (docs/HANDOFF.md §2.5).
 *
 * Enquanto a imagem não existir em src/config/images.ts, mostra um quadro
 * liso com borda tracejada e, embaixo, a descrição do que ela precisa
 * conter, o alt, o tamanho e o arquivo sugerido. Quando existir, renderiza
 * a imagem com next/image recortada na mesma proporção (object-cover).
 * `frame` aplica a borda navy de 1px prevista para imagens reais.
 */
export default function ImagePlaceholder({
  image,
  ratio = "16/9",
  priority = false,
  frame = false,
  className = "",
  tone = "light",
  sizes = "(min-width: 1024px) 760px, 100vw",
}: {
  image: ImageSpec;
  ratio?: Ratio;
  priority?: boolean;
  frame?: boolean;
  className?: string;
  /** "dark" para fundos navy (hero) */
  tone?: "light" | "dark";
  sizes?: string;
}) {
  const dark = tone === "dark";
  const frameCls = frame ? (dark ? "border border-paper/30" : "border border-navy") : "";
  const asset = images[image.id];

  /* Dentro do texto: proporção original. Fluxogramas, infográficos, esquemas,
     mapas e tabelas em imagem ganham a lupa (ver MagnifierImage); fotos, não. */
  if (asset && ratio === "auto") {
    const detalhada = isDetailedImage(image);
    return (
      <figure className={`${frameCls} ${className}`}>
        {detalhada ? (
          <MagnifierImage asset={asset} alt={image.alt} priority={priority} sizes={sizes} />
        ) : (
          <Image
            src={asset.src}
            alt={image.alt}
            width={asset.width}
            height={asset.height}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes={sizes}
            className="h-auto w-full"
          />
        )}
      </figure>
    );
  }

  /* Foto em retrato num espaço horizontal: mostra inteira sobre a própria foto desfocada, em vez de recortar. */
  const landscapeBox = ratio === "3/1" || ratio === "21/9" || ratio === "16/9" || ratio === "16/10" || ratio === "4/3";
  if (asset && landscapeBox && asset.height > asset.width) {
    return (
      <figure className={`relative overflow-hidden bg-navy-900 ${ratioClass[ratio]} ${frameCls} ${className}`}>
        <Image src={asset.src} alt="" aria-hidden fill sizes={sizes} className="scale-110 object-cover opacity-50 blur-xl" />
        <Image
          src={asset.src}
          alt={image.alt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          className="object-contain"
        />
      </figure>
    );
  }

  if (asset) {
    return (
      <figure className={`relative overflow-hidden ${ratioClass[ratio]} ${frameCls} ${className}`}>
        <Image
          src={asset.src}
          alt={image.alt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          className="object-cover"
        />
      </figure>
    );
  }

  return (
    <figure
      className={`img-placeholder relative ${dark ? "img-placeholder--dark" : ""} ${ratioClass[ratio]} ${className}`}
      data-image-id={image.id}
      role="img"
      aria-label={image.alt}
    >
      <div className="img-placeholder__body absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
        <p className={`text-[11px] leading-snug sm:text-xs ${dark ? "text-navy-200" : "text-navy-700"}`}>
          <span className="font-semibold uppercase tracking-wider">Imagem · {image.id}</span> · {capitalize(image.description)}
        </p>
        <p className={`mt-1 truncate text-[11px] ${dark ? "text-navy-300" : "text-muted"}`}>
          alt: “{image.alt}” · {ratioHint[ratio]} · {image.suggestedFile}
        </p>
      </div>
    </figure>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
