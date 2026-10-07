import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { ChevronRight } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Saúde Sexual Masculina Fortaleza | Andrologia — Dr. Érico Diógenes' },
  description:
    'Saúde masculina e andrologia em Fortaleza: disfunção erétil, ejaculação precoce, baixa testosterona, infertilidade e vasectomia. Dr. Érico Diógenes.',
  alternates: { canonical: '/saude-masculina' },
  openGraph: {
    title: 'Saúde Sexual Masculina Fortaleza | Dr. Érico Diógenes',
    description: 'Andrologia completa em Fortaleza com Dr. Érico Diógenes: disfunção erétil, ejaculação precoce, testosterona, infertilidade masculina e vasectomia.',
    url: '/saude-masculina',
  },
}

const temas = [
  {
    titulo: 'Disfunção Erétil',
    dado: 'Afeta 50% dos homens acima de 40 anos',
    desc: 'Mais do que um problema sexual: a disfunção erétil é frequentemente o primeiro sinal de doença cardiovascular. Tratamento eficaz existe para mais de 90% dos casos.',
    href: '/saude-masculina/disfuncao-eretil',
    img: '/demos/dr-erico/img/post/imgid14_01.webp',
  },
  {
    titulo: 'Ejaculação Precoce',
    dado: 'A disfunção sexual masculina mais comum no mundo',
    desc: 'Afeta 20-30% dos homens em algum momento. Não é frescura nem fraqueza: tem base neurobiológica em muitos casos e tratamento com alta eficácia.',
    href: '/saude-masculina/ejaculacao-precoce',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    titulo: 'Baixa Testosterona',
    dado: 'Queda de 1-2% ao ano a partir dos 30',
    desc: 'Fadiga, perda de libido, ganho de peso, depressão: sintomas que muitos homens atribuem ao envelhecimento têm causa hormonal identificável e tratável.',
    href: '/saude-masculina/baixa-testosterona',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
  },
  {
    titulo: 'Infertilidade Masculina',
    dado: 'Fator masculino em 50% dos casos de infertilidade',
    desc: 'Metade dos casais que não conseguem engravidar tem causa masculina, mas a investigação do homem ainda é subestimada. O espermograma é o ponto de partida.',
    href: '/saude-masculina/infertilidade',
    img: '/demos/dr-erico/img/post/imgid03_02.webp',
  },
  {
    titulo: 'Vasectomia',
    dado: 'Método mais seguro e definitivo de contracepção masculina',
    desc: 'Procedimento ambulatorial de 20 minutos, sem internação, com recuperação em 48 horas. Mais simples que a laqueadura feminina e igualmente definitivo.',
    href: '/saude-masculina/vasectomia',
    img: '/demos/dr-erico/img/post/imgid02_01.webp',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Saúde Masculina', item: 'https://drericodiogenes.com.br/saude-masculina' },
  ],
}

export default function SaudeMasculina() {
  return (
    <>
      <MedicalWebPageSchema
        name="Saúde Sexual Masculina e Andrologia em Fortaleza"
        description="Andrologia completa em Fortaleza: disfunção erétil, ejaculação precoce, baixa testosterona, infertilidade masculina e vasectomia. Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/saude-masculina"
        specialty="Urology"
      />


      {/* HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Andrologia · Saúde Sexual · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                O homem brasileiro vai ao médico 3 vezes menos que a mulher.{' '}
                <span className="text-brand-gold">A maioria dos problemas que o impedem de viver plenamente tem solução.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                Disfunção erétil, ejaculação precoce, baixa testosterona, infertilidade: assuntos que o homem raramente discute e que, por isso, raramente trata. A andrologia existe para isso, com protocolos eficazes e abordagem clínica sem julgamentos.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Consultar em Fortaleza
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/dr-erico/img/dr-erico-foto-3.webp" alt="Saúde masculina e andrologia em Fortaleza" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* TEMAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Andrologia completa</p>
            <h2 className="section-title mt-2">SAÚDE SEXUAL E REPRODUTIVA MASCULINA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Cada tema abaixo é abordado com profundidade clínica, sem eufemismos e com base em evidências. Escolha o que se aplica ao seu caso.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {temas.map((t, i) => (
              <Link key={t.titulo} href={t.href} className="group bg-brand-beige-light rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow" data-aos="fade-up" data-aos-delay={i * 80}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.titulo} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display text-lg text-brand-navy">{t.titulo}</h3>
                    <ChevronRight size={16} className="shrink-0 mt-1 text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs font-semibold text-brand-gold mb-2">{t.dado}</p>
                  <p className="text-sm text-brand-muted">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DR. ÉRICO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-5.webp" alt="Dr. Érico Diógenes, andrologia Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Andrologia em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A saúde sexual masculina é tratada com o mesmo rigor científico que qualquer outra especialidade médica. Disfunção erétil tem diagnóstico diferencial, exames específicos e tratamentos com resultados demonstrados em ensaios clínicos. Ejaculação precoce tem fenotipos diferentes e respostas diferentes a cada abordagem. Baixa testosterona tem critérios diagnósticos e indicações precisas de reposição hormonal.
              </p>
              <p>
                O Dr. Érico Diógenes conduz a investigação andrológica completa em Fortaleza, com avaliação clínica detalhada, exames hormonais, espermograma e tratamento individualizado para cada condição. A consulta é conduzida em ambiente de absoluta privacidade e sem julgamentos, com o objetivo de restaurar a qualidade de vida do paciente.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar Consulta</a>
              <Link href="/dr-erico-diogenes" className="btn-silver">Conhecer o Dr. Érico</Link>
            </div>
          </div>
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Saúde masculina tem solução. Consulte Dr. Érico Diógenes em Fortaleza." />
    </>
  )
}
