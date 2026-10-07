'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const APPS_PAGE = '/pessoa-fisica/servicos-digitais/veja-mais'

const services = [
  {
    name: 'Disney+',
    icon: '/demos/siga-fibra-site/img/icons/disney-plus.webp',
    bg: '#0f3460',
    tagline: 'Disney, Marvel, Star Wars e muito mais',
    to: APPS_PAGE,
    accentColor: '#60a5fa',
  },
  {
    name: 'Globoplay',
    icon: '/demos/siga-fibra-site/img/icons/globoplay.webp',
    bg: '#991b1b',
    tagline: 'Séries, filmes e ao vivo da Globo',
    to: APPS_PAGE,
    accentColor: '#ef4444',
  },
  {
    name: 'HBO Max',
    icon: '/demos/siga-fibra-site/img/icons/hbo.webp',
    bg: '#1c1c2e',
    tagline: 'As melhores séries e filmes exclusivos',
    to: APPS_PAGE,
    accentColor: '#a855f7',
  },
  {
    name: 'Sky + Amazon Prime',
    icon: '/demos/siga-fibra-site/img/icons/sky-plus-amazonprime.webp',
    bg: '#0a0a0a',
    tagline: 'Canais ao vivo, filmes, séries e Amazon Originals',
    to: APPS_PAGE,
    accentColor: '#0ea5e9',
  },
  {
    name: 'Deezer',
    icon: '/demos/siga-fibra-site/img/icons/deezer.webp',
    bg: '#1a1a1a',
    tagline: 'Músicas, podcasts e audiolivros',
    to: APPS_PAGE,
    accentColor: '#27CAA3',
  },
]

export default function StreamingSection() {
  const router = useRouter()

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#060d0f' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(39,202,163,0.09), transparent)',
      }} />
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Entretenimento Digital
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Globoplay, Disney+, HBO MAX, Sky + Amazon Prime, Deezer
          </h2>
          <p className="mt-3 text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Inclua junto com seu plano e economize
          </p>
        </div>

        <style>{`
          @media(max-width: 639px) {
            .streaming-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
          }
        `}</style>
        <div
          className="flex flex-col sm:flex-row sm:flex-nowrap sm:justify-center gap-6 sm:gap-4 lg:gap-8"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {services.map((s, i) => (
            <div
              key={i}
              className="streaming-card flex flex-col items-center gap-4 cursor-pointer group w-full sm:w-auto rounded-2xl sm:rounded-none p-4 sm:p-0 transition-all duration-200"
              onClick={() => router.push(s.to)}
            >
              <div className="flex flex-row sm:flex-col items-center gap-4 w-full">
                {/* Ícone */}
                <div
                  className="w-16 h-16 sm:w-[185px] sm:h-[185px] flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{
                    borderRadius: 16,
                    boxShadow: 'rgba(0,0,0,0.4) 0px 2px 4px, rgba(0,0,0,0.3) 0px 7px 13px -3px',
                  }}
                >
                  <img src={s.icon} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>

                {/* Texto */}
                <div className="flex flex-col sm:items-center flex-1">
                  <p className="text-sm font-semibold text-white mb-1">{s.name}</p>
                  <p className="text-xs leading-relaxed sm:text-center sm:max-w-[160px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {s.tagline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
