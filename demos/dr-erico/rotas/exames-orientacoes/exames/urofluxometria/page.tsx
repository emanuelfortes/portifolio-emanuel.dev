import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Urofluxometria Fortaleza | Como é o Exame — Dr. Érico Diógenes' },
  description:
    'Urofluxometria em Fortaleza: o que o exame mede, como é feito, qual o preparo e o que o resultado indica sobre o jato urinário. Dr. Érico Diógenes explica.',
  alternates: { canonical: '/exames-orientacoes/exames/urofluxometria' },
  openGraph: {
    title: 'Urofluxometria Fortaleza | Dr. Érico Diógenes',
    description:
      'O exame que transforma a queixa de jato fraco em número. Entenda como é feito e o que ele mede.',
    url: '/exames-orientacoes/exames/urofluxometria',
  },
}

const etapas = [
  {
    num: '1',
    nome: 'Chegada com a bexiga cheia',
    desc: 'Você bebe água antes e aguarda até sentir vontade de urinar semelhante à do dia a dia. Volume muito baixo invalida o exame, e volume excessivo também distorce o resultado.',
  },
  {
    num: '2',
    nome: 'Micção no equipamento',
    desc: 'Você urina normalmente, sozinho, em um vaso sanitário acoplado a um sensor. Não há sonda, não há contraste e nada é introduzido. É privado e leva o tempo de uma micção comum.',
  },
  {
    num: '3',
    nome: 'Registro automático',
    desc: 'O aparelho mede o volume eliminado, a velocidade do jato ao longo do tempo e a duração da micção, e desenha uma curva com esses dados.',
  },
  {
    num: '4',
    nome: 'Medida do resíduo',
    desc: 'Logo após, costuma-se fazer uma ultrassonografia rápida para verificar quanta urina ficou na bexiga. Essa informação é tão importante quanto o jato em si.',
  },
]

const oQueMede = [
  {
    termo: 'Fluxo máximo',
    detalhe:
      'A maior velocidade atingida pelo jato, medida em mililitros por segundo. É o número mais citado no laudo e o que melhor se correlaciona com obstrução, embora sozinho não feche diagnóstico.',
  },
  {
    termo: 'Fluxo médio',
    detalhe:
      'A velocidade média ao longo de toda a micção. Complementa o fluxo máximo e ajuda a identificar jatos que começam bem mas não se sustentam.',
  },
  {
    termo: 'Volume urinado',
    detalhe:
      'Quanto foi eliminado. Interpretar fluxo sem conhecer o volume leva a erro: jatos aparentemente baixos podem ser normais quando o volume é pequeno.',
  },
  {
    termo: 'Formato da curva',
    detalhe:
      'O desenho do gráfico importa tanto quanto os números. Curvas achatadas e prolongadas sugerem obstrução; curvas interrompidas sugerem esforço abdominal para urinar.',
  },
  {
    termo: 'Resíduo pós-miccional',
    detalhe:
      'A urina que permanece na bexiga após urinar. Resíduo elevado ajuda a explicar sintomas e aumenta o risco de infecção e de complicações.',
  },
]

const quandoIndicado = [
  'Jato urinário fraco, interrompido ou que demora a começar',
  'Sensação de que a bexiga não esvaziou por completo',
  'Investigação de aumento benigno da próstata',
  'Acompanhamento antes e depois de cirurgia de próstata',
  'Urgência e frequência urinária sem causa esclarecida',
  'Avaliação de estreitamento da uretra',
  'Controle de tratamento medicamentoso em andamento',
]

const faq = [
  {
    q: 'A urofluxometria dói?',
    a: 'Não. Você apenas urina em um vaso sanitário com sensor. Não há sonda, agulha, contraste ou qualquer coisa introduzida na uretra. É um dos exames mais simples da urologia e a principal queixa dos pacientes é ter que segurar a urina antes.',
  },
  {
    q: 'Qual o preparo para o exame?',
    a: 'Chegar com a bexiga confortavelmente cheia. Em geral orienta-se beber água e não urinar por algumas horas antes, mas o ideal é seguir a orientação dada no agendamento, porque ela considera o seu caso. Não é preciso jejum nem suspender medicação por conta própria.',
  },
  {
    q: 'Quanto tempo demora?',
    a: 'A micção em si leva menos de um minuto. Contando a espera com a bexiga enchendo e a ultrassonografia de resíduo logo depois, reserve algo em torno de trinta minutos a uma hora.',
  },
  {
    q: 'O resultado sai na hora?',
    a: 'A curva e os valores ficam disponíveis imediatamente. A interpretação, porém, depende do contexto clínico: os mesmos números significam coisas diferentes conforme idade, sintomas e volume urinado. Por isso o laudo é discutido em consulta.',
  },
  {
    q: 'Um exame ruim significa que vou precisar de cirurgia?',
    a: 'Não. A urofluxometria é um dado entre vários. Fluxo reduzido pode decorrer de obstrução, de bexiga com contração fraca ou até de um exame feito com volume inadequado. A conduta considera sintomas, exame físico, outros exames e o quanto o quadro incomoda.',
  },
  {
    q: 'Posso repetir o exame?',
    a: 'Sim, e com frequência é recomendável. Uma micção isolada pode não representar o padrão habitual, principalmente se você estiver ansioso ou com volume atípico. Repetir dá mais confiança ao resultado, e o exame também é usado para acompanhar resposta ao tratamento.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Exames e Orientações', item: 'https://drericodiogenes.com.br/exames-orientacoes' },
    { '@type': 'ListItem', position: 3, name: 'Urofluxometria', item: 'https://drericodiogenes.com.br/exames-orientacoes/exames/urofluxometria' },
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

export default function Urofluxometria() {
  return (
    <>
      <MedicalWebPageSchema
        name="Urofluxometria em Fortaleza: Como é o Exame"
        description="O que a urofluxometria mede, como é feita, qual o preparo e o que o resultado indica. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/exames-orientacoes/exames/urofluxometria"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Exames Urológicos · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                &ldquo;Meu jato está fraco.&rdquo;{' '}
                <span className="text-brand-gold">A urofluxometria transforma isso em número.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Jato fraco é uma percepção, e percepção varia muito de pessoa para pessoa. O exame mede a velocidade real da micção, desenha a curva do jato e mostra quanta urina ficou na bexiga. É simples, indolor e não envolve sonda nenhuma.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Exame
                </a>
                <Link href="/exames-orientacoes" className="btn-silver">
                  Ver Todos os Exames
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-4.webp"
              alt="Dr. Érico Diógenes, urologista em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — COMO É FEITO */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Sem sonda, sem contraste</p>
            <h2 className="section-title mt-2">COMO O EXAME É FEITO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A maior parte da apreensão com esse exame vem de imaginar algo invasivo. Não é o caso: você apenas urina normalmente.
            </p>
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

      {/* SEÇÃO 3 — O QUE MEDE */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Entendendo o laudo</p>
            <h2 className="section-title mt-2">O QUE O EXAME MEDE</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {oQueMede.map((m, i) => (
              <div key={m.termo} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-base text-brand-navy">{m.termo}</h3>
                <p className="text-sm text-brand-muted mt-2">{m.detalhe}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-brand-muted mt-8 max-w-2xl mx-auto" data-aos="fade-up">
            Nenhum desses valores fecha diagnóstico isoladamente. O exame ganha sentido quando lido junto dos sintomas e dos demais achados.
          </p>
        </div>
      </section>

      {/* SEÇÃO 4 — QUANDO É INDICADO */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Principais indicações</p>
            <h2 className="section-title mt-2">QUANDO O EXAME É PEDIDO</h2>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {quandoIndicado.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
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
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">O EXAME É UM DADO, NÃO UMA SENTENÇA</h2>
            <p className="text-brand-muted mt-4">
              A urofluxometria tem valor justamente por ser objetiva, mas números só significam algo dentro do contexto. O mesmo fluxo pode indicar obstrução em um paciente e bexiga com contração fraca em outro, e a conduta muda completamente.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/prostata/hiperplasia-prostatica" className="btn-silver">
                Próstata Aumentada
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

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE UROFLUXOMETRIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Jato fraco tem explicação. E ela começa por medir." />
    </>
  )
}
