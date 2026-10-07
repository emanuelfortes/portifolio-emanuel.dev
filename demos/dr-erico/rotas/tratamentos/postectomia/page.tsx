import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Postectomia Fortaleza | Cirurgia de Fimose — Dr. Érico Diógenes' },
  description:
    'Postectomia em Fortaleza: quando a cirurgia de fimose é indicada, como é feita, recuperação e principais dúvidas. Dr. Érico Diógenes, urologista, explica.',
  alternates: { canonical: '/tratamentos/postectomia' },
  openGraph: {
    title: 'Postectomia Fortaleza | Dr. Érico Diógenes',
    description:
      'Fimose, parafimose e balanopostite de repetição: quando a postectomia é indicada e como é a recuperação.',
    url: '/tratamentos/postectomia',
  },
}

const indicacoes = [
  {
    motivo: 'Fimose que não responde ao tratamento clínico',
    detalhe:
      'Quando o prepúcio não retrai e as medidas conservadoras, como pomadas e exercícios de retração orientados, não resolveram. Em adultos, a chance de resposta clínica é menor do que na infância.',
  },
  {
    motivo: 'Parafimose',
    detalhe:
      'O prepúcio retraído fica preso atrás da glande e causa inchaço progressivo. É uma urgência urológica, e após a resolução do episódio agudo a cirurgia costuma ser indicada para evitar recorrência.',
  },
  {
    motivo: 'Balanopostite de repetição',
    detalhe:
      'Inflamações e infecções repetidas da glande e do prepúcio, muitas vezes associadas a dificuldade de higiene pela abertura estreita. A cirurgia interrompe esse ciclo.',
  },
  {
    motivo: 'Dor ou dificuldade na relação sexual',
    detalhe:
      'Quando o anel estreito causa dor, fissuras ou sangramento durante a relação. Também é indicação quando o freio curto limita o movimento, situação em que a técnica pode ser adaptada.',
  },
  {
    motivo: 'Líquen escleroso',
    detalhe:
      'Doença inflamatória crônica que endurece e retrai o prepúcio. Aqui a cirurgia tem indicação mais firme, porque a condição tende a progredir e pode afetar a uretra.',
  },
  {
    motivo: 'Higiene comprometida',
    detalhe:
      'Quando a limpeza adequada não é possível de forma consistente, o que favorece inflamação e, a longo prazo, aumenta riscos locais.',
  },
]

const etapas = [
  {
    num: '1',
    nome: 'Avaliação e indicação',
    desc: 'Em consulta define-se o grau da fimose, se há indicação cirúrgica e qual técnica se aplica. Nem toda fimose em adulto precisa de cirurgia, e essa conversa vem antes de qualquer agendamento.',
  },
  {
    num: '2',
    nome: 'Anestesia',
    desc: 'Na maior parte dos casos o procedimento é feito com anestesia local associada a sedação, em regime ambulatorial. A escolha é discutida com a equipe de anestesia conforme o caso.',
  },
  {
    num: '3',
    nome: 'O procedimento',
    desc: 'O prepúcio em excesso é removido e a sutura é feita com fio absorvível, que não precisa ser retirado. A duração costuma ser de trinta a quarenta e cinco minutos.',
  },
  {
    num: '4',
    nome: 'Alta e recuperação inicial',
    desc: 'Alta geralmente no mesmo dia, com acompanhante. Os primeiros dias pedem repouso relativo, higiene orientada e analgesia regular.',
  },
]

const recuperacao = [
  'Inchaço e coloração arroxeada nos primeiros dias são esperados e regridem progressivamente',
  'Higiene com água e sabão conforme orientação, secando sem atrito',
  'Analgesia nos horários prescritos, sem esperar a dor ficar forte',
  'Roupa íntima que mantenha a região apoiada tende a reduzir o desconforto',
  'Retorno ao trabalho sem esforço costuma ser rápido; esforço físico tem prazo próprio',
  'Atividade sexual liberada apenas após a cicatrização completa, com prazo informado no retorno',
]

const faq = [
  {
    q: 'Toda fimose em adulto precisa de cirurgia?',
    a: 'Não. Existem casos em que o tratamento clínico com pomadas e retração orientada resolve, principalmente em fimoses leves. A cirurgia entra quando há falha desse tratamento, complicações como parafimose e infecções de repetição, ou condições como o líquen escleroso.',
  },
  {
    q: 'A postectomia afeta a sensibilidade ou o desempenho sexual?',
    a: 'É a dúvida mais frequente. A literatura não sustenta prejuízo relevante de função sexual após o procedimento, e muitos pacientes relatam melhora justamente porque a dor e as fissuras durante a relação deixam de acontecer. Ainda assim, é um ponto que merece conversa individual antes da decisão.',
  },
  {
    q: 'Quanto tempo leva a recuperação?',
    a: 'O inchaço inicial regride ao longo das primeiras semanas. O retorno a atividades leves costuma ser rápido, enquanto esforço físico e atividade sexual têm prazos maiores, definidos no retorno conforme a cicatrização. Não antecipe por se sentir bem.',
  },
  {
    q: 'Preciso tirar os pontos?',
    a: 'Na maioria dos casos usa-se fio absorvível, que se solta sozinho ao longo de algumas semanas. Não é necessário retorno específico para retirada, mas a consulta de revisão continua sendo importante para conferir a cicatrização.',
  },
  {
    q: 'É feito com anestesia geral?',
    a: 'Geralmente não. Na maior parte dos casos usa-se anestesia local associada a sedação, em regime ambulatorial, com alta no mesmo dia. A definição é feita junto com a equipe de anestesia e considera suas condições clínicas.',
  },
  {
    q: 'Existe idade limite para fazer?',
    a: 'Não. A postectomia é realizada em adultos de qualquer idade quando há indicação. O que muda com a idade é a avaliação clínica prévia, especialmente em quem tem diabetes ou outras condições que influenciam a cicatrização.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Tratamentos', item: 'https://drericodiogenes.com.br/tratamentos' },
    { '@type': 'ListItem', position: 3, name: 'Postectomia', item: 'https://drericodiogenes.com.br/tratamentos/postectomia' },
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

export default function Postectomia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Postectomia em Fortaleza: Cirurgia de Fimose"
        description="Indicações da postectomia, como é feita e como é a recuperação. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/tratamentos/postectomia"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Tratamentos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Postectomia.{' '}
                <span className="text-brand-gold">A cirurgia que muitos adiam por constrangimento.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Fimose em adulto não é assunto de criança, e conviver com dor na relação, infecções repetidas ou dificuldade de higiene não precisa ser a regra. É um procedimento ambulatorial, em geral com anestesia local e sedação, e alta no mesmo dia.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/tratamentos" className="btn-silver">
                  Ver Todos os Tratamentos
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-2.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — INDICAÇÕES */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Nem toda fimose precisa de cirurgia</p>
            <h2 className="section-title mt-2">QUANDO É INDICADA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A decisão considera o grau da fimose, as complicações já ocorridas e a resposta ao tratamento clínico anterior.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {indicacoes.map((ind, i) => (
              <div key={ind.motivo} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{ind.motivo}</h3>
                <p className="text-sm text-brand-muted mt-2">{ind.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — COMO É FEITA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Procedimento ambulatorial</p>
            <h2 className="section-title mt-2">COMO É FEITA</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {etapas.map((e, i) => (
              <div key={e.nome} className="flex gap-5 bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <span className="font-display text-3xl text-brand-gold shrink-0 leading-none">{e.num}</span>
                <div>
                  <h3 className="font-display text-base text-brand-navy">{e.nome}</h3>
                  <p className="text-sm text-brand-muted mt-1">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — RECUPERAÇÃO */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">O que esperar</p>
            <h2 className="section-title mt-2">A RECUPERAÇÃO</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {recuperacao.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            Febre, sangramento que aumenta ou dor que piora em vez de melhorar não fazem parte da recuperação. Nesses casos, entre em contato.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">A CONVERSA VEM ANTES DA CIRURGIA</h2>
            <p className="text-brand-muted mt-4">
              Boa parte dos homens chega ao consultório já decidido a operar, e uma parte deles não precisa. Outros adiaram por anos um procedimento simples que resolveria dor e infecções repetidas. A consulta serve para separar um caso do outro.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/saude-masculina" className="btn-silver">
                Saúde Masculina
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-4.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE POSTECTOMIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Fimose em adulto tem solução. Comece pela avaliação." />
    </>
  )
}
