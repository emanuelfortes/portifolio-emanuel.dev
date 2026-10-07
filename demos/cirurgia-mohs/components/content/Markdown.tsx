import Link from "@/demos/cirurgia-mohs/lib/Link";
import { renderMarkdown } from "@/demos/cirurgia-mohs/lib/md";

/**
 * Renderiza Markdown do conteúdo com HTML semântico:
 * links internos via <Link>, tabelas com rolagem horizontal e ids nos títulos.
 *
 * Réplica: o original usa react-markdown + remark-gfm + rehype-slug (com o
 * plugin rehypeTableLabels, que põe `data-label` nas células). Aqui o mesmo
 * HTML sai de lib/md.tsx, porque essas bibliotecas não estão no portfólio.
 */
export default function Markdown({ md, className = "" }: { md: string; className?: string }) {
  return (
    <div className={className}>
      {renderMarkdown(md, (href, children, key) => {
        if (href.startsWith("/") || href.startsWith("#")) {
          return (
            <Link key={key} href={href}>
              {children}
            </Link>
          );
        }
        return (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      })}
    </div>
  );
}
