import type { Block, Section } from "@/demos/cirurgia-mohs/lib/content";
import Markdown from "./Markdown";
import ImagePlaceholder from "./ImagePlaceholder";
import CardGrid from "./CardGrid";
import Faq from "./Faq";
import Indicacao from "./Indicacao";
import { ButtonGroup } from "./CtaBlock";

/** Renderiza a lista de blocos de uma seção com o componente adequado a cada tipo. */
export function Blocks({ blocks, priorityImage = false }: { blocks: Block[]; priorityImage?: boolean }) {
  const firstImageIndex = blocks.findIndex((b) => b.type === "image");
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "markdown":
            return <Markdown key={i} md={block.md} />;
          case "image": {
            const priority = priorityImage && i === firstImageIndex;
            return (
              <ImagePlaceholder
                key={i}
                image={block.image}
                ratio="auto"
                priority={priority}
                className="not-prose my-8"
              />
            );
          }
          case "indicacao":
            return <Indicacao key={i} image={block.image} />;
          case "cards":
            return <CardGrid key={i} items={block.items} />;
          case "buttons":
            return <ButtonGroup key={i} items={block.items} className="my-6" />;
          case "faq":
            return <Faq key={i} items={block.items} />;
          default:
            return null;
        }
      })}
    </>
  );
}

/**
 * Cada H2 do conteúdo vira uma <section> própria, com id para o índice
 * lateral e âncoras. Seções de referências recebem estilo compacto.
 */
export function SectionRenderer({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className={section.isReferences ? "mt-14 border-t border-line pt-8 text-sm text-navy-700 [&_ol]:text-[0.9rem] [&_li]:break-words" : ""}
      data-aos="fade-up"
    >
      <h2 id={`${section.id}-title`}>{section.title}</h2>
      <Blocks blocks={section.blocks} />
    </section>
  );
}
