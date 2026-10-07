'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const benefits = [
  { label: 'Ligações ilimitadas para fixo local' },
  { label: 'Ligações ilimitadas para fixo nacional' },
  { label: 'Ligações ilimitadas para celular local' },
  { label: 'Ligações ilimitadas para celular nacional' },
  { label: 'Identificador de chamadas incluso' },
]

const diferenciais = [
  { icon: '📞', label: 'Identificador de chamadas' },
  { icon: '🔄', label: 'Portabilidade gratuita' },
  { icon: '🏢', label: 'Suporte empresarial' },
  { icon: '🇧🇷', label: 'Todo o Brasil' },
]

export default function FixoEmpresaHomeSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden" style={{ background: '#060d0f' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(3,194,195,0.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div data-aos="fade-right">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#03C2C3' }}>
              Siga Fibra Empresarial
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
              Telefone Fixo para{' '}
              <span style={{ color: '#03C2C3' }}>
                empresas
              </span>
              ,<br />sem limites de chamadas.
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-md text-gray-400">
              Linha fixa empresarial com chamadas ilimitadas para fixo e celular em todo o Brasil. Identificador de chamadas incluso e portabilidade gratuita.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {diferenciais.map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(3,194,195,0.07)', border: '1px solid rgba(3,194,195,0.15)' }}
                >
                  <span className="text-base">{f.icon}</span>
                  <span className="text-sm font-semibold text-white">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/empresa/telefonia/fixo')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                style={{ background: '#03C2C3' }}
              >
                Saber mais sobre o Siga Fixo
                <span>→</span>
              </button>
              <a
                href="tel:8531989555"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:text-[#03C2C3]"
                style={{ border: '1px solid rgba(3,194,195,0.3)', color: '#03C2C3' }}
              >
                (85) 3198-9555
              </a>
            </div>
          </div>

          {/* Right, info card */}
          <div data-aos="fade-left" data-aos-delay="80">
            <div className="relative rounded-3xl p-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#03C2C3' }}>
                Siga Fixo Empresarial
              </p>
              <h3 className="text-2xl font-extrabold text-white mb-1">
                Planos sob medida
              </h3>
              <p className="text-sm text-gray-500 mb-8">de acordo com o porte da sua empresa</p>

              <ul className="flex flex-col gap-3 mb-8">
                {benefits.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0" style={{ color: '#03C2C3' }}>✓</span>
                    <span className="text-sm font-semibold text-white">{f.label}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-gray-600 mb-6">* Requer serviço de internet Siga Fibra Empresarial ativo</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/empresa/telefonia/fixo')}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: '#03C2C3' }}
                >
                  Ver detalhes do Siga Fixo →
                </button>
                <a
                  href="tel:8531989555"
                  className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 hover:text-[#03C2C3]"
                  style={{ border: '1px solid rgba(3,194,195,0.25)', color: '#03C2C3' }}
                >
                  Falar com consultor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
