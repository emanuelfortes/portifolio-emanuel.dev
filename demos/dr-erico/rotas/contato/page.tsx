import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/demos/dr-erico/lib/Link'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { site } from '@/demos/dr-erico/data/site'

export const metadata: Metadata = {
  title: { absolute: 'Agendar Consulta com Urologista Fortaleza | Contato' },
  description:
    'Agende sua consulta com o urologista Dr. Érico Diógenes em Fortaleza. Atendimento via WhatsApp e telefone. Pátio Dom Luís, Fortaleza – CE. Fale agora.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato | Dr. Érico Diógenes, Urologista em Fortaleza',
    description:
      'Agende sua consulta com o Dr. Érico Diógenes. Clínica localizada no Pátio Dom Luís, Fortaleza, CE.',
    url: '/contato',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Contato', item: 'https://drericodiogenes.com.br/contato' },
  ],
}

export default function Contato() {
  return (
    <>

      <section className="bg-brand-beige-light py-14 md:py-20">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h1 className="font-display text-4xl md:text-6xl text-brand-navy leading-tight">
              Fale com a gente
            </h1>
            <p className="mt-5 text-brand-muted max-w-md">
              Estamos à sua disposição para o agendamento de consultas, dúvidas sobre indicações
              cirúrgicas e procedimentos.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-full bg-brand-navy text-white flex items-center justify-center" aria-hidden>
                  <Phone size={18} />
                </span>
                <span className="text-brand-text">{site.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fale pelo WhatsApp"
                  className="h-12 w-12 rounded-full bg-brand-navy text-white flex items-center justify-center"
                >
                  <MessageCircle size={18} aria-hidden />
                </a>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-text hover:text-brand-gold"
                >
                  Fale por Whatsapp
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-full bg-brand-navy text-white flex items-center justify-center" aria-hidden>
                  <Mail size={18} />
                </span>
                <span className="text-brand-text">{site.email}</span>
              </li>
            </ul>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md ml-auto rounded-full overflow-hidden shadow-soft relative">
              <Image unoptimized
                src="/demos/dr-erico/img/dr-erico-foto-3.webp"
                alt="Dr. Érico Diógenes, Urologista em Fortaleza"
                fill
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site">
          <h2 className="section-title mb-10">Locais de atendimento</h2>

          <div className="grid gap-10 lg:grid-cols-3">
            {site.locations.map((loc, i) => (
              <div key={loc.name} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
                  <iframe
                    src={loc.mapEmbed}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Localização ${loc.name} em ${loc.city}`}
                  />
                </div>
                <div className="mt-5">
                  <h3 className="font-display text-xl text-brand-navy">{loc.name}</h3>
                  <p className="text-brand-muted text-sm mt-2 leading-relaxed">
                    {loc.street}
                    <br />
                    {loc.district}, {loc.city}
                  </p>
                  {loc.hours ? (
                    <p className="text-brand-muted text-sm mt-2">{loc.hours}</p>
                  ) : null}
                  {loc.phone ? (
                    <p className="text-brand-muted text-sm mt-1">{loc.phone}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/*
            Aviso de privacidade onde ele faz sentido: ao lado dos canais de
            contato, não escondido num rodapé.

            Tem efeito técnico junto. Sem este bloco, /termos-de-uso não
            receberia link de nenhuma página e a política de privacidade só
            seria alcançada a partir dos termos, deixando as duas isoladas do
            resto do site. Aqui elas recebem link de uma página indexada.

            O plano prevê esses links também no rodapé do site, o que depende
            de aprovação do Dr. Érico.
          */}
          <p className="mt-12 text-sm text-brand-muted text-center max-w-2xl mx-auto" data-aos="fade-up">
            O atendimento por WhatsApp e e-mail serve para agendamento e dúvidas administrativas,
            não para diagnóstico. Saiba como tratamos seus dados na{' '}
            <Link
              href="/politica-de-privacidade"
              className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors"
            >
              política de privacidade
            </Link>
            {' '}e quais são as condições de uso do site nos{' '}
            <Link
              href="/termos-de-uso"
              className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors"
            >
              termos de uso
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
