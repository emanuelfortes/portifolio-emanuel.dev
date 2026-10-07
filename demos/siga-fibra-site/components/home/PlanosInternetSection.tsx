'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'
import { CAMPANHA, CAMPANHA_CHECKOUT_URL } from '@/demos/siga-fibra-site/lib/plans'

const plans = [
  {
    id: 'nitro-600',
    name: 'SIGA NITRO',
    speed: '600',
    unit: 'Mb',
    upload: '300Mb',
    priceInt: '84',
    priceDec: ',90',
    priceAfter: 'R$ 104,90/mês',
    benefits: ['Internet 100% Fibra Óptica', 'Roteador Padrão'],
    featured: false,
    badge: null,
  },
  {
    id: 'nitro-800',
    name: 'SIGA NITRO',
    speed: '800',
    unit: 'Mb',
    upload: '400Mb',
    priceInt: '99',
    priceDec: ',90',
    priceAfter: 'R$ 119,90/mês',
    benefits: ['Internet 100% Fibra Óptica', 'Roteador Padrão'],
    featured: true,
    badge: 'MAIS VENDIDO',
  },
  {
    id: 'nitro-1g',
    name: 'SIGA NITRO',
    speed: '1',
    unit: 'Gb',
    upload: '500Mb',
    priceInt: '109',
    priceDec: ',90',
    priceAfter: 'R$ 129,90/mês',
    benefits: ['Internet 100% Fibra Óptica', 'Roteador Padrão'],
    featured: false,
    badge: null,
  },
  {
    id: 'hiper-flow',
    name: 'SIGA HIPER',
    speed: '2',
    unit: 'Gb',
    upload: '2Gb',
    priceInt: '159',
    priceDec: ',90',
    priceAfter: 'R$ 179,90/mês',
    benefits: ['Internet 100% Fibra Óptica', 'Roteador premium'],
    featured: false,
    badge: null,
  },
  {
    id: 'hiper-max',
    name: 'SIGA HIPER',
    speed: '2.5',
    unit: 'Gb',
    upload: '2.5Gb',
    priceInt: '199',
    priceDec: ',90',
    priceAfter: 'R$ 219,90/mês',
    benefits: ['Internet 100% Fibra Óptica', 'Roteador premium'],
    featured: false,
    badge: null,
  },
]

// O card da campanha entra antes dos planos regulares, por isso o +1.
const CARD_COUNT = plans.length + 1

export default function PlanosInternetSection() {
  const router = useRouter()
  const [campInt, campDec] = CAMPANHA.price.toFixed(2).split('.')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeDot, setActiveDot] = useState(0)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640

  const checkScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    const cardWidth = el.scrollWidth / CARD_COUNT
    setActiveDot(Math.round(el.scrollLeft / cardWidth))
  }

  const startAutoScroll = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      const el = scrollRef.current
      if (!el || !isMobile()) return
      const cardWidth = el.scrollWidth / CARD_COUNT
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
      if (atEnd) {
        el.scrollLeft = 0
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }, 3500)
  }

  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pauseAndResume = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => startAutoScroll(), 2000)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScrollButtons()
    el.addEventListener('scroll', checkScrollButtons)
    window.addEventListener('resize', checkScrollButtons)
    el.addEventListener('touchstart', pauseAndResume, { passive: true })
    startAutoScroll()
    return () => {
      el.removeEventListener('scroll', checkScrollButtons)
      window.removeEventListener('resize', checkScrollButtons)
      el.removeEventListener('touchstart', pauseAndResume)
      if (autoRef.current) clearInterval(autoRef.current)
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.clientWidth / 4
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' })
  }

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--bg-light-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#27CAA3' }}>
            Siga Fibra
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ color: 'var(--text-dark)' }}
          >
            Internet Fibra de verdade,
            <br className="hidden sm:block" />
            do básico à
            <span style={{ color: '#27CAA3' }}> Hipervelocidade</span>
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--text-muted)' }}>Escolha o plano ideal para a sua casa</p>
        </div>

        <div className="relative" data-aos="fade-up" data-aos-delay="80">
          <div className="flex items-center gap-3">

            {/* Left arrow, hidden on mobile */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="hidden sm:flex flex-shrink-0 w-11 h-11 rounded-full items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
              style={{ background: '#27CAA3' }}
              aria-label="Anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Scroll track */}
            <style>{`
              .carousel-hide-scroll::-webkit-scrollbar { display: none; }
              .plano-card { width: 100%; scroll-snap-align: start; }
              @media(min-width: 640px) { .plano-card { width: calc(25% - 15px); min-width: 220px; } }
            `}</style>
            <div
              ref={scrollRef}
              className="carousel-hide-scroll flex gap-0 sm:gap-5 overflow-x-auto scroll-smooth flex-1"
              style={{ scrollbarWidth: 'none', paddingBottom: '4px', paddingTop: '20px', scrollSnapType: 'x mandatory' }}
            >
              {/* Card da campanha — estética própria, separado dos planos regulares */}
              <div className="plano-card flex-shrink-0 flex flex-col" style={{ position: 'relative' }}>
                <span
                  className="absolute left-1/2 text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full text-white z-10 whitespace-nowrap"
                  style={{
                    top: '0px',
                    transform: 'translate(-50%, -50%)',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                    boxShadow: '0 2px 12px rgba(239,68,68,0.45)',
                  }}
                >
                  {CAMPANHA.name}
                </span>

                <div
                  className="flex flex-col rounded-2xl overflow-hidden flex-1"
                  style={{ boxShadow: '0 8px 32px rgba(15,45,34,0.35)' }}
                >
                  <div
                    className="relative px-6 pt-5 pb-6"
                    style={{ background: 'linear-gradient(135deg, #0f2d22 0%, #15543c 100%)' }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3ddcbc' }}>
                      SIGA NITRO
                    </p>
                    <div className="flex items-end gap-0.5 mt-1">
                      <span className="font-black text-white leading-none" style={{ fontSize: '3.75rem' }}>
                        {CAMPANHA.speed}
                      </span>
                      <span className="text-2xl font-extrabold text-white mb-1.5">{CAMPANHA.unit}</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Download / {CAMPANHA.upload} Upload
                    </p>
                    <span
                      className="absolute bottom-3 right-4 text-xs font-black tracking-widest uppercase select-none"
                      style={{ color: 'rgba(61,220,188,0.22)' }}
                    >
                      SIGA
                    </span>
                  </div>

                  <div className="px-6 py-5 flex flex-col flex-1" style={{ background: 'var(--card-bg)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>
                        R$ {CAMPANHA.priceFrom.toFixed(2).replace('.', ',')}
                      </span>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wide"
                        style={{ background: '#ef4444' }}
                      >
                        Oferta do mês
                      </span>
                    </div>
                    <div className="flex items-end gap-0.5 mb-2">
                      <span className="text-sm font-bold mb-2.5" style={{ color: 'var(--text-dark)' }}>R$</span>
                      <span className="font-black leading-none" style={{ fontSize: '3.25rem', color: 'var(--text-dark)' }}>
                        {campInt}
                      </span>
                      <span className="text-xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
                        ,{campDec}
                      </span>
                      <span className="text-xs mb-2 ml-0.5" style={{ color: 'var(--text-muted)' }}>/mês</span>
                    </div>
                    <p className="text-xs font-bold mb-3" style={{ color: '#27CAA3' }}>
                      Durante {CAMPANHA.months} meses
                    </p>

                    <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: 'var(--card-bg-alt)' }}>
                      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-semibold">1 streaming à sua escolha:</span>
                      </p>
                      <div className="flex items-start gap-2">
                        {CAMPANHA.apps.map((app, k) => (
                          <React.Fragment key={app.name}>
                            {k > 0 && (
                              <span className="text-xs font-bold mt-2.5" style={{ color: 'var(--text-muted)' }}>ou</span>
                            )}
                            {/* O "C/ Anúncio" fica sob cada icone, e nao so no rodape do card,
                                para que a condicao do pacote apareca junto da marca que ela
                                qualifica — a mesma leitura das artes do banner. */}
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className="w-9 h-9 rounded-lg overflow-hidden shrink-0"
                                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
                                title={app.name}
                              >
                                <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                              </div>
                              {app.hasAds && (
                                <span
                                  className="text-[10px] font-semibold leading-none whitespace-nowrap"
                                  style={{ color: 'var(--text-muted)' }}
                                >
                                  C/ Anúncio
                                </span>
                              )}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl px-3 py-2.5 mb-5" style={{ background: 'var(--card-bg-alt)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-semibold">Após a promoção:</span>{' '}
                        R$ {CAMPANHA.priceAfter.toFixed(2).replace('.', ',')}/mês
                      </p>
                    </div>

                    <ul className="flex flex-col gap-2 mb-6 flex-1">
                      {CAMPANHA.benefits.map((b, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-mid)' }}>
                          <span style={{ color: '#27CAA3' }}>✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => router.push(CAMPANHA_CHECKOUT_URL)}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #0f2d22 0%, #15543c 100%)' }}
                    >
                      Assinar promoção
                    </button>
                  </div>
                </div>
              </div>

              {plans.map((plan, i) => (
                <div
                  key={i}
                  className="plano-card flex-shrink-0 flex flex-col"
                  style={{ position: 'relative' }}
                >
                  {plan.badge && (
                    <span
                      className="absolute left-1/2 text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full text-white z-10 whitespace-nowrap"
                      style={{
                        top: '0px',
                        transform: 'translate(-50%, -50%)',
                        background: '#0f2d22',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <div
                    className="flex flex-col rounded-2xl overflow-hidden flex-1"
                    style={{
                      boxShadow: plan.featured
                        ? '0 8px 32px rgba(39,202,163,0.28)'
                        : '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div
                      className="relative px-6 pt-5 pb-6"
                      style={{ background: 'linear-gradient(135deg, #3ddcbc 0%, #27CAA3 100%)' }}
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
                        {plan.name}
                      </p>
                      <div className="flex items-end gap-0.5 mt-1">
                        <span className="font-black text-white leading-none" style={{ fontSize: '3.75rem' }}>
                          {plan.speed}
                        </span>
                        <span className="text-2xl font-extrabold text-white mb-1.5">{plan.unit}</span>
                      </div>
                      <p className="text-white/65 text-sm mt-0.5">
                        Download / {plan.upload} Upload
                      </p>
                      <span
                        className="absolute bottom-3 right-4 text-xs font-black tracking-widest uppercase select-none"
                        style={{ color: 'rgba(255,255,255,0.18)' }}
                      >
                        SIGA
                      </span>
                    </div>

                    <div className="px-6 py-5 flex flex-col flex-1" style={{ background: 'var(--card-bg)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>A partir de</p>
                      <div className="flex items-end gap-0.5 mb-5">
                        <span className="text-sm font-bold mb-2.5" style={{ color: 'var(--text-dark)' }}>R$</span>
                        <span className="font-black leading-none" style={{ fontSize: '3.25rem', color: 'var(--text-dark)' }}>
                          {plan.priceInt}
                        </span>
                        <span className="text-xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
                          {plan.priceDec}
                        </span>
                        <span className="text-xs mb-2 ml-0.5" style={{ color: 'var(--text-muted)' }}>/mês</span>
                      </div>
                      <div className="rounded-xl px-3 py-2.5 mb-5" style={{ background: 'var(--card-bg-alt)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span className="font-semibold">Após o vencimento:</span>{' '}
                          {plan.priceAfter}
                        </p>
                      </div>
                      <ul className="flex flex-col gap-2 mb-6 flex-1">
                        {plan.benefits.map((b, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-mid)' }}>
                            <span style={{ color: '#27CAA3' }}>✓</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => router.push(`/pessoa-fisica/checkout?plan=${plan.id}`)}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{ background: '#27CAA3' }}
                      >
                        Assinar agora
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow, hidden on mobile */}
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="hidden sm:flex flex-shrink-0 w-11 h-11 rounded-full items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
              style={{ background: '#27CAA3' }}
              aria-label="Próximo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: CARD_COUNT }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current
                if (!el) return
                const cardWidth = el.scrollWidth / CARD_COUNT
                el.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
              }}
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{ background: '#27CAA3', opacity: i === activeDot ? 1 : 0.3 }}
              aria-label={`Ir para plano ${i + 1}`}
            />
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          *Consulte as regras e condições aplicáveis.* *Consulte a disponibilidade.*
        </p>
        <p className="text-center text-xs mt-2 max-w-[640px] mx-auto" style={{ color: 'var(--text-muted)' }}>
          {CAMPANHA.name}: {CAMPANHA.disclaimer}
        </p>

      </div>
    </section>
  )
}
