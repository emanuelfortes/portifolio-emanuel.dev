'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const chips = [
  { icon: '📡', label: 'Fibra até sua casa' },
  { icon: '🛠️', label: 'Instalação em 48h' },
]

const planBars = [
  { name: 'SIGA NITRO', speed: '600 Mb', pct: 48, color: '#27CAA3' },
  { name: 'SIGA NITRO', speed: '800 Mb', pct: 64, color: '#27CAA3' },
  { name: 'SIGA NITRO', speed: '1 Gb',   pct: 80, color: '#06b6d4' },
  { name: 'SIGA HIPER', speed: '2 Gb',   pct: 90, color: '#818cf8' },
  { name: 'SIGA HIPER', speed: '2.5 Gb', pct: 100, color: '#a78bfa' },
]

export default function HeroInternetFibra() {
  const router = useRouter()

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ background: '#060d0f', minHeight: '90vh' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Glows */}
      <div
        className="absolute -top-20 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(39,202,163,0.18), transparent 65%)' }}
      />
      <div
        className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10), transparent 65%)' }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <div
              data-aos="fade-up"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 text-white"
              style={{ background: 'rgba(39,202,163,0.1)', border: '1px solid rgba(39,202,163,0.22)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#27CAA3' }} />
              Siga Fibra, Internet Residencial
            </div>

            <h1
              data-aos="fade-up"
              data-aos-delay="60"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-5"
            >
              Internet que{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #27CAA3, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                não trava,
              </span>
              <br />não cai,
              <br />não decepciona.
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="120"
              className="text-base lg:text-lg leading-relaxed mb-8 text-gray-400 max-w-[480px]"
            >
              Conexão de fibra óptica com alta performance, estabilidade e sem interrupções. Do jeito que a sua casa merece.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="160"
              className="grid grid-cols-2 gap-3 mb-8 max-w-[420px]"
            >
              {chips.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(39,202,163,0.07)',
                    border: '1px solid rgba(39,202,163,0.15)',
                  }}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="text-sm font-semibold text-white">{c.label}</span>
                </div>
              ))}
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="font-bold px-8 py-4 rounded-2xl text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                style={{ background: '#27CAA3' }}
              >
                Ver planos e preços
              </button>
              <button
                onClick={() => router.push('/pessoa-fisica/atendimento/canais')}
                className="font-semibold px-8 py-4 rounded-2xl text-sm text-gray-300 transition-all duration-200 hover:border-[#27CAA3] hover:text-[#27CAA3]"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Falar com consultor
              </button>
            </div>
          </div>

          {/* Right, plan speed card */}
          <div data-aos="fade-left" data-aos-delay="180" className="hidden lg:block">
            <div className="relative">
              <div
                className="rounded-3xl p-8"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-6"
                  style={{ color: '#27CAA3' }}
                >
                  Escolha sua velocidade
                </p>

                <div className="flex flex-col gap-4 mb-8">
                  {planBars.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-gray-500 uppercase tracking-wide font-semibold">{item.name}</span>
                        <span className="font-bold" style={{ color: item.color }}>{item.speed}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.pct}%`,
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}99)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between pt-6"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-400">R$</span>
                      <span className="text-3xl font-extrabold text-white">84</span>
                      <span className="text-sm text-gray-400">,90/mês</span>
                    </div>
                  </div>
                  <button
                    onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90"
                    style={{ background: '#27CAA3' }}
                  >
                    Ver planos →
                  </button>
                </div>
              </div>


              <div
                className="absolute -bottom-4 -left-4 text-xs font-bold px-4 py-1.5 rounded-full"
                style={{
                  background: '#0f2d22',
                  border: '1px solid rgba(39,202,163,0.3)',
                  color: '#27CAA3',
                }}
              >
                Instalação em 48h
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          data-aos="fade-up"
          data-aos-delay="240"
          className="mt-16 pt-10 grid grid-cols-2 gap-6 max-w-sm"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { value: '2.5', unit: 'Gb', label: 'Velocidade máxima' },
            { value: '97.9', unit: '%', label: 'Uptime da rede' },
          ].map((s, i) => (
            <div key={i} className={`text-center ${i < 1 ? 'border-r' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</span>
                {s.unit && (
                  <span className="text-lg font-bold" style={{ color: '#27CAA3' }}>{s.unit}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
