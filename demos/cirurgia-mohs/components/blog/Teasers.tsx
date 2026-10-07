import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { ContentPage, ImageSpec } from "@/demos/cirurgia-mohs/lib/content";
import { pageKey, slugify } from "@/demos/cirurgia-mohs/lib/content";
import { slot } from "@/demos/cirurgia-mohs/config/images";
import ImagePlaceholder, { type Ratio } from "@/demos/cirurgia-mohs/components/content/ImagePlaceholder";

/** Imagem de capa: a primeira [IMAGEM] da página ou um espaço reservado. */
export function postImage(post: ContentPage): ImageSpec {
  return post.images[0] ?? slot(`${pageKey(post.slug)}-capa`, "imagem de capa do artigo", post.fm.h1);
}

/** Etiqueta de categoria (link para a listagem da categoria quando houver). */
export function CategoryEyebrow({ post, className = "" }: { post: ContentPage; className?: string }) {
  const label =
    post.fm.categoria ?? (post.source === "area-medica" ? "Área médica" : post.source === "paginas" ? "Guia" : "Blog");
  return post.fm.categoria ? (
    <Link href={`/blog/categoria/${slugify(post.fm.categoria)}`} className={`eyebrow hover:underline ${className}`}>
      {label}
    </Link>
  ) : (
    <span className={`eyebrow ${className}`}>{label}</span>
  );
}

const thumbCols = {
  56: "grid-cols-[56px_1fr]",
  72: "grid-cols-[72px_1fr]",
  80: "grid-cols-[80px_1fr]",
  96: "grid-cols-[96px_1fr]",
} as const;
export type Thumb = keyof typeof thumbCols;

/**
 * Chamada de artigo com imagem em cima no desktop que vira linha
 * "miniatura quadrada | texto" no celular (docs/HANDOFF.md §3.5, §4.5, §5.4).
 */
export function TeaserColumn({
  post,
  ratio = "16/10",
  thumb = 72,
  titleClass = "text-[21px]",
  showSummary = false,
  className = "",
  dark = false,
}: {
  post: ContentPage;
  ratio?: Ratio;
  thumb?: Thumb;
  titleClass?: string;
  showSummary?: boolean;
  className?: string;
  /** true quando a chamada está sobre fundo navy */
  dark?: boolean;
}) {
  return (
    <article className={`grid items-start gap-4 ${thumbCols[thumb]} md:block ${className}`} data-aos="fade-up">
      <Link href={post.slug} tabIndex={-1} aria-hidden="true" className="block">
        <ImagePlaceholder
          image={postImage(post)}
          ratio={ratio}
          frame
          tone={dark ? "dark" : "light"}
          className="max-md:aspect-square"
          sizes="(min-width: 768px) 400px, 100px"
        />
      </Link>
      <div>
        <CategoryEyebrow post={post} className={dark ? "text-accent-500" : ""} />
        <h3 className={`mt-1 leading-snug md:mt-3 ${dark ? "text-paper" : "text-navy"} ${titleClass}`}>
          <Link href={post.slug} className={dark ? "hover:text-accent-500" : "hover:text-gold"}>
            {post.fm.h1}
          </Link>
        </h3>
        {showSummary && (
          <p className={`mt-2 hidden text-[13px] leading-relaxed md:block ${dark ? "text-navy-200" : "text-ink-muted"}`}>
            {post.fm.description}
          </p>
        )}
        <p className={`mt-2 text-[11px] ${dark ? "text-navy-300" : "text-muted"}`}>{post.readingTime} min de leitura</p>
      </div>
    </article>
  );
}

/** Item só texto da "lista de jornal" (docs/HANDOFF.md §4.6). */
export function TeaserText({ post }: { post: ContentPage }) {
  return (
    <article className="border-b border-line py-5 md:first:pt-0">
      <CategoryEyebrow post={post} />
      <h3 className="mt-2 text-[19px] leading-snug text-navy">
        <Link href={post.slug} className="hover:text-gold">
          {post.fm.h1}
        </Link>
      </h3>
      <p className="mt-2 text-[11px] text-muted">{post.readingTime} min de leitura</p>
    </article>
  );
}
