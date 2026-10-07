import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Blog de Urologia Fortaleza | Próstata e Saúde Masculina' },
  description:
    'Artigos sobre urologia em Fortaleza: cirurgia robótica, HoLEP, próstata, cálculo renal e saúde masculina. Informação de qualidade pelo Dr. Érico Diógenes.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog de Urologia Fortaleza | Próstata e Saúde Masculina',
    description:
      'Artigos sobre urologia em Fortaleza: cirurgia robótica, HoLEP, próstata, cálculo renal e saúde masculina. Informação de qualidade pelo Dr. Érico Diógenes.',
    url: '/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
