import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cirurgia Urológica Fortaleza | Vias e Técnicas — Dr. Érico Diógenes' },
  description:
    'Cirurgia urológica em Fortaleza: diferença entre cirurgia aberta, laparoscópica, robótica e endoscópica. Entenda como a via é escolhida. Dr. Érico Diógenes.',
  alternates: { canonical: '/tratamentos/cirurgia-urologica' },
  openGraph: {
    title: 'Cirurgia Urológica Fortaleza | Dr. Érico Diógenes',
    description:
      'Aberta, laparoscópica, robótica ou endoscópica: o que muda entre as vias e como a escolha é feita.',
    url: '/tratamentos/cirurgia-urologica',
  },
}

const vias = [
  {
    nome: 'Endoscópica',
    acesso: 'Sem incisão',
    cor: 'bg-brand-green/10 border-t-4 border-brand-green',
    corTxt: 'text-brand-green',
    desc: 'O acesso é pelas vias naturais, entrando pela uretra. É a via de procedimentos como o tratamento a laser da próstata e boa parte do tratamento de cálculo urinário. Não deixa cicatriz externa.',
  },
  {
    nome: 'Robótica',
    acesso: 'Pequenas incisões',
    cor: 'bg-brand-gold/10 border-t-4 border-brand-gold',
    corTxt: 'text-brand-gold',
    desc: 'O cirurgião opera de um console, com visão tridimensional ampliada e instrumentos que articulam como um punho. O sistema filtra o tremor natural das mãos, o que importa em espaços estreitos como a pelve.',
  },
  {
    nome: 'Laparoscópica',
    acesso: 'Pequenas incisões',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'Também minimamente invasiva, com câmera e pinças através de pequenos orifícios. Os instrumentos são rígidos e a visão é bidimensional, o que a diferencia da robótica.',
  },
  {
    nome: 'Aberta',
    acesso: 'Incisão maior',
    cor: 'bg-brand-beige border-t-4 border-brand-muted',
    corTxt: 'text-brand-navy',
    desc: 'Continua sendo a melhor escolha em situações específicas, como cirurgias de grande porte, casos com muita aderência por cirurgias anteriores e algumas urgências. Não é técnica ultrapassada: é indicação diferente.',
  },
]

const comoEscolhe = [
  {
    fator: 'O que precisa ser feito',
    detalhe:
      'A doença e o órgão envolvido restringem as opções. Alguns procedimentos só existem por uma via; outros admitem mais de uma, e aí entram os demais fatores.',
  },
  {
    fator: 'Estágio e extensão da doença',
    detalhe:
      'Em doença oncológica, a prioridade é o resultado oncológico. Uma via minimamente invasiva só é escolhida quando não compromete esse objetivo.',
  },
  {
    fator: 'Cirurgias abdominais anteriores',
    detalhe:
      'Aderências de cirurgias prévias dificultam o acesso minimamente invasivo e, em alguns casos, tornam a via aberta mais segura.',
  },
  {
    fator: 'Condições clínicas do paciente',
    detalhe:
      'Função cardíaca e respiratória influenciam a tolerância ao tempo cirúrgico e à posição exigida por algumas técnicas. É avaliação que antecede a decisão.',
  },
  {
    fator: 'Anatomia individual',
    detalhe:
      'Tamanho do órgão, obesidade e particularidades anatômicas pesam na escolha e às vezes mudam o plano durante a própria cirurgia.',
  },
  {
    fator: 'Disponibilidade e experiência',
    detalhe:
      'A melhor técnica é a que o cirurgião domina e que a estrutura permite executar com segurança. Tecnologia sem experiência não melhora resultado.',
  },
]

const beneficios = [
  'Incisões menores, o que costuma significar menos dor no pós-operatório',
  'Menor sangramento intraoperatório na maioria dos procedimentos',
  'Internação mais curta, em geral',
  'Retorno mais rápido às atividades leves',
  'Menor risco de complicações de ferida operatória',
  'Cicatrizes menores, que é benefício estético, não clínico',
]

const faq = [
  {
    q: 'Cirurgia robótica é sempre melhor?',
    a: 'Não. É uma opção entre outras, e a indicação depende do procedimento, do estágio da doença, de cirurgias anteriores e das condições clínicas. Em parte dos casos a via aberta ou a endoscópica continua sendo a melhor decisão, e escolher tecnologia por si só não melhora resultado.',
  },
  {
    q: 'Qual a diferença entre robótica e laparoscopia?',
    a: 'As duas são minimamente invasivas e usam pequenas incisões. Na laparoscopia as pinças são rígidas, com movimento limitado e visão bidimensional. Na robótica os instrumentos articulam em todos os eixos, a visão é tridimensional e ampliada, e o sistema filtra o tremor das mãos.',
  },
  {
    q: 'Cirurgia sem corte existe mesmo?',
    a: 'Sim, e é o que chamamos de via endoscópica: o acesso é feito pelas vias naturais, entrando pela uretra, sem nenhuma incisão externa. É a via usada no tratamento a laser da próstata e em boa parte do tratamento de cálculo urinário.',
  },
  {
    q: 'O convênio cobre cirurgia robótica?',
    a: 'A cobertura varia bastante entre operadoras e planos, e costuma depender da indicação clínica e do procedimento específico. Confirme diretamente com o convênio antes do agendamento. A equipe do consultório orienta sobre a documentação necessária.',
  },
  {
    q: 'Onde as cirurgias são realizadas?',
    a: 'Em hospital com a estrutura exigida pelo procedimento, e não no consultório. A definição do hospital considera o tipo de cirurgia, o equipamento necessário e o seu convênio, e é discutida na consulta que antecede o procedimento.',
  },
  {
    q: 'A via pode mudar durante a cirurgia?',
    a: 'Pode, e isso é previsto. Se durante o procedimento a equipe identificar condição que torne a via inicial menos segura, a conversão é feita em favor da segurança. Não é falha: é conduta correta, e esse cenário é explicado antes na assinatura do consentimento.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Tratamentos', item: 'https://drericodiogenes.com.br/tratamentos' },
    { '@type': 'ListItem', position: 3, name: 'Cirurgia Urológica', item: 'https://drericodiogenes.com.br/tratamentos/cirurgia-urologica' },
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

export default function CirurgiaUrologica() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cirurgia Urológica em Fortaleza: Vias e Técnicas"
        description="Diferença entre cirurgia aberta, laparoscópica, robótica e endoscópica e como a via é escolhida. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/tratamentos/cirurgia-urologica"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Tratamentos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                A melhor via não é a mais moderna.{' '}
                <span className="text-brand-gold">É a certa para o seu caso.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Robótica, laparoscópica, endoscópica ou aberta: cada via tem indicação própria, e a escolha considera a doença, o estágio, cirurgias anteriores e suas condições clínicas. Entender o que diferencia uma da outra ajuda a participar da decisão em vez de só recebê-la.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/cirurgia-robotica" className="btn-silver">
                  Cirurgia Robótica
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-7.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — AS VIAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Quatro caminhos diferentes</p>
            <h2 className="section-title mt-2">AS VIAS DE ACESSO</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {vias.map((v, i) => (
              <div key={v.nome} className={`rounded-2xl p-6 shadow-card ${v.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className={`font-display text-lg ${v.corTxt}`}>{v.nome}</h3>
                  <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm whitespace-nowrap">{v.acesso}</span>
                </div>
                <p className="text-sm text-brand-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — COMO SE ESCOLHE */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Seis fatores, não um</p>
            <h2 className="section-title mt-2">COMO A VIA É ESCOLHIDA</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {comoEscolhe.map((c, i) => (
              <div key={c.fator} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{c.fator}</h3>
                <p className="text-sm text-brand-muted mt-2">{c.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — BENEFÍCIOS */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Quando a via minimamente invasiva é indicada</p>
            <h2 className="section-title mt-2">O QUE SE ESPERA DELA</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {beneficios.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            Esses benefícios são tendências observadas, não garantias individuais. O tempo real de recuperação depende do procedimento, do estágio da doença e das suas condições clínicas.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Cirurgia em Fortaleza</p>
            <h2 className="section-title mt-2">TECNOLOGIA SEM EXPERIÊNCIA NÃO MELHORA RESULTADO</h2>
            <p className="text-brand-muted mt-4">
              O equipamento é uma parte da equação. A outra é quem opera, quantas vezes já fez aquele procedimento e o quanto conhece as alternativas para mudar de plano quando necessário.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é doutor em Urologia pela USP, com fellowship em uro-oncologia pelo Hospital Sírio-Libanês, formação em cirurgia robótica pelo Hospital Albert Einstein e especialização internacional na França. Atende no Pátio Dom Luís, na Aldeota.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/exames-orientacoes/orientacoes/pre-operatorio" className="btn-silver">
                Preparo para Cirurgia
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-3.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE CIRURGIA UROLÓGICA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Recebeu indicação de cirurgia? Vale entender as opções antes." />
    </>
  )
}
