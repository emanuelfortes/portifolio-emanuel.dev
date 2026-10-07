import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { ChevronRight } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Tratamentos Urológicos Fortaleza | Dr. Érico Diógenes' },
  description:
    'Tratamentos urológicos em Fortaleza: cirurgia robótica, HoLEP a laser, cirurgia de cálculo renal, postectomia e orquiectomia. Dr. Érico Diógenes, urologista.',
  alternates: { canonical: '/tratamentos' },
  openGraph: {
    title: 'Tratamentos Urológicos Fortaleza | Dr. Érico Diógenes',
    description:
      'Da cirurgia robótica ao tratamento a laser da próstata: os procedimentos e como a via é escolhida.',
    url: '/tratamentos',
  },
}

const destaques = [
  {
    nome: 'Cirurgia Robótica',
    href: '/cirurgia-robotica',
    resumo:
      'Visão tridimensional ampliada e instrumentos que articulam como um punho. Aplicada em próstata, rim e bexiga.',
    tag: 'Minimamente invasiva',
    img: '/demos/dr-erico/img/post/imgid01_01.webp',
  },
  {
    nome: 'HoLEP, laser para próstata',
    href: '/holep',
    resumo:
      'Tratamento a laser da próstata aumentada, feito por via endoscópica, sem nenhuma incisão externa.',
    tag: 'Sem corte',
    img: '/demos/dr-erico/img/post/imgid05_01.webp',
  },
  {
    nome: 'Cirurgia de Cálculo Renal',
    href: '/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal',
    resumo:
      'Tratamento a laser e demais técnicas para pedra nos rins, com escolha conforme tamanho e localização do cálculo.',
    tag: 'A laser',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
  },
  {
    nome: 'Cirurgia Urológica: as vias',
    href: '/tratamentos/cirurgia-urologica',
    resumo:
      'Aberta, laparoscópica, robótica ou endoscópica. O que diferencia cada uma e como a via é escolhida.',
    tag: 'Entenda as opções',
    img: '/demos/dr-erico/img/post/imgid12_01.webp',
  },
  {
    nome: 'Postectomia',
    href: '/tratamentos/postectomia',
    resumo:
      'Cirurgia de fimose em adulto. Procedimento ambulatorial, em geral com anestesia local e sedação.',
    tag: 'Ambulatorial',
    img: '/demos/dr-erico/img/post/imgid14_02.webp',
  },
  {
    nome: 'Orquiectomia',
    href: '/tratamentos/orquiectomia',
    resumo:
      'Cirurgia do testículo. Indicações, tipos, prótese testicular e o que muda na função sexual e na fertilidade.',
    tag: 'Uro-oncologia',
    img: '/demos/dr-erico/img/post/imgid19_01.webp',
  },
]

const roboticas = [
  { nome: 'Cirurgia Robótica de Próstata', href: '/tratamentos/cirurgia-robotica/prostata' },
  { nome: 'Cirurgia Robótica de Rim', href: '/tratamentos/cirurgia-robotica/rim' },
  { nome: 'Cirurgia Robótica de Bexiga', href: '/tratamentos/cirurgia-robotica/bexiga' },
]

const faq = [
  {
    q: 'Toda indicação cirúrgica é imediata?',
    a: 'Não. Em muitas condições urológicas existe espaço para acompanhamento clínico antes da cirurgia, e parte dos pacientes permanece assim por anos. A cirurgia entra quando o tratamento conservador não é suficiente, quando há complicação ou quando o quadro compromete a qualidade de vida.',
  },
  {
    q: 'Cirurgia robótica é sempre a melhor opção?',
    a: 'Não. É uma opção entre outras, e a indicação depende do procedimento, do estágio da doença, de cirurgias abdominais anteriores e das condições clínicas. Em parte dos casos a via aberta ou a endoscópica continua sendo a melhor decisão.',
  },
  {
    q: 'Onde as cirurgias são realizadas?',
    a: 'Em hospital com a estrutura exigida pelo procedimento, e não no consultório. A definição considera o tipo de cirurgia, o equipamento necessário e o seu convênio, e é discutida na consulta que antecede o procedimento.',
  },
  {
    q: 'Posso buscar segunda opinião?',
    a: 'Pode e deve, sempre que sentir necessidade. Diante de uma indicação cirúrgica, entender as alternativas e os prós e contras de cada uma faz parte da decisão. Bom profissional não se incomoda com segunda opinião.',
  },
  {
    q: 'Como me preparo para a cirurgia?',
    a: 'As orientações gerais de preparo, incluindo exames, ajuste de medicamentos e jejum, estão na página de orientações pré-operatórias. As instruções específicas do seu procedimento são entregues na consulta que antecede a cirurgia e prevalecem sobre qualquer orientação geral.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Tratamentos', item: 'https://drericodiogenes.com.br/tratamentos' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function Tratamentos() {
  return (
    <>
      <MedicalWebPageSchema
        name="Tratamentos Urológicos em Fortaleza"
        description="Cirurgia robótica, HoLEP a laser, cálculo renal, postectomia e orquiectomia. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/tratamentos"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Tratamentos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Tratamentos urológicos.{' '}
                <span className="text-brand-gold">E o critério por trás de cada indicação.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Nem toda condição urológica precisa de cirurgia, e nem toda cirurgia precisa da técnica mais moderna. O que define a conduta é o diagnóstico, o estágio e as suas condições clínicas, não o equipamento disponível.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/tratamentos/cirurgia-urologica" className="btn-silver">
                  Entenda as Vias
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-1.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — TRATAMENTOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O que é realizado</p>
            <h2 className="section-title mt-2">PRINCIPAIS TRATAMENTOS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {destaques.map((d, i) => (
              <Link
                key={d.nome}
                href={d.href}
                className="group bg-white rounded-2xl overflow-hidden shadow-card border border-black/5 flex flex-col hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 70}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.nome} className="w-full h-40 object-cover" loading="lazy" />
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-semibold bg-brand-beige rounded-full px-3 py-1 self-start text-brand-navy">{d.tag}</span>
                  <h3 className="font-display text-lg text-brand-navy mt-3">{d.nome}</h3>
                  <p className="text-sm text-brand-muted mt-2 flex-1">{d.resumo}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-navy mt-4 font-medium group-hover:text-brand-gold transition-colors">
                    Saiba mais <ChevronRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — ROBÓTICAS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Por órgão</p>
            <h2 className="section-title mt-2">CIRURGIA ROBÓTICA EM UROLOGIA</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {roboticas.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white rounded-2xl p-6 shadow-card text-center hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <h3 className="font-display text-base text-brand-navy">{r.nome}</h3>
                <span className="inline-flex items-center gap-1 text-sm text-brand-muted mt-3 group-hover:text-brand-gold transition-colors">
                  Ver página <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — ESPECIALISTA */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">A INDICAÇÃO VEM ANTES DA TÉCNICA</h2>
            <p className="text-brand-muted mt-4">
              A primeira pergunta não é qual cirurgia fazer, e sim se a cirurgia é necessária agora. Em muitas condições urológicas existe espaço para acompanhamento, e parte dos pacientes permanece assim por anos com boa qualidade de vida.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é doutor em Urologia pela USP, com fellowship em uro-oncologia pelo Hospital Sírio-Libanês e formação em cirurgia robótica pelo Hospital Albert Einstein. Atende no Pátio Dom Luís, na Aldeota.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/dr-erico-diogenes" className="btn-silver">
                Conheça o Dr. Érico
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-7.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Recebeu indicação de cirurgia? Entenda as opções antes de decidir." />
    </>
  )
}
