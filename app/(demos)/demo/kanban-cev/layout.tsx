import type { Metadata } from 'next'
import '@fontsource-variable/manrope'
import '@/demos/kanban-cev/styles.css'
import { sora } from '@/demos/kanban-cev/lib/fonts'
import { Tema } from '@/demos/kanban-cev/components/tema'
import { asset } from '@/demos/kanban-cev/lib/paths'

export const metadata: Metadata = {
  title: 'Time de Águias · Plataforma',
  description: 'Gestão de demandas da agência',
  icons: { icon: asset('favicon-dark.png') },
}

// As telas leem a URL (`?peca=` do cronograma) e o estado vive no navegador.
export const dynamic = 'force-dynamic'

export default function KanbanCevLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* As variáveis que o next/font do original põe no <html>: Sora nos
          títulos, Manrope no corpo. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{--font-display:${sora.style.fontFamily};--font-body:'Manrope Variable'}`,
        }}
      />
      <Tema />
      {children}
    </>
  )
}
