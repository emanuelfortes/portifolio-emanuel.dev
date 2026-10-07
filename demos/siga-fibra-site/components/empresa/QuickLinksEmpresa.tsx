'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const links = [
  { label: 'Internet', to: '/empresa/internet/fibra' },
  { label: 'Telefonia', to: '/empresa/telefonia/fixo' },
  { label: 'Serviços Digitais', to: '/empresa/servicos-digitais/kaspersky' },
  { label: 'Atendimento', to: '/empresa/atendimento/canais' },
]

export default function QuickLinksEmpresa() {
  const router = useRouter()
  return (
    <section className="hidden sm:block" style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 py-3">
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.to)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0"
              style={{ color: 'var(--text-sub)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#03C2C3'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-sub)' }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#03C2C3' }} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
