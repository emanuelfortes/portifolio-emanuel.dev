import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check, ChevronRight } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'
import FaqAccordion, { faqPageSchema } from '@/demos/dr-erico/components/ui/FaqAccordion'

export const metadata: Metadata = {
  title: { absolute: 'Uro-Oncologia Fortaleza | Câncer Urológico — Dr. Érico Diógenes' },
  description:
    'Uro-oncologia em Fortaleza com Dr. Érico Diógenes: diagnóstico e tratamento do câncer de próstata, rim, bexiga e testículo. Especialista em oncologia urológica no Ceará.',
  alternates: { canonical: '/condicoes-urologicas/uro-oncologia' },
  openGraph: {
    title: 'Uro-Oncologia Fortaleza | Dr. Érico Diógenes',
    description: 'Tratamento dos cânceres urológicos em Fortaleza: próstata, rim, bexiga e testículo. Dr. Érico Diógenes, referência em uro-oncologia no Ceará.',
    url: '/condicoes-urologicas/uro-oncologia',
  },
}

const canceres = [
  {
    nome: 'Câncer de Próstata',
    dados: '+65.000 novos casos/ano no Brasil',
    resumo: 'O mais prevalente entre os homens brasileiros. Rastreamento com PSA e toque retal a partir dos 40 anos é a principal estratégia de detecção precoce.',
    alerta: 'Geralmente assintomático nos estágios iniciais',
    href: '/condicoes-urologicas/prostata/cancer-prostata',
    img: '/demos/dr-erico/img/post/imgid05_01.webp',
  },
  {
    nome: 'Câncer de Rim',
    dados: '~11.000 novos casos/ano no Brasil',
    resumo: 'Frequentemente diagnosticado por acidente em exames de imagem. Quando localizado, a cirurgia robótica com preservação do rim tem taxa de cura superior a 90%.',
    alerta: 'Mais de 50% dos casos são descobertos por acaso',
    href: '/condicoes-urologicas/uro-oncologia/cancer-rim',
    img: '/demos/dr-erico/img/post/imgid04_02.webp',
  },
  {
    nome: 'Câncer de Bexiga',
    dados: '~9.000 novos casos/ano no Brasil',
    resumo: 'O sintoma principal é o sangue na urina sem dor. Fortemente associado ao tabagismo. A maioria dos casos é superficial e tratável por endoscopia.',
    alerta: 'Sangue na urina sem dor é sinal de alerta',
    href: '/condicoes-urologicas/uro-oncologia/cancer-bexiga',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    nome: 'Câncer de Testículo',
    dados: 'O mais curável: taxa de cura superior a 95%',
    resumo: 'Mais comum em homens de 15 a 35 anos. Detectado precocemente pelo autoexame, é o câncer sólido com maior taxa de cura na medicina moderna.',
    alerta: 'Acomete principalmente homens jovens entre 15-35 anos',
    href: '/condicoes-urologicas/uro-oncologia/cancer-testiculo',
    img: '/demos/dr-erico/img/post/imgid14_01.webp',
  },
]

const sinaisAlerta = [
  'Sangue na urina (hematúria) — mesmo que apareça uma única vez',
  'PSA elevado ou com ascensão rápida nos exames de rotina',
  'Nódulo ou endurecimento no testículo ao autoexame',
  'Perda de peso não intencional associada a sintomas urinários',
  'Dor lombar persistente sem causa musculoesquelética clara',
  'Massa no flanco ou abdômen superior palpável',
  'Dificuldade urinária progressiva, especialmente acima dos 50 anos',
]


/**
 * PLANO DE RECUPERAÇÃO · ITEM 14 · FAQPage nas páginas de tratamento.
 *
 * Alimenta ao mesmo tempo a seção visível e o JSON-LD, a partir deste array,
 * para que nunca divirjam.
 */
const faq = [
  {
    q: 'O que é uro-oncologia?',
    a: 'É a área da urologia dedicada aos tumores do aparelho urinário e do sistema reprodutor masculino: próstata, rim, bexiga, testículo, ureter e pênis. Reúne o diagnóstico, o tratamento cirúrgico e o acompanhamento de longo prazo desses casos, geralmente em conjunto com oncologia clínica e radioterapia.',
  },
  {
    q: 'Câncer urológico dá sintoma no começo?',
    a: 'Muitas vezes não. O câncer de próstata costuma ser assintomático nos estágios iniciais, e é por isso que o rastreamento existe. Outros dão sinais que passam despercebidos, como sangue na urina sem dor, caroço no testículo ou perda de peso sem explicação. Sintoma ausente não é sinônimo de ausência de doença.',
  },
  {
    q: 'Quais sinais merecem avaliação sem esperar?',
    a: 'Sangue na urina ou no sêmen, nódulo ou endurecimento em um testículo, dor lombar persistente que não melhora, jato urinário que piorou de forma rápida, e perda de peso sem causa aparente. Nenhum deles significa câncer por si só, e a maioria tem causa benigna, mas todos pedem investigação.',
  },
  {
    q: 'Todo tumor urológico precisa de cirurgia?',
    a: 'Não. A conduta depende do tipo, do estágio, do grau de agressividade e das condições de cada paciente. Existem casos de vigilância ativa, em que o tumor é acompanhado de perto sem tratamento imediato, e casos tratados com terapia focal, radioterapia ou tratamento sistêmico. A cirurgia é uma das opções, não a única.',
  },
  {
    q: 'Quando devo começar o rastreamento do câncer de próstata?',
    a: 'A avaliação costuma começar aos 50 anos, ou aos 45 para quem tem histórico familiar de câncer de próstata ou pertence a população de maior risco. Idade de início, exames e intervalo devem ser decididos em conversa com o urologista, porque rastrear também tem efeitos indesejados e a decisão é individual.',
  },
  {
    q: 'Câncer urológico tem cura?',
    a: 'Muitos têm, sobretudo quando descobertos cedo. Câncer de testículo e câncer de próstata localizado estão entre os de melhor prognóstico na medicina. O que mais pesa no resultado é o estágio no momento do diagnóstico, e é isso que torna a avaliação precoce tão decisiva.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Condições Urológicas', item: 'https://drericodiogenes.com.br/condicoes-urologicas' },
    { '@type': 'ListItem', position: 3, name: 'Uro-Oncologia', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia' },
  ],
}

export default function UroOncologia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Uro-Oncologia em Fortaleza: Câncer Urológico"
        description="Diagnóstico e tratamento dos cânceres urológicos em Fortaleza: próstata, rim, bexiga e testículo. Dr. Érico Diógenes, especialista em uro-oncologia no Ceará."
        url="https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Oncologia Urológica · Fortaleza, CE</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Os cânceres urológicos respondem por{' '}
                <span className="text-brand-gold">quase metade de todos os diagnósticos oncológicos masculinos no Brasil.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                Próstata, rim, bexiga e testículo: quatro órgãos, quatro doenças distintas, uma especialidade. A uro-oncologia reúne o conhecimento urológico e oncológico para oferecer o diagnóstico mais preciso e o tratamento mais eficaz para cada tipo de câncer do trato urinário.
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
            <img
              src="/demos/dr-erico/img/dr-erico-foto-1.webp"
              alt="Uro-oncologia em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — CANCERES */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Conheça cada diagnóstico</p>
            <h2 className="section-title mt-2">OS CÂNCERES UROLÓGICOS</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Cada câncer urológico tem biologia, sintomas, rastreamento e tratamento completamente distintos. O que une todos eles é um fator determinante: o diagnóstico precoce multiplica as chances de cura.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {canceres.map((c, i) => (
              <Link key={c.nome} href={c.href} className="group bg-brand-beige-light rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow" data-aos="fade-up" data-aos-delay={i * 80}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.nome} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-xl text-brand-navy">{c.nome}</h3>
                    <ChevronRight size={18} className="shrink-0 mt-1 text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs font-semibold text-brand-gold mb-2">{c.dados}</p>
                  <p className="text-sm text-brand-muted">{c.resumo}</p>
                  <p className="text-xs text-brand-navy font-medium mt-3 bg-white rounded-lg px-3 py-1.5">{c.alerta}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — SINAIS DE ALERTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Não ignore esses sinais</p>
            <h2 className="section-title mt-2">QUANDO CONSULTAR UM URO-ONCOLOGISTA</h2>
            <p className="text-brand-muted mt-4 mb-8">
              A maioria dos cânceres urológicos em estágio inicial não causa sintomas. Quando os sintomas aparecem, o tumor frequentemente já está avançado. Por isso, o rastreamento regular e a atenção a esses sinais de alerta são fundamentais.
            </p>
            <ul className="space-y-3">
              {sinaisAlerta.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 40}>
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-left">
            <div className="relative">
              <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demos/dr-erico/img/dr-erico-foto-5.webp" alt="Dr. Érico Diógenes, uro-oncologista Fortaleza" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Referência em uro-oncologia no Ceará</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A uro-oncologia é a especialidade que exige o domínio simultâneo da urologia cirúrgica e da oncologia clínica. O uro-oncologista define não apenas quando e como operar, mas também quando indicar quimioterapia, radioterapia, imunoterapia ou vigilância ativa, e como combinar essas modalidades para o melhor resultado.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes é referência no diagnóstico e tratamento dos cânceres urológicos, com formação pela Universidade Federal do Ceará e especialização em cirurgia minimamente invasiva e oncologia urológica. Realiza prostatectomias robóticas, nefrectomias parciais e radicais robóticas, cistectomias e orquiectomias, além de conduzir o acompanhamento oncológico de longo prazo.
              </p>
              <p>
                Para o Dr. Érico, o tratamento do câncer urológico começa antes do diagnóstico: com rastreamento, educação do paciente e a criação de uma relação de confiança que permite que sinais precoces sejam identificados no momento em que a cura ainda é a regra.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dr-erico-diogenes" className="btn-primary">Conhecer o Dr. Érico</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, uro-oncologia Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Dúvidas frequentes</p>
            <h2 className="section-title mt-2">SOBRE O CÂNCER UROLÓGICO</h2>
          </div>
          <FaqAccordion faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Diagnóstico precoce do câncer urológico salva vidas. Consulte em Fortaleza." />
    </>
  )
}
