'use client'

import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'

export default function AmigoIndicaSection() {
  const router = useRouter()

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: '#060d0f' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(39,202,163,0.09), transparent)',
      }} />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(39,202,163,0.13) 0%, rgba(3,194,195,0.07) 100%)',
            border: '1.5px solid rgba(39,202,163,0.25)',
          }}>

          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, #27CAA3, #03C2C3)' }} />

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
                style={{ background: 'rgba(39,202,163,0.12)', border: '1px solid rgba(39,202,163,0.25)', color: '#27CAA3' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#27CAA3', animation: 'pulse 2s infinite' }} />
                Programa Amigo Indica
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Indique um amigo e{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #27CAA3, #03C2C3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ganhe 1 mês grátis.
                </span>
              </h2>

              <p className="text-gray-400 leading-relaxed mb-8 max-w-md lg:mx-0 mx-auto">
                A cada amigo que contratar a Siga Fibra pela sua indicação, você recebe{' '}
                <strong className="text-white">100% de desconto</strong> em uma mensalidade. Sem complicação.
              </p>

              <button
                onClick={() => router.push('/pessoa-fisica/amigo-indica')}
                className="font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wide text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #27CAA3, #03C2C3)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Saiba como participar
              </button>
            </div>

            {/* Right, benefit cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: '100%', label: 'de desconto por indicação confirmada' },
                { value: '∞', label: 'sem limite de indicações' },
                { value: 'Fácil', label: 'indique pelo app ou site oficial' },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl p-5 flex flex-col items-center text-center gap-2"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-2xl font-extrabold" style={{ color: '#27CAA3' }}>{card.value}</p>
                  <p className="text-xs text-gray-500 leading-snug">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          *Consulte as regras e condições aplicáveis.*
        </p>
      </div>
    </section>
  )
}
