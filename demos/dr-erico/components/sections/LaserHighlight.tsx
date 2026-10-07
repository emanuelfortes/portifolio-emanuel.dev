import Link from '@/demos/dr-erico/lib/Link'

export default function LaserHighlight() {
  return (
    <section className="bg-brand-navy text-white py-16 md:py-20 relative overflow-hidden">
      <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative" data-aos="fade-right">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-soft max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/post/imgid09_01.webp"
              alt="Dr. Érico Diógenes"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div data-aos="fade-left">
          <h2 className="font-display text-3xl md:text-4xl leading-tight">
            Tratamento a laser para próstata em Fortaleza:{' '}
            <span className="text-brand-gold">
              o mais avançado para Hiperplasia Prostática Benigna (HPB)
            </span>
          </h2>
          <p className="mt-5 text-white/80">
            Alternativa moderna, segura e minimamente invasiva para pacientes que sofrem com o
            aumento benigno da próstata e seus sintomas, como dificuldade para urinar, jato fraco e
            necessidade frequente de ir ao banheiro. Utilizando tecnologia de ponta, o laser remove
            ou reduz o tecido prostático excedente com alta precisão, proporcionando menor
            sangramento, menos dor e uma recuperação mais rápida em comparação às cirurgias
            convencionais.
          </p>
          <Link href="/holep" className="btn-silver mt-8">
            Saiba Mais
          </Link>
        </div>
      </div>
    </section>
  )
}
