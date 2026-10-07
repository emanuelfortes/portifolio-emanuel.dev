'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const plans = [
  {
    gb: 5,
    benefits: ['Ligações ilimitadas', 'WhatsApp liberado', 'Waze liberado'],
    price: '34,99',
    featured: false,
    badge: null,
  },
  {
    gb: 19,
    benefits: ['Ligações ilimitadas', 'WhatsApp liberado', 'Waze liberado'],
    price: '59,99',
    featured: true,
    badge: 'Mais escolhido',
  },
  {
    gb: 45,
    benefits: ['Ligações ilimitadas', 'WhatsApp liberado', 'Waze liberado'],
    price: '89,99',
    featured: false,
    badge: null,
  },
]

const bottomBenefits = [
  'Ligações ilimitadas para qualquer operadora',
  'WhatsApp liberado',
  'Waze liberado',
  'Portabilidade gratuita',
  'Qualquer fixo ou móvel',
]

const featureBadges = [
  { label: 'Ligações ilimitadas' },
  { label: 'WhatsApp liberado' },
  { label: 'Waze liberado' },
  { label: 'Portabilidade grátis' },
]

export default function ChipMovelEmpresaSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--bg-light-alt)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 15% 50%, rgba(3,194,195,0.12), transparent), radial-gradient(ellipse 50% 80% at 85% 20%, rgba(3,194,195,0.08), transparent)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-14">

          {/* Left, headline + feature badges */}
          <div className="relative" data-aos="fade-right">
            <div
              className="absolute -top-10 -left-10 w-72 h-72 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(3,194,195,0.12) 0%, transparent 70%)',
                filter: 'blur(48px)',
              }}
            />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#03C2C3' }}>
                Siga Fibra Empresarial
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text-dark)' }}>
                Internet Móvel{' '}
                <span style={{ color: '#03C2C3' }}>
                  5G
                </span>
                ,<br />
                Chip e Conectividade
                <br />
                sem limites
              </h2>

              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: 'var(--text-mid)' }}>
                Navegue com velocidade máxima, cobertura nacional e benefícios exclusivos para
                usar sua internet onde quiser.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {featureBadges.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{
                      background: 'rgba(3,194,195,0.07)',
                      border: '1px solid rgba(3,194,195,0.18)',
                    }}
                  >
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{f.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/empresa/telefonia/celular')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                style={{ background: '#03C2C3' }}
              >
                Escolher plano
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right, plan cards */}
          <div className="flex flex-col gap-4" data-aos="fade-left" data-aos-delay="80">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-6 transition-all duration-200"
                style={
                  plan.featured
                    ? {
                        background: 'linear-gradient(135deg, rgba(3,194,195,0.13), rgba(3,194,195,0.06))',
                        border: '1.5px solid rgba(3,194,195,0.45)',
                        boxShadow: '0 0 32px rgba(3,194,195,0.13)',
                      }
                    : {
                        background: 'var(--card-bg)',
                        border: '1px solid rgba(3,194,195,0.25)',
                      }
                }
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-6 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white"
                    style={{
                      background: '#03C2C3',
                      boxShadow: '0 2px 8px rgba(3,194,195,0.4)',
                    }}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-end gap-1 mb-3">
                      <span
                        className="font-extrabold leading-none"
                        style={{ fontSize: '2.25rem', color: 'var(--text-dark)' }}
                      >
                        {plan.gb}
                      </span>
                      <span
                        className="font-bold mb-1"
                        style={{ fontSize: '1rem', color: '#03C2C3' }}
                      >
                        GB
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {plan.benefits.map((b, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <span style={{ color: '#03C2C3' }}>✓</span>
                          <span style={{ color: 'var(--text-mid)' }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>por mês</p>
                      <p className="font-extrabold leading-tight" style={{ fontSize: '1.35rem', color: 'var(--text-dark)' }}>
                        R$ {plan.price}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/empresa/telefonia/celular')}
                      className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                      style={{ background: '#03C2C3' }}
                    >
                      Assinar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
          * Franquia + chip com contratação de uma internet banda larga. O plano móvel é exclusivo para clientes Siga Fibra com internet banda larga ativa.
        </p>

        {/* Bottom benefits strip */}
        <div
          className="rounded-2xl p-5 md:p-6"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid rgba(3,194,195,0.2)',
          }}
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {bottomBenefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(3,194,195,0.07)',
                  border: '1px solid rgba(3,194,195,0.2)',
                  color: 'var(--text-dark)',
                }}
              >
                <span style={{ color: '#03C2C3' }}>✔</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
