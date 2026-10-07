import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Orientações Pré-Operatórias | Cirurgia Urológica — Dr. Érico Diógenes' },
  description:
    'Preparo para cirurgia urológica em Fortaleza: exames, medicamentos que precisam de ajuste, jejum e o que levar no dia. Orientações do Dr. Érico Diógenes.',
  alternates: { canonical: '/exames-orientacoes/orientacoes/pre-operatorio' },
  openGraph: {
    title: 'Orientações Pré-Operatórias | Dr. Érico Diógenes',
    description:
      'O que organizar nas semanas anteriores à cirurgia urológica, do risco cardiológico ao jejum.',
    url: '/exames-orientacoes/orientacoes/pre-operatorio',
  },
}

const etapas = [
  {
    num: '1',
    nome: 'Semanas antes: avaliação e exames',
    desc: 'Exames de sangue, avaliação cardiológica quando indicada e os exames de imagem específicos do procedimento. Fumantes se beneficiam de interromper o cigarro o quanto antes, porque isso reduz complicações respiratórias e melhora a cicatrização.',
  },
  {
    num: '2',
    nome: 'Duas semanas antes: revisão dos medicamentos',
    desc: 'Anticoagulantes, antiagregantes e alguns suplementos podem precisar de ajuste. Essa decisão é sempre do médico, em conjunto com quem prescreveu. Nunca suspenda nada por conta própria.',
  },
  {
    num: '3',
    nome: 'Dias antes: organização prática',
    desc: 'Confirme autorização do convênio, providencie os itens da internação e organize quem vai acompanhar e levar você para casa. Deixe a rotina de trabalho e de casa resolvida para os primeiros dias.',
  },
  {
    num: '4',
    nome: 'Véspera: jejum e higiene',
    desc: 'Siga rigorosamente o tempo de jejum orientado pela equipe de anestesia, para sólidos e líquidos. Banho com atenção à região a ser operada, e sono adequado na medida do possível.',
  },
  {
    num: '5',
    nome: 'No dia: chegada',
    desc: 'Chegue no horário combinado, com documentos, exames e a lista de medicamentos. Sem joias, esmalte ou lentes de contato. Roupa confortável e fácil de vestir depois.',
  },
]

const medicamentos = [
  'Anticoagulantes e antiagregantes, que podem exigir suspensão programada',
  'Anti-inflamatórios, que interferem na coagulação',
  'Medicamentos para diabetes, cujo ajuste depende do jejum',
  'Anti-hipertensivos, que em geral são mantidos, mas com orientação específica no dia',
  'Suplementos e fitoterápicos, incluindo vitamina E, ginkgo e óleo de peixe',
  'Qualquer medicação de uso contínuo, mesmo a que parece irrelevante',
]

const levar = [
  'Documento com foto, CPF e cartão do convênio',
  'Guia de autorização do procedimento, quando aplicável',
  'Todos os exames pré-operatórios, em papel e em mídia digital',
  'Lista escrita dos medicamentos em uso, com doses',
  'Itens de higiene pessoal e roupa confortável',
  'Acompanhante maior de idade, que possa levar você para casa',
]

const faq = [
  {
    q: 'Posso tomar meus remédios no dia da cirurgia?',
    a: 'Depende do medicamento. Alguns são mantidos e tomados com um gole de água pela manhã; outros precisam ser suspensos dias antes. Essa orientação é individual e dada na consulta pré-operatória. Não decida sozinho, nem suspenda por precaução.',
  },
  {
    q: 'Quanto tempo de jejum é necessário?',
    a: 'O tempo é definido pela equipe de anestesia e costuma ser diferente para sólidos e para líquidos claros. Siga exatamente o que foi orientado: jejum insuficiente pode levar ao adiamento da cirurgia no próprio dia, e jejum excessivo também não é desejável.',
  },
  {
    q: 'Preciso mesmo parar de fumar?',
    a: 'É fortemente recomendado, e quanto antes melhor. Parar reduz complicações respiratórias, melhora a oxigenação dos tecidos e favorece a cicatrização. Mesmo poucas semanas de interrupção já trazem benefício mensurável no pós-operatório.',
  },
  {
    q: 'Posso ir sozinho?',
    a: 'Não é recomendado. Procedimentos com anestesia, mesmo os ambulatoriais, exigem acompanhante maior de idade que possa receber as orientações de alta e levar você para casa. Dirigir após anestesia não é permitido.',
  },
  {
    q: 'E se eu ficar gripado ou com febre?',
    a: 'Avise a equipe antes de ir. Infecção ativa pode ser motivo para adiar o procedimento, e essa decisão é clínica. Comunicar a tempo evita deslocamento desnecessário e permite reorganizar a agenda.',
  },
  {
    q: 'Quanto tempo vou ficar internado?',
    a: 'Varia muito conforme o procedimento: há cirurgias ambulatoriais, com alta no mesmo dia, e outras que exigem uma ou mais diárias. Essa informação é dada especificamente para o seu caso na consulta que antecede a cirurgia.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Pré-Operatório', item: 'https://drericodiogenes.com.br/exames-orientacoes/orientacoes/pre-operatorio' },
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

export default function PreOperatorio() {
  return (
    <>
      <MedicalWebPageSchema
        name="Orientações Pré-Operatórias para Cirurgia Urológica"
        description="Preparo para cirurgia urológica: exames, ajuste de medicamentos, jejum e o que levar. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/orientacoes/pre-operatorio"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Orientações ao Paciente · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                O resultado da cirurgia{' '}
                <span className="text-brand-gold">começa a ser construído semanas antes dela.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Ajuste correto dos medicamentos, exames em dia, jejum respeitado e um acompanhante organizado. São detalhes que não aparecem no centro cirúrgico, mas que reduzem complicação, evitam adiamento de última hora e encurtam a recuperação.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Falar com a Equipe
                </a>
                <Link href="/exames-orientacoes/orientacoes/pos-operatorio" className="btn-silver">
                  Orientações Pós-Operatórias
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

      {/* SEÇÃO 2 — LINHA DO TEMPO */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Do agendamento ao centro cirúrgico</p>
            <h2 className="section-title mt-2">O QUE FAZER, E QUANDO</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {etapas.map((e, i) => (
              <div key={e.nome} className="flex gap-5 bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
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

      {/* SEÇÃO 3 — MEDICAMENTOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">O item mais importante da lista</p>
            <h2 className="section-title mt-2">MEDICAMENTOS QUE PEDEM ATENÇÃO</h2>
            <p className="text-brand-muted mt-4">
              Informe tudo o que usa, inclusive o que parece irrelevante. Suplementos e fitoterápicos interferem em coagulação e anestesia com mais frequência do que se imagina.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card" data-aos="fade-up">
            <ul className="space-y-3">
              {medicamentos.map((m) => (
                <li key={m} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mt-6" data-aos="fade-up">
            <p className="text-sm text-brand-muted">
              <span className="font-semibold text-red-500">Nunca suspenda medicação por conta própria.</span>{' '}
              Interromper anticoagulante sem orientação pode ter consequência grave. A decisão é sempre médica e feita em conjunto com quem prescreveu.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — O QUE LEVAR */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">No dia</p>
            <h2 className="section-title mt-2">O QUE LEVAR</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {levar.map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-navy" />
                  <span className="text-sm text-brand-muted">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Cirurgia em Fortaleza</p>
            <h2 className="section-title mt-2">ESTAS SÃO ORIENTAÇÕES GERAIS</h2>
            <p className="text-brand-muted mt-4">
              Cada procedimento tem particularidades, e o preparo de uma cirurgia robótica não é o mesmo de um procedimento endoscópico. As orientações específicas do seu caso são entregues na consulta que antecede a cirurgia, e é nela que as dúvidas devem ser esclarecidas.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes atua em cirurgia robótica, cirurgia a laser da próstata, uro-oncologia e cálculo renal, com atendimento no Pátio Dom Luís, na Aldeota.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Tirar Dúvidas
              </a>
              <Link href="/cirurgia-robotica" className="btn-silver">
                Cirurgia Robótica
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-1.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE O PRÉ-OPERATÓRIO</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Dúvida sobre o preparo da sua cirurgia? Fale com a equipe." />
    </>
  )
}
