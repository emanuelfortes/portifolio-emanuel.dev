'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

const comparisons = [
  {
    feature: 'Velocidade de upload',
    fibra: 'Igual ao download (simétrica)',
    cabo: 'Muito inferior ao download',
    win: true,
  },
  {
    feature: 'Estabilidade',
    fibra: 'Constante, sem interferências',
    cabo: 'Cai em horário de pico',
    win: true,
  },
  {
    feature: 'Latência (ping)',
    fibra: 'Ultrabaixa, ideal para games',
    cabo: 'Alta, prejudica jogos e calls',
    win: true,
  },
  {
    feature: 'Interferência elétrica',
    fibra: 'Zero, sinal de luz',
    cabo: 'Sujeito a ruídos elétricos',
    win: true,
  },
  {
    feature: 'Limite de distância',
    fibra: 'Dezenas de km sem perda',
    cabo: 'Degrada em longas distâncias',
    win: true,
  },
  {
    feature: 'Velocidade máxima',
    fibra: 'Até 2.5 Gb, escalável',
    cabo: 'Limitado a centenas de Mb',
    win: true,
  },
]

const steps = [
  {
    n: '01',
    title: 'Escolha seu plano',
    desc: 'Selecione a velocidade ideal para sua casa no nosso site ou pelo WhatsApp.',
  },
  {
    n: '02',
    title: 'Agendamento',
    desc: 'Nossa equipe entra em contato para agendar a instalação no melhor horário para você.',
  },
  {
    n: '03',
    title: 'Instalação técnica',
    desc: 'Técnicos certificados instalam o cabeamento de fibra óptica e configuram seu roteador Wi-Fi.',
  },
  {
    n: '04',
    title: 'Navegando em até 48h',
    desc: 'Sua conexão ativada, testada e pronta. Suporte disponível caso precise de qualquer ajuste.',
  },
]

export default function DiferenciaisInternetFibra() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden" style={{ background: '#060d0f' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(39,202,163,0.07), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

        {/*, Installation steps, */}
        <div className="text-center mb-14" data-aos="fade-up">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#27CAA3' }}
          >
            Instalação
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Como funciona a instalação
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Simples, rápida e sem complicação. Da contratação ao Wi-Fi funcionando em até 48 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="80">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-px z-0"
                  style={{ background: 'linear-gradient(90deg, rgba(39,202,163,0.4), rgba(39,202,163,0.05))', width: 'calc(100% - 2.5rem)', left: '80%' }}
                />
              )}

              <div
                className="relative z-10 rounded-2xl p-6 h-full"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 font-black text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #3ddcbc 0%, #27CAA3 100%)',
                    color: '#0f2d22',
                  }}
                >
                  {step.n}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div data-aos="fade-up" data-aos-delay="120" className="text-center mt-14">
          <button
            onClick={() => router.push('/pessoa-fisica/atendimento/canais')}
            className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-2xl text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
            style={{ background: '#27CAA3' }}
          >
            Agendar instalação
            <span>→</span>
          </button>
        </div>

      </div>
    </section>
  )
}
