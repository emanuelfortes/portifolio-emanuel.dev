import type { ImageSpec } from "@/demos/cirurgia-mohs/lib/content";
import ImagePlaceholder from "./ImagePlaceholder";

/**
 * Espaço de indicação de médico ou serviço ([INDICACAO] no conteúdo; ver
 * docs/01-reposicionamento-portal.md §2): quadro 3:1 com o rótulo "Indicação
 * do portal". Enquanto não houver arte registrada para o id, aparece o
 * espaço reservado com o contexto do espaço.
 */
export default function Indicacao({ image }: { image: ImageSpec }) {
  return (
    <aside className="not-prose my-8" aria-label="Indicação do portal">
      <p className="eyebrow">Indicação do portal</p>
      <ImagePlaceholder image={image} ratio="3/1" className="mt-2" sizes="(min-width: 1024px) 760px, 100vw" />
    </aside>
  );
}
