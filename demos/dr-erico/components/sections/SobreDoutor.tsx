import Link from '@/demos/dr-erico/lib/Link'

export default function SobreDoutor() {
  return (
    <section className="bg-brand-beige-light py-16 md:py-20">
      <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative flex justify-center" data-aos="fade-right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/demos/dr-erico/img/dr-erico-foto-4.webp"
            alt="Dr. Érico Diógenes em cirurgia"
            loading="lazy"
            className="rounded-3xl shadow-soft w-full aspect-square object-cover object-[center_35%]"
          />
        </div>

        <div data-aos="fade-left">
          <p className="eyebrow">Quem Somos</p>
          <h2 className="section-title mt-2">
            Conheça o <span className="text-brand-gold">Dr. Érico Diógenes</span>
          </h2>
          <p className="mt-5 text-brand-muted">
            Referência em cirurgia robótica, tratamento a laser e cuidados avançados para a saúde
            masculina. Doutor em Urologia pela USP, com especialização no Hospital Sírio-Libanês e
            na França, oferece tecnologia de ponta e atendimento humanizado para garantir mais
            segurança, conforto e recuperação rápida.
          </p>
          <Link href="/dr-erico-diogenes" className="btn-silver mt-8">
            Conheça
          </Link>
        </div>
      </div>
    </section>
  )
}
