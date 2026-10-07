import Link from '@/demos/dr-erico/lib/Link'
import { ArrowRight } from 'lucide-react'
import type { CardData } from '@/demos/dr-erico/types/post'

type Props = {
  post: CardData
  compact?: boolean
  /**
   * Prefixo da URL do item. O blog usa /blog, as notícias usam /noticias.
   *
   * O caminho estava escrito direto no componente. Como a seção de notícias
   * reaproveita o mesmo card, por exigência do plano de não criar componente
   * visual novo, o prefixo virou parâmetro. Nada muda na aparência.
   */
  base?: string
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PostCard({ post, compact = false, base = '/blog' }: Props) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-card flex flex-col h-full">
      <Link href={`${base}/${post.slug}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt={post.title}
          className={`w-full object-cover ${compact ? 'h-40' : 'h-52'}`}
          loading="lazy"
        />
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 items-center text-xs">
          {(post.categories ?? [post.category]).map((cat) => (
            <span key={cat} className="bg-brand-green/20 text-brand-green-dark uppercase tracking-wide px-2 py-1 rounded-md font-semibold">
              {cat}
            </span>
          ))}
          <span className="text-brand-muted">{formatDate(post.publishedAt)}</span>
        </div>

        <h3 className="mt-3 font-display text-lg md:text-xl text-brand-navy leading-snug line-clamp-2">
          <Link href={`${base}/${post.slug}`} className="hover:text-brand-gold">
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-brand-muted line-clamp-3 flex-1">{post.excerpt}</p>

        <Link
          href={`${base}/${post.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-brand-gold font-medium text-sm hover:gap-3 transition-all"
        >
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}
