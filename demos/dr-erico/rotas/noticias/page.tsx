import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import PageHeader from '@/demos/dr-erico/components/ui/PageHeader'
import PostCard from '@/demos/dr-erico/components/ui/PostCard'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { getNoticiasOrdenadas } from '@/demos/dr-erico/data/noticias'

const SITE_URL = 'https://drericodiogenes.com.br'

export const metadata: Metadata = {
  title: { absolute: 'Notícias de Urologia | Dr. Érico Diógenes — Urologista em Fortaleza' },
  description:
    'Notícias de urologia comentadas pelo Dr. Érico Diógenes: cirurgia robótica, câncer de próstata, tratamento a laser e saúde masculina, com a leitura de um urologista em Fortaleza.',
  alternates: { canonical: '/noticias' },
  openGraph: {
    title: 'Notícias de Urologia | Dr. Érico Diógenes',
    description: 'Urologia em pauta, com a leitura de um urologista em Fortaleza.',
    url: '/noticias',
  },
}

/**
 * Esta página é componente de servidor, ao contrário de /blog.
 *
 * O blog é 'use client' porque tem filtro por categoria e paginação, e isso já
 * custou indexação: só os 9 posts da página aberta iam para o HTML, e 17 posts
 * ficaram fora do índice por falta de link. Aqui, com poucas notícias, filtro e
 * paginação seriam enfeite, e sem eles tudo é gerado no build e chega inteiro
 * ao Google.
 *
 * Quando a seção crescer e a paginação fizer falta, vale copiar a solução que
 * ficou no /blog: renderizar todos os itens e apenas esconder os que não são da
 * página aberta.
 */
export default function Noticias() {
  const lista = getNoticiasOrdenadas()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Notícias', item: `${SITE_URL}/noticias` },
    ],
  }

  /*
    CollectionPage com a lista dentro, em vez de só o BreadcrumbList.

    Diz ao Google o que esta página é — um índice de notícias — e enumera os
    itens na ordem em que aparecem. Sem isso, a página seria lida como um
    amontoado de links.
  */
  const colecaoSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Notícias de Urologia',
    description:
      'Notícias de urologia comentadas pelo Dr. Érico Diógenes, urologista em Fortaleza.',
    url: `${SITE_URL}/noticias`,
    isPartOf: { '@type': 'WebSite', name: 'Dr. Érico Diógenes', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: lista.map((n, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/noticias/${n.slug}`,
        name: n.title,
      })),
    },
  }

  return (
    <>

      <PageHeader title="Notícias" breadcrumb="Notícias" />

      <section className="py-14 bg-white">
        <div className="container-site">
          <p className="max-w-2xl text-brand-muted mb-3" data-aos="fade-up">
            Urologia em pauta: decisões regulatórias, estudos, campanhas e tecnologia, com a
            leitura de quem opera. Cada notícia aponta para a matéria de origem.
          </p>
          {/*
            As duas políticas que governam esta seção, ligadas a partir dela.

            O plano prevê esses links no rodapé, o que depende de aprovação do
            Dr. Érico. Aqui o link é editorial, não navegacional: quem lê uma
            notícia de saúde tem motivo para querer saber quem escreveu, quem
            revisou e o que acontece quando há erro.
          */}
          <p className="max-w-2xl text-sm text-brand-muted/90 mb-10" data-aos="fade-up">
            Como este conteúdo é escrito e revisado está na{' '}
            <Link href="/politica-editorial" className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors">
              política editorial
            </Link>
            . Erros são corrigidos conforme a{' '}
            <Link href="/politica-de-correcoes" className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors">
              política de correções
            </Link>
            .
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lista.map((n, i) => (
              <div key={n.id} data-aos="fade-up" data-aos-delay={(i % 3) * 60}>
                <PostCard post={n} base="/noticias" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactMini />
    </>
  )
}
