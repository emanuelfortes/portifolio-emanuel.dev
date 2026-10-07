import Link from '@/demos/dr-erico/lib/Link'
import { notFound } from '@/demos/dr-erico/lib/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock, RefreshCw, User } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, posts } from '@/demos/dr-erico/data/posts'
import PostCard from '@/demos/dr-erico/components/ui/PostCard'
import { parseContent, renderBlock, type Block } from '@/demos/dr-erico/components/ui/ConteudoRico'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import AuthorCard from '@/demos/dr-erico/components/blog/AuthorCard'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return posts
    .filter((p) => p.content.length > 200)
    .map((p) => ({ slug: p.slug }))
}

const SITE_URL = 'https://drericodiogenes.com.br'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post não encontrado' }
  const seoTitle = post.metaTitle ?? post.title
  const seoDesc = post.metaDescription ?? post.excerpt
  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: seoTitle,
      description: seoDesc,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ['Dr. Érico Diógenes'],
      images: post.coverImage.startsWith('http')
        ? [{ url: post.coverImage, alt: post.title }]
        : [{ url: `${SITE_URL}${post.coverImage}`, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: post.coverImage.startsWith('http')
        ? [post.coverImage]
        : [`${SITE_URL}${post.coverImage}`],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post, 3)
  const blocks = parseContent(post.content)
  const headings = blocks.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')

  const h2Indices = blocks.reduce<number[]>(
    (acc, b, i) => (b.type === 'h2' ? [...acc, i] : acc),
    [],
  )
  const image2After = h2Indices[1] ?? h2Indices[0] ?? Math.floor(blocks.length / 2)

  const coverUrl = post.coverImage.startsWith('http')
    ? post.coverImage
    : `${SITE_URL}${post.coverImage}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: coverUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: 'Dr. Érico Diógenes',
      url: `${SITE_URL}/dr-erico-diogenes`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dr. Érico Diógenes',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  }

  const faqSchema = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null

  return (
    <>


      {/* Hero */}
      <section className="bg-brand-beige pt-12 pb-10">
        <div className="container-site max-w-5xl">
          <nav className="flex items-center gap-2 text-xs text-brand-muted mb-7">
            <Link href="/" className="hover:text-brand-gold transition-colors">Início</Link>
            <span className="opacity-40">/</span>
            <Link href="/blog" className="hover:text-brand-gold transition-colors">Blog</Link>
            <span className="opacity-40">/</span>
            <span className="text-brand-navy font-medium">{(post.categories ?? [post.category]).join(' · ')}</span>
          </nav>

          <div data-aos="fade-up">
            <div className="flex flex-wrap gap-2 mb-5">
              {(post.categories ?? [post.category]).map((cat) => (
                <span key={cat} className="inline-block bg-brand-gold/15 text-brand-gold-dark text-xs uppercase tracking-widest px-3 py-1 rounded-full font-semibold">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-brand-navy leading-tight max-w-3xl">
              {post.title}
            </h1>
            <p className="mt-4 text-brand-muted text-base max-w-2xl leading-relaxed">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-brand-muted">
              <span className="inline-flex items-center gap-2">
                <User size={14} className="text-brand-gold" /> {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} className="text-brand-gold" /> {formatDate(post.publishedAt)}
              </span>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={14} className="text-brand-gold" /> Atualizado em {formatDate(post.updatedAt)}
                </span>
              )}
              {post.readingTime && (
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} className="text-brand-gold" /> {post.readingTime} min de leitura
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-12 bg-white">
        <div className="container-site max-w-7xl">
          <div className="lg:grid lg:grid-cols-[180px_1fr_240px] lg:gap-10">

            {/* Sidebar esquerda */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {headings.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted mb-3">
                      Neste artigo
                    </p>
                    <nav className="space-y-0.5 border-l-2 border-brand-beige pl-4">
                      {headings.map((h) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className="block py-1.5 text-sm text-brand-muted hover:text-brand-navy transition-colors leading-snug"
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                <div className="bg-brand-beige-light rounded-2xl p-5 text-center">
                  <p className="font-display text-brand-navy text-base leading-snug">
                    Agende sua consulta
                  </p>
                  <p className="text-xs text-brand-muted mt-1.5">com Dr. Érico Diógenes</p>
                  <a
                    href="https://wa.me/5585981781020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm mt-4 w-full justify-center"
                  >
                    Agendar agora
                  </a>
                </div>
              </div>
            </aside>

            {/* Conteúdo */}
            <div data-aos="fade-up">
              {/* Cover image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover rounded-2xl shadow-card mb-2"
              />
              <p className="text-xs text-brand-muted text-right mb-8">Dr. Érico Diógenes Urologista</p>

              {/* Blocks with image2 injection */}
              {blocks.map((block, i) => (
                <div key={i}>
                  {renderBlock(block, i)}
                  {i === image2After && post.image2 && (
                    <figure className="my-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image2}
                        alt={`${post.title}, imagem complementar`}
                        className="w-full aspect-[16/9] object-cover rounded-2xl shadow-card"
                      />
                    </figure>
                  )}
                </div>
              ))}

              {/* FAQ accordion */}
              {post.faq?.length ? (
                <div className="mt-12 border-t border-brand-beige pt-10">
                  <h2 className="font-display text-2xl text-brand-navy mb-6">
                    Perguntas frequentes
                  </h2>
                  <div className="space-y-3">
                    {post.faq.map((item, i) => (
                      <details
                        key={i}
                        className="group rounded-xl border border-brand-beige bg-brand-beige-light open:bg-white transition-colors"
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-brand-navy font-medium text-[15px] list-none select-none">
                          {item.question}
                          <span className="shrink-0 text-brand-gold transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                        </summary>
                        <p className="px-5 pb-5 pt-1 text-brand-muted text-[15px] leading-relaxed">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* AuthorCard só aparece aqui no mobile */}
              <div className="lg:hidden">
                <AuthorCard />
              </div>

              {/* Back link */}
              <div className="mt-10 pt-8 border-t border-brand-beige flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold text-sm transition-colors"
                >
                  <ArrowLeft size={16} /> Voltar para o blog
                </Link>
                <a
                  href="https://wa.me/5585981781020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  Agendar consulta
                </a>
              </div>
            </div>

            {/* Sidebar direita - AuthorCard sticky */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <AuthorCard sidebar />
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 bg-brand-beige-light">
          <div className="container-site">
            <div className="text-center mb-10" data-aos="fade-up">
              <p className="eyebrow">Continue</p>
              <h2 className="section-title mt-1">
                lendo
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <div key={p.id} data-aos="fade-up" data-aos-delay={i * 80}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactMini />
      <CtaBanner />
    </>
  )
}