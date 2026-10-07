import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Exame de PSA Fortaleza | Como Fazer e Preparo — Dr. Érico Diógenes' },
  description:
    'Exame de PSA em Fortaleza: como é feita a coleta, o preparo que altera o resultado e as variações do exame. Dr. Érico Diógenes, urologista, orienta.',
  alternates: { canonical: '/exames-orientacoes/exames/psa' },
  openGraph: {
    title: 'Exame de PSA Fortaleza | Dr. Érico Diógenes',
    description:
      'O preparo do PSA muda o resultado. Saiba o que fazer nos dias anteriores para não repetir o exame à toa.',
    url: '/exames-orientacoes/exames/psa',
  },
}

const preparo = [
  {
    item: 'Evite ejaculação por 48 horas antes',
    porque:
      'A atividade sexual recente pode elevar o PSA de forma transitória. É a causa mais comum e mais evitável de resultado falsamente alterado.',
  },
  {
    item: 'Evite ciclismo e exercícios intensos por 48 horas',
    porque:
      'A pressão do selim sobre a região perineal pode aumentar o valor. Vale também para motocicleta e atividades com impacto sobre a região.',
  },
  {
    item: 'Colete o sangue antes do toque retal',
    porque:
      'O exame físico da próstata pode interferir na dosagem. Quando ambos são feitos no mesmo dia, a coleta vem primeiro.',
  },
  {
    item: 'Aguarde após procedimentos urológicos',
    porque:
      'Sondagem, cistoscopia e biópsia elevam o PSA por semanas. O intervalo adequado é orientado pelo médico conforme o procedimento realizado.',
  },
  {
    item: 'Trate a infecção urinária antes',
    porque:
      'Prostatite e infecção urinária aumentam bastante o PSA. Dosar durante um quadro infeccioso gera um número que não representa a condição da próstata.',
  },
  {
    item: 'Informe todos os medicamentos em uso',
    porque:
      'Alguns medicamentos usados para próstata e para queda de cabelo reduzem o PSA pela metade, e o valor precisa ser interpretado considerando isso.',
  },
]

const variacoes = [
  {
    nome: 'PSA total',
    detalhe:
      'É a dosagem padrão, a que aparece em praticamente todo pedido. Mede a soma do PSA circulante no sangue. Sozinho, é um ponto de partida, não uma conclusão.',
  },
  {
    nome: 'PSA livre e relação livre/total',
    detalhe:
      'Separa a fração do PSA que circula sem ligação a proteínas. A relação entre as duas formas agrega informação em valores de PSA em faixa intermediária e ajuda a decidir sobre investigação adicional.',
  },
  {
    nome: 'Densidade do PSA',
    detalhe:
      'Relaciona o PSA ao volume da próstata medido no ultrassom. Uma próstata grande produz naturalmente mais PSA, e essa conta ajuda a distinguir aumento por volume de aumento por outra causa.',
  },
  {
    nome: 'Velocidade do PSA',
    detalhe:
      'Compara valores ao longo do tempo. É por isso que exames antigos importam tanto: a trajetória de um PSA diz mais do que um número isolado em uma única coleta.',
  },
]

const quemDeve = [
  'Homens a partir dos 50 anos, como parte da avaliação da próstata',
  'A partir dos 45 anos com pai ou irmão que tiveram câncer de próstata',
  'A partir dos 45 anos para homens negros, por maior risco na população',
  'Quem tem sintomas urinários que motivaram avaliação da próstata',
  'Acompanhamento de quem já tem diagnóstico prostático em seguimento',
  'Controle após tratamento de câncer de próstata, em intervalos definidos',
]

const faq = [
  {
    q: 'Preciso de jejum para o exame de PSA?',
    a: 'O PSA em si não exige jejum. Como ele costuma ser coletado junto de outros exames de sangue que pedem jejum, muita gente acredita que seja necessário. Siga a orientação do laboratório considerando o conjunto de exames solicitados.',
  },
  {
    q: 'Por que evitar relação sexual antes?',
    a: 'Porque a ejaculação pode elevar o PSA de forma transitória e gerar um valor que não reflete a condição real da próstata. O resultado alterado leva a nova coleta, ansiedade e às vezes investigação desnecessária. Quarenta e oito horas de intervalo resolvem.',
  },
  {
    q: 'Com que frequência devo repetir?',
    a: 'Não existe intervalo único. Depende do valor encontrado, da idade, do volume da próstata e do histórico familiar. Para alguns homens o controle é anual; para outros, mais espaçado. Esse intervalo é definido na consulta, porque rastrear demais também tem custo.',
  },
  {
    q: 'PSA alto significa câncer?',
    a: 'Não. O PSA sobe por aumento benigno da próstata, prostatite, infecção urinária, atividade sexual recente, ciclismo e procedimentos urológicos. Um valor alterado indica investigar, não diagnostica nada. O significado clínico do resultado está detalhado na página sobre PSA alterado.',
  },
  {
    q: 'Posso fazer PSA sem pedido médico?',
    a: 'Muitos laboratórios aceitam, mas fazer sem acompanhamento é meio caminho: o número isolado gera mais angústia do que informação. O PSA só orienta conduta quando interpretado com idade, exame físico, volume prostático e valores anteriores.',
  },
  {
    q: 'PSA substitui o toque retal?',
    a: 'Não, os dois são complementares. Existem tumores que alteram o exame físico com PSA em faixa normal, e valores elevados que não correspondem a tumor. A avaliação usa os dois, e a indicação de cada um é individual.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Exame de PSA', item: 'https://drericodiogenes.com.br/exames-orientacoes/exames/psa' },
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

export default function ExamePsa() {
  return (
    <>
      <MedicalWebPageSchema
        name="Exame de PSA em Fortaleza: Como Fazer e Preparo"
        description="Como é feita a coleta do PSA, o preparo que altera o resultado e as variações do exame. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/exames/psa"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Exames Urológicos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                É uma coleta de sangue simples.{' '}
                <span className="text-brand-gold">Mas o que você faz antes muda o resultado.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Ciclismo, relação sexual recente, infecção urinária e até a ordem dos exames no mesmo dia podem alterar o PSA. Muito resultado &ldquo;alterado&rdquo; que gera susto e repetição vem de preparo inadequado, não da próstata.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Consulta
                </a>
                <Link href="/condicoes-urologicas/prostata/psa-alterado" className="btn-silver">
                  O que significa PSA alterado
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-3.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — PREPARO */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O que fazer nos dias anteriores</p>
            <h2 className="section-title mt-2">O PREPARO QUE MUDA O RESULTADO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Nenhum desses itens é firula. Cada um deles pode elevar o PSA o suficiente para transformar um exame normal em um resultado que pede repetição.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {preparo.map((p, i) => (
              <div key={p.item} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{p.item}</h3>
                <p className="text-sm text-brand-muted mt-2">{p.porque}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — VARIAÇÕES */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Não existe um PSA só</p>
            <h2 className="section-title mt-2">AS VARIAÇÕES DO EXAME</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O pedido costuma trazer &ldquo;PSA total&rdquo;, mas existem formas complementares de olhar o mesmo marcador, e elas mudam a interpretação.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {variacoes.map((v, i) => (
              <div key={v.nome} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{v.nome}</h3>
                <p className="text-sm text-brand-muted mt-2">{v.detalhe}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-brand-muted mt-8 max-w-2xl mx-auto" data-aos="fade-up">
            Guarde seus exames antigos. A trajetória do PSA ao longo dos anos informa mais do que qualquer coleta isolada.
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 — QUEM DEVE FAZER */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Indicações</p>
            <h2 className="section-title mt-2">QUEM DEVE FAZER O EXAME</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {quemDeve.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            A decisão de iniciar o rastreamento, e em que intervalo repetir, é individual e discutida em consulta.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">O NÚMERO SOZINHO NÃO DECIDE NADA</h2>
            <p className="text-brand-muted mt-4">
              O PSA é um dos exames mais úteis da urologia e também um dos mais mal interpretados. Ele ganha significado junto de idade, volume da próstata, exame físico e, sobretudo, dos seus valores anteriores.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes é doutor em Urologia pela USP, com pesquisa em tumores de próstata, e fellowship em uro-oncologia pelo Hospital Sírio-Libanês. Atende no Pátio Dom Luís, na Aldeota.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/prostata/exame-prostata" className="btn-silver">
                Exame de Próstata
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-5b.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE O EXAME DE PSA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Vai fazer PSA? O preparo começa 48 horas antes." />
    </>
  )
}
