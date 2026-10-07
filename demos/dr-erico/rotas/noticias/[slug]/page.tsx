import Link from '@/demos/dr-erico/lib/Link'
import { notFound } from '@/demos/dr-erico/lib/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock, ExternalLink, RefreshCw, User } from 'lucide-react'
import { getNoticiaBySlug, getNoticiasRelacionadas, noticias } from '@/demos/dr-erico/data/noticias'
import PostCard from '@/demos/dr-erico/components/ui/PostCard'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import AuthorCard from '@/demos/dr-erico/components/blog/AuthorCard'
import { parseContent, renderBlock, type Block } from '@/demos/dr-erico/components/ui/ConteudoRico'

type Props = { params: { slug: string } }

const SITE_URL = 'https://drericodiogenes.com.br'

export async function generateStaticParams() {
  return noticias.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const noticia = getNoticiaBySlug(slug)
  if (!noticia) return { title: 'Notícia não encontrada' }

  const seoTitle = noticia.metaTitle ?? noticia.title
  const seoDesc = noticia.metaDescription ?? noticia.excerpt
  const capa = `${SITE_URL}${noticia.coverImage}`

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: `/noticias/${noticia.slug}` },
    openGraph: {
      type: 'article',
      title: seoTitle,
      description: seoDesc,
      url: `/noticias/${noticia.slug}`,
      publishedTime: noticia.publishedAt,
      modifiedTime: noticia.updatedAt ?? noticia.publishedAt,
      authors: [noticia.author],
      images: [{ url: capa, alt: noticia.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: [capa],
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

export default async function NoticiaPage({ params }: Props) {
  const { slug } = params
  const noticia = getNoticiaBySlug(slug)
  if (!noticia) notFound()

  const relacionadas = getNoticiasRelacionadas(noticia, 3)
  const blocks = parseContent(noticia.content)
  const headings = blocks.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')

  const h2Indices = blocks.reduce<number[]>(
    (acc, b, i) => (b.type === 'h2' ? [...acc, i] : acc),
    [],
  )
  const image2After = h2Indices[1] ?? h2Indices[0] ?? Math.floor(blocks.length / 2)

  const capa = `${SITE_URL}${noticia.coverImage}`
  const categorias = noticia.categories ?? [noticia.category]

  /**
   * NewsArticle, e não BlogPosting.
   *
   * A diferença não é cosmética: NewsArticle habilita a página a aparecer em
   * "Principais notícias" e no Discover, e é o tipo que o sitemap de notícias
   * espera encontrar. Declarar isso em texto atemporal seria sinal falso, e por
   * isso o blog continua como BlogPosting.
   *
   * O `publisher.logo` aponta para um PNG gerado a partir do logo do site. O
   * logo exibido continua sendo o WebP: esta cópia existe só para os dados
   * estruturados, porque formato moderno não é aceito aqui. Ela é achatada
   * sobre branco, já que o original tem transparência e logo transparente pode
   * sumir em fundo escuro.
   *
   * A identidade continua sendo a do médico, não a de uma empresa de mídia. Um
   * portal se declara NewsMediaOrganization; declarar isso aqui enfraqueceria a
   * entidade que sustenta a busca local por "urologista em Fortaleza".
   */
  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.title,
    description: noticia.excerpt,
    image: [capa],
    datePublished: noticia.publishedAt,
    dateModified: noticia.updatedAt ?? noticia.publishedAt,
    url: `${SITE_URL}/noticias/${noticia.slug}`,
    articleSection: categorias[0],
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: noticia.author,
      url: `${SITE_URL}/dr-erico-diogenes`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dr. Érico Diógenes',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/img/logo-publisher.png`,
        width: 521,
        height: 146,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/noticias/${noticia.slug}`,
    },
    /*
      A matéria que originou o assunto. Dizer isso na marcação é o que
      diferencia comentar uma notícia de reivindicá-la como própria.
    */
    citation: {
      '@type': 'CreativeWork',
      name: `${noticia.title} — ${noticia.fonte.veiculo}`,
      url: noticia.fonte.url,
      publisher: { '@type': 'Organization', name: noticia.fonte.veiculo },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Notícias', item: `${SITE_URL}/noticias` },
      {
        '@type': 'ListItem',
        position: 3,
        name: noticia.title,
        item: `${SITE_URL}/noticias/${noticia.slug}`,
      },
    ],
  }

  return (
    <>

      {/* Hero */}
      <section className="bg-brand-beige pt-12 pb-10">
        <div className="container-site max-w-5xl">
          <nav className="flex items-center gap-2 text-xs text-brand-muted mb-7">
            <Link href="/" className="hover:text-brand-gold transition-colors">Início</Link>
            <span className="opacity-40">/</span>
            <Link href="/noticias" className="hover:text-brand-gold transition-colors">Notícias</Link>
            <span className="opacity-40">/</span>
            <span className="text-brand-navy font-medium">{categorias.join(' · ')}</span>
          </nav>

          <div data-aos="fade-up">
            <div className="flex flex-wrap gap-2 mb-5">
              {categorias.map((cat) => (
                <span
                  key={cat}
                  className="inline-block bg-brand-gold/15 text-brand-gold-dark text-xs uppercase tracking-widest px-3 py-1 rounded-full font-semibold"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-brand-navy leading-tight max-w-3xl">
              {noticia.title}
            </h1>
            <p className="mt-4 text-brand-muted text-base max-w-2xl leading-relaxed">
              {noticia.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-brand-muted">
              <span className="inline-flex items-center gap-2">
                <User size={14} className="text-brand-gold" /> {noticia.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} className="text-brand-gold" /> {formatDate(noticia.publishedAt)}
              </span>
              {noticia.updatedAt && noticia.updatedAt !== noticia.publishedAt && (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={14} className="text-brand-gold" /> Atualizado em{' '}
                  {formatDate(noticia.updatedAt)}
                </span>
              )}
              {noticia.readingTime && (
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} className="text-brand-gold" /> {noticia.readingTime} min de leitura
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Matéria */}
      <section className="py-12 bg-white">
        <div className="container-site max-w-7xl">
          <div className="lg:grid lg:grid-cols-[180px_1fr_240px] lg:gap-10">

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {headings.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted mb-3">
                      Nesta notícia
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

            <div data-aos="fade-up">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={noticia.coverImage}
                alt={noticia.title}
                className="w-full aspect-[16/9] object-cover rounded-2xl shadow-card mb-2"
              />
              <p className="text-xs text-brand-muted text-right mb-8">Dr. Érico Diógenes Urologista</p>

              {blocks.map((block, i) => (
                <div key={i}>
                  {renderBlock(block, i)}
                  {i === image2After && noticia.image2 && (
                    <figure className="my-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={noticia.image2}
                        alt={`${noticia.title}, imagem complementar`}
                        className="w-full aspect-[16/9] object-cover rounded-2xl shadow-card"
                        loading="lazy"
                      />
                    </figure>
                  )}
                </div>
              ))}

              {/*
                Bloco de origem.

                Fica no fim e é obrigatório em toda notícia, por decisão de
                conteúdo: o texto acima é original, e apontar para quem publicou
                o assunto primeiro é o que faz as duas peças se reforçarem em vez
                de disputarem a mesma busca.
              */}
              <div className="mt-12 rounded-2xl border border-brand-beige bg-brand-beige-light p-5 md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted">
                  Assunto publicado originalmente em
                </p>
                <a
                  href={noticia.fonte.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 font-display text-lg text-brand-navy hover:text-brand-gold transition-colors"
                >
                  {noticia.fonte.veiculo}
                  <ExternalLink size={15} className="text-brand-gold shrink-0" />
                </a>
                <p className="mt-1 text-sm text-brand-muted">
                  {noticia.fonte.data}. O texto desta página é original e traz a leitura do
                  Dr. Érico Diógenes sobre o assunto.
                </p>
              </div>

              <div className="lg:hidden">
                <AuthorCard />
              </div>

              <div className="mt-10 pt-8 border-t border-brand-beige flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold text-sm transition-colors"
                >
                  <ArrowLeft size={16} /> Voltar para as notícias
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

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <AuthorCard sidebar />
              </div>
            </aside>

          </div>
        </div>
      </section>

      {relacionadas.length > 0 && (
        <section className="py-16 bg-brand-beige-light">
          <div className="container-site">
            <div className="text-center mb-10" data-aos="fade-up">
              <p className="eyebrow">Veja também</p>
              <h2 className="section-title mt-1">outras notícias</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relacionadas.map((n, i) => (
                <div key={n.id} data-aos="fade-up" data-aos-delay={i * 80}>
                  <PostCard post={n} base="/noticias" />
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
