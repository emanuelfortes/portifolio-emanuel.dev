'use client'

import React from 'react'

const ICONS = [
  { src: '/demos/siga-fibra-site/img/icons/exitlag.webp',              bg: '#0a0a0a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/qnutri.webp',               bg: '#ea580c', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/looke.webp',              bg: '#1d4ed8', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/playlist.webp',             bg: '#4c1d95', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/ubookgo.webp',              bg: '#27a89a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/curtaon.webp',              bg: '#0a0a0a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/playkids.webp',             bg: '#6d28d9', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/docway.webp',            bg: '#16a34a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/disney-plus.webp',              bg: '#001f5c', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/sky-plus-amazonprime.webp',          bg: '#0a0a0a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/deezer.webp',               bg: '#1a1a1a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/socialcomics.webp',         bg: '#1c1f2e', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/queima-diaria.webp',             bg: '#5b21b6', fit: 'contain' },
  { src: '/demos/siga-fibra-site/img/icons/hotgo.webp',               bg: '#1a1a1a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/leitura360.webp',           bg: '#b91c1c', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/hubvantagens.webp',         bg: '#1a8fd1', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/kaspersky.webp',  bg: '#2a2a2a', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/fluid.webp',                bg: '#0891b2', fit: 'cover'   },
  { src: '/demos/siga-fibra-site/img/icons/ojornalista.webp',          bg: '#111111', fit: 'cover'   },
]

const COLS = 19                       // ícones únicos por set
const SETS = 3                        // 3× garante sem espaço preto durante animação
const ROWS = 10
const CARD = 92
const GAP = 12
const ROW_OFFSET = COLS * (CARD + GAP) // 1976px

// ~40% mais lento que antes
const SPEEDS = [76, 110, 68, 124, 90, 105, 71, 119, 85, 100]

export default function AppEcosystemSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#04050a', height: 600 }}
    >
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(0px); }
          to   { transform: translateX(-${ROW_OFFSET}px); }
        }
        @keyframes slide-right {
          from { transform: translateX(-${ROW_OFFSET}px); }
          to   { transform: translateX(0px); }
        }
      `}</style>

      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-14deg)',
          display: 'flex',
          flexDirection: 'column',
          gap: GAP,
        }}
      >
        {Array.from({ length: ROWS }, (_, row) => (
          <div
            key={row}
            style={{
              display: 'flex',
              gap: GAP,
              flexShrink: 0,
              animation: `${row % 2 === 0 ? 'slide-left' : 'slide-right'} ${SPEEDS[row]}s linear infinite`,
              willChange: 'transform',
            }}
          >
            {Array.from({ length: COLS * SETS }, (_, col) => {
              const icon = ICONS[(col % COLS + row * 7) % COLS]
              return (
                <div
                  key={col}
                  style={{
                    width: CARD,
                    height: CARD,
                    flexShrink: 0,
                    borderRadius: 20,
                    background: icon.bg,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.55)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={icon.src}
                    alt=""
                    style={{
                      width: icon.fit === 'contain' ? '78%' : '100%',
                      height: icon.fit === 'contain' ? '78%' : '100%',
                      objectFit: icon.fit as 'cover' | 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Fades nas bordas */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #04050a, transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #04050a, transparent)' }} />
      <div className="absolute inset-y-0 left-0 w-28 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #04050a, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-28 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #04050a, transparent)' }} />

      {/* Película escura central */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(4,5,10,0.72) 0%, rgba(4,5,10,0.35) 65%, transparent 100%)',
      }} />

      {/* Título centralizado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Serviços Digitais
        </p>
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-white"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)' }}
        >
          Mais que uma internet
        </h2>
        <p
          className="mt-3 text-base text-center max-w-md"
          style={{ color: 'rgba(255,255,255,0.55)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
        >
          Adicione serviços digitais ao seu plano e aproveite ainda mais
        </p>
      </div>
    </section>
  )
}
