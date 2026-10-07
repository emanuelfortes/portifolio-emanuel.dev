'use client'

import { useMemo, useState } from 'react'
import PageHeader from '@/demos/dr-erico/components/ui/PageHeader'
import PostCard from '@/demos/dr-erico/components/ui/PostCard'
import { posts } from '@/demos/dr-erico/data/posts'
import type { PostCategory } from '@/demos/dr-erico/types/post'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'

const PAGE_SIZE = 9

export default function Blog() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<PostCategory | 'Todas'>('Todas')

  const filtered = useMemo(() => {
    const all = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    if (category === 'Todas') return all
    return all.filter((p) => p.category === category || p.categories?.includes(category))
  }, [category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const inicioDaPagina = (page - 1) * PAGE_SIZE

  const categories: (PostCategory | 'Todas')[] = [
    'Todas',
    'Cirurgia Robótica',
    'Próstata',
    'HoLEP',
    'Cálculo Renal',
    'Tratamento a Laser',
    'Cirurgia a Laser',
    'Urologista',
    'Exames',
  ]

  const goToPage = (n: number) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => goToPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="h-10 w-10 rounded-full bg-brand-navy text-white disabled:opacity-40 transition"
        >
          ←
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`h-10 w-10 rounded-full font-medium text-sm transition ${
              page === i + 1
                ? 'bg-brand-green text-white'
                : 'bg-brand-beige-light text-brand-muted hover:bg-brand-beige'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="h-10 w-10 rounded-full bg-brand-navy text-white disabled:opacity-40 transition"
        >
          →
        </button>
      </div>
    )
  }

  return (
    <>
      {/*
        Chamava-se "Nossas Notícias". Mudou quando a seção /noticias passou a
        existir: duas seções com o mesmo nome confundem o visitante e mandam
        sinal ambíguo ao Google, justamente sobre o termo que a seção nova
        precisa reivindicar.

        A URL continua /blog, então os posts indexados não são afetados. O que
        mudou foi só o rótulo.
      */}
      <PageHeader title="Blog" breadcrumb="Blog" />

      <section className="py-14 bg-white">
        <div className="container-site">
          <div className="flex flex-wrap gap-2 justify-center mb-10" data-aos="fade-up">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                  category === c
                    ? 'bg-brand-navy text-white'
                    : 'bg-brand-beige-light text-brand-muted hover:bg-brand-beige'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mb-8">{renderPagination()}</div>

          {/*
            Todos os posts vão no HTML; a paginação só esconde os que não são
            da página atual.

            Antes só os 9 da página aberta eram renderizados, e os botões de
            página trocam o conteúdo por JavaScript, sem link. O HTML que o
            Google recebia de /blog tinha 9 links de post, e 17 posts que não
            estavam entre eles apareciam no Search Console como "não
            reconhecido" ou "detectada, mas não indexada" (leitura de 28/09).

            Visualmente nada muda. A key dos visíveis leva o número da página
            para que, ao trocar de página, os cards sejam montados de novo e o
            AOS os anime como antes. Os ocultos ficam sem data-aos, senão o
            AOS os registraria com opacidade zero.
          */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => {
              const posicao = i - inicioDaPagina
              const visivel = posicao >= 0 && posicao < PAGE_SIZE

              return visivel ? (
                <div key={`${post.id}-p${page}`} data-aos="fade-up" data-aos-delay={posicao * 60}>
                  <PostCard post={post} />
                </div>
              ) : (
                <div key={`${post.id}-oculto`} hidden>
                  <PostCard post={post} />
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-brand-muted py-10">
              Nenhum post encontrado nessa categoria.
            </p>
          )}

          <div className="mt-12">{renderPagination()}</div>
        </div>
      </section>

      <ContactMini />
    </>
  )
}
