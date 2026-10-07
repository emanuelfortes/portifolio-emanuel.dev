'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

export default function CtaBannerEmpresa() {
  const router = useRouter()
  return (
    <section className="py-12 md:py-20 relative overflow-hidden" style={{ background: '#03C2C3' }}>
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p data-aos="fade-up" className="text-xs font-bold uppercase tracking-widest mb-4 text-white opacity-80">
          Pronto para começar?
        </p>
        <h2 data-aos="fade-up" data-aos-delay="60" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-5">
          Leve sua empresa para o próximo nível.
        </h2>
        <p data-aos="fade-up" data-aos-delay="120" className="text-lg mb-10 text-white opacity-80">
          Um consultor entra em contato em até 2 horas úteis para montar a solução ideal para o seu negócio.
        </p>
        <div data-aos="fade-up" data-aos-delay="180" className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/empresa/atendimento/canais')}
            className="font-bold px-6 sm:px-10 py-4 rounded-2xl text-sm uppercase tracking-wide bg-white transition-all duration-200"
            style={{ color: '#03C2C3' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            Solicitar proposta gratuita
          </button>
          <button
            onClick={() => router.push('/empresa/atendimento/baixe-app')}
            className="font-semibold px-6 sm:px-10 py-4 rounded-2xl text-sm text-white transition-all duration-200"
            style={{ border: '2px solid rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
          >
            Baixe nosso app
          </button>
        </div>
      </div>
    </section>
  )
}
