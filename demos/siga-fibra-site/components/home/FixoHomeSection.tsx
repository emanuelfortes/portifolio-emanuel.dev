'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const features = [
  { label: 'Fixo local ilimitado' },
  { label: 'Fixo nacional ilimitado' },
  { label: 'Celular local ilimitado' },
  { label: 'Celular nacional ilimitado' },
]

const extras = [
  { icon: '📞', label: 'Identificador de chamadas' },
  { icon: '🔄', label: 'Portabilidade gratuita' },
  { icon: '📱', label: 'Qualquer operadora' },
  { icon: '🇧🇷', label: 'Todo o Brasil' },
]

export default function FixoHomeSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden" style={{ background: '#060d0f' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(39,202,163,0.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div data-aos="fade-right">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#27CAA3' }}>
              Siga Fibra
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
              Telefone Fixo{' '}
              <span style={{
                background: 'linear-gradient(135deg, #27CAA3, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ilimitado
              </span>
              ,<br />sem surpresas na conta.
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-md text-gray-400">
              Por R$ 39,90/mês você liga à vontade para fixo e celular em todo o Brasil. Identificador de chamadas incluso e portabilidade gratuita.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {extras.map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(39,202,163,0.07)', border: '1px solid rgba(39,202,163,0.15)' }}
                >
                  <span className="text-base">{f.icon}</span>
                  <span className="text-sm font-semibold text-white">{f.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/pessoa-fisica/fixo')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
              style={{ background: '#27CAA3' }}
            >
              Ver plano Siga Fixo
              <span>→</span>
            </button>
          </div>

          {/* Right, price card */}
          <div data-aos="fade-left" data-aos-delay="80">
            <div className="relative rounded-3xl p-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#27CAA3' }}>
                Siga Fixo Ilimitado
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg text-gray-400">R$</span>
                <span className="text-6xl font-black text-white">39</span>
                <span className="text-2xl text-gray-400">,90</span>
              </div>
              <p className="text-sm text-gray-500 mb-8">por mês, tudo incluso</p>

              <ul className="flex flex-col gap-3 mb-8">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0" style={{ color: '#27CAA3' }}>✓</span>
                    <span className="text-sm font-semibold text-white">{f.label}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0" style={{ color: '#27CAA3' }}>✓</span>
                  <span className="text-sm font-semibold text-white">Identificador de chamadas</span>
                </li>
              </ul>

              <p className="text-xs text-gray-600 mb-6">*Exclusivo para clientes Siga Fibra com internet ativa.*</p>

              <button
                onClick={() => router.push('/pessoa-fisica/fixo')}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90"
                style={{ background: '#27CAA3' }}
              >
                Contratar Siga Fixo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
