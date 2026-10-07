import Link from '@/demos/dr-erico/lib/Link'

type Card = {
  title: string
  description: string
  cta: string
  to: string
  image: string
}

const cards: Card[] = [
  {
    title: 'Check-Up Urológico',
    description:
      'Rastreamento, prevenção e avaliação periódica voltados para homens que buscam atenção preventiva, acompanhamento individualizado e cuidado contínuo com a saúde urológica.',
    cta: 'Agendar Consulta',
    to: '/contato',
    image:
      '/demos/dr-erico/img/post/imgid14_02.webp',
  },
  {
    title: 'Tratamento a Laser HoLEP para Próstata',
    description:
      'Tratamento inovador com tecnologia a laser para Hiperplasia Prostática Benigna (HPB), ou próstata aumentada.',
    cta: 'Agendar Consulta',
    to: '/contato',
    image:
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Cirurgia Robótica em Urologia',
    description:
      'Tratamento inovador e tecnológico para câncer e tumores da próstata, rins, bexiga e uretra.',
    cta: 'Agendar Consulta',
    to: '/contato',
    image:
      '/demos/dr-erico/img/dr-erico-foto-5b.webp',
  },
  {
    title: 'Cálculos Urinários',
    description:
      'Avaliação completa, tratamento com técnicas minimamente invasivas e orientação para prevenção da recorrência, sempre conforme a necessidade clínica.',
    cta: 'Agendar Consulta',
    to: '/contato',
    image:
      '/demos/dr-erico/img/post/imgid08_01.webp',
  },
  {
    title: 'Uro-Oncologia',
    description:
      'Atendimento individualizado para câncer de próstata, rim, bexiga e testículo, com condutas baseadas em evidências e práticas atualizadas, priorizando acolhimento, segurança e tomada de decisão compartilhada.',
    cta: 'Agendar Consulta',
    to: '/contato',
    image:
      '/demos/dr-erico/img/post/imgid02_01.webp',
  },
  {
    title: 'Andrologia e Saúde Sexual Masculina',
    description:
      'Avaliação integral da saúde do homem, incluindo disfunção erétil, alterações hormonais, infertilidade masculina e planejamento familiar, como vasectomia. Também realiza reversão de vasectomia conforme avaliação clínica.',
    cta: 'Agendar Consulta',
    to: '/contato',
    image:
      '/demos/dr-erico/img/post/imgid11_01.webp',
  },
]

export default function Diferenciais() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-site">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="eyebrow">Conheça nossos</p>
          <h2 className="section-title mt-2">Tratamentos</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl border border-black/5 shadow-card overflow-hidden flex flex-col"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.image} alt={card.title} className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl text-brand-navy">{card.title}</h3>
                <p className="text-sm text-brand-muted mt-3 flex-1">{card.description}</p>
                <Link href={card.to} className="btn-silver mt-5 justify-center">
                  {card.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
