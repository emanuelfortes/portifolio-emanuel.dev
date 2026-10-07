'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

export default function CtaBanner() {
  const router = useRouter()
  return (
    <section className="py-12 md:py-20 relative overflow-hidden" style={{ background: '#27CAA3' }}>
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p data-aos="fade-up" className="text-xs font-bold uppercase tracking-widest mb-4 text-white opacity-80">
          Sem complicação
        </p>
        <h2 data-aos="fade-up" data-aos-delay="60" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-5">
          Instale hoje. Navegue amanhã.
        </h2>
        <p data-aos="fade-up" data-aos-delay="120" className="text-lg mb-10 text-white opacity-80">
          Técnicos certificados, agendamento online e ativação em até 24 horas.
        </p>
        <div data-aos="fade-up" data-aos-delay="180">
          <button
            onClick={() => router.push('/pessoa-fisica/internet-fibra')}
            className="font-bold px-10 py-4 rounded-2xl text-sm uppercase tracking-wide bg-white transition-all duration-200"
            style={{ color: '#27CAA3' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            Quero instalar agora
          </button>
        </div>
      </div>
    </section>
  )
}
