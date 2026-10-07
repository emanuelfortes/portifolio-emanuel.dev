import Link from '@/demos/dr-erico/lib/Link'
import Image from 'next/image'

export default function CirurgiaRoboticaHighlight() {
  return (
    <section className="bg-brand-beige-light py-16 md:py-20">
      <div className="container-site">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="eyebrow">Conheça a</p>
          <h2 className="section-title mt-2">
            Cirurgia Robótica, <span className="text-brand-gold">o método mais eficaz para câncer de próstata, rins e bexiga.</span>
          </h2>
          <Link
            href="/cirurgia-robotica"
            className="inline-block mt-5 text-brand-gold font-medium hover:underline"
          >
            Quero saber mais →
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h3 className="font-display text-2xl md:text-3xl text-brand-navy">
              Cuidado revolucionário <span className="text-brand-gold">com a saúde masculina</span>
            </h3>
            <ul className="mt-6 space-y-3">
              {[
                'Alta precisão na remoção da próstata',
                'Menos dor e desconforto no pós-operatório',
                'Retorno mais rápido às atividades normais',
                'Menor risco de disfunção erétil quando comparado a técnicas tradicionais',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-white text-xs">
                    ✓
                  </span>
                  <span className="text-brand-muted">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/cirurgia-robotica" className="btn-silver mt-8">
              Saiba mais
            </Link>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-soft">
              <Image unoptimized
                src="/demos/dr-erico/img/post/imgid10_02.webp"
                alt="Sala de cirurgia robótica"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
