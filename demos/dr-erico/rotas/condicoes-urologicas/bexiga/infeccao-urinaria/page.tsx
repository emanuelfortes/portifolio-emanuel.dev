import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Infecção Urinária Fortaleza | Sintomas e Tratamento — Dr. Érico Diógenes' },
  description:
    'Infecção urinária em Fortaleza: sintomas, diferença entre cistite e infecção no rim, por que volta sempre e quando procurar o urologista. Dr. Érico Diógenes explica.',
  alternates: { canonical: '/condicoes-urologicas/bexiga/infeccao-urinaria' },
  openGraph: {
    title: 'Infecção Urinária Fortaleza | Dr. Érico Diógenes',
    description:
      'Entenda os tipos de infecção urinária, por que ela se repete em algumas pessoas e quando a investigação urológica é necessária.',
    url: '/condicoes-urologicas/bexiga/infeccao-urinaria',
  },
}

const tipos = [
  {
    nome: 'Cistite',
    local: 'Bexiga',
    cor: 'bg-brand-gold/10 border-t-4 border-brand-gold',
    corTxt: 'text-brand-gold',
    desc: 'A forma mais comum. Dá ardência ao urinar, vontade frequente e urgente, sensação de não esvaziar e, às vezes, urina turva ou com sangue. Não costuma dar febre.',
    conduta: 'Tratamento com antibiótico guiado pela urocultura sempre que possível.',
  },
  {
    nome: 'Pielonefrite',
    local: 'Rim',
    cor: 'bg-red-50 border-t-4 border-red-400',
    corTxt: 'text-red-500',
    desc: 'A infecção sobe da bexiga para o rim. Aqui aparecem febre alta, calafrios, dor lombar e mal-estar importante. É quadro grave e pode exigir internação.',
    conduta: 'Avaliação médica no mesmo dia. Não é situação para esperar consulta eletiva.',
  },
  {
    nome: 'Bacteriúria assintomática',
    local: 'Sem sintoma',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'Bactéria na urina sem nenhum sintoma. Na maioria dos adultos não se trata, porque tratar não traz benefício e seleciona bactérias resistentes.',
    conduta: 'Tratar apenas em situações específicas, como gestação e antes de certos procedimentos.',
  },
  {
    nome: 'Infecção de repetição',
    local: 'Recorrente',
    cor: 'bg-brand-green/10 border-t-4 border-brand-green',
    corTxt: 'text-brand-green',
    desc: 'Três ou mais episódios em 12 meses, ou dois em 6 meses. Aqui o problema deixa de ser só a bactéria e passa a ser entender por que ela volta.',
    conduta: 'Investigação urológica para procurar causa estrutural ou funcional.',
  },
]

const porQueVolta = [
  {
    fator: 'Anatomia feminina',
    detalhe:
      'A uretra da mulher é curta e fica próxima da região anal, o que facilita a chegada de bactérias à bexiga. Não é falta de higiene: é anatomia. Por isso a infecção urinária é muito mais frequente em mulheres.',
  },
  {
    fator: 'Esvaziamento incompleto da bexiga',
    detalhe:
      'Urina que sobra na bexiga é meio de cultura. Acontece por obstrução, como próstata aumentada no homem, ou por alteração no funcionamento do músculo vesical. É uma das causas mais importantes de repetição.',
  },
  {
    fator: 'Cálculo urinário',
    detalhe:
      'A pedra abriga bactérias em sua superfície, onde o antibiótico não alcança bem. Enquanto o cálculo permanece, a infecção tende a retornar sempre com o mesmo germe.',
  },
  {
    fator: 'Menopausa',
    detalhe:
      'A queda de estrogênio altera a mucosa e a flora vaginal, reduzindo a proteção natural contra bactérias. É uma causa frequente e tratável de infecções de repetição após os 50 anos.',
  },
  {
    fator: 'Diabetes',
    detalhe:
      'Glicose na urina favorece o crescimento bacteriano, e o diabetes descompensado ainda reduz a resposta imune local. Controlar a glicemia faz parte do tratamento da infecção de repetição.',
  },
  {
    fator: 'Hidratação insuficiente',
    detalhe:
      'Urinar pouco significa lavar menos a bexiga. Em Fortaleza, com calor o ano inteiro, a desidratação é um fator subestimado e de correção simples.',
  },
]

const quandoUrologista = [
  'Três ou mais episódios em 12 meses, ou dois em 6 meses',
  'Febre, calafrios ou dor lombar junto com os sintomas urinários',
  'Sangue na urina que persiste depois do tratamento',
  'Infecção urinária em homem, que é sempre menos comum e merece investigação',
  'Sintomas que não melhoram após 48 a 72 horas de antibiótico',
  'Episódios acompanhados de jato fraco ou sensação de bexiga cheia',
  'Histórico de cálculo renal ou de cirurgia do trato urinário',
]

const faq = [
  {
    q: 'Toda infecção urinária precisa de antibiótico?',
    a: 'Não. Bacteriúria assintomática, que é bactéria na urina sem sintoma nenhum, em geral não se trata em adultos saudáveis, porque tratar não melhora nada e favorece bactérias resistentes. Já a cistite com sintomas e a pielonefrite precisam de antibiótico, idealmente escolhido pela urocultura.',
  },
  {
    q: 'Por que a infecção urinária volta sempre?',
    a: 'Porque tratar o episódio não resolve a causa. Quando há repetição, existe quase sempre um fator por trás: esvaziamento incompleto da bexiga, cálculo, alterações da menopausa, diabetes ou hidratação insuficiente. A investigação procura esse fator, e é o que quebra o ciclo.',
  },
  {
    q: 'Homem pode ter infecção urinária?',
    a: 'Pode, mas é bem menos comum pela anatomia masculina. Justamente por isso, infecção urinária em homem raramente é tratada como evento isolado: costuma-se investigar próstata, esvaziamento da bexiga e cálculo, porque com frequência há uma causa por trás.',
  },
  {
    q: 'Cranberry e suplementos funcionam?',
    a: 'A evidência é modesta e inconsistente. Algumas medidas têm respaldo melhor, como hidratação adequada, não adiar a micção e tratar as alterações da menopausa. Nenhuma delas substitui a investigação quando há repetição, e vale conversar sobre isso na consulta em vez de contar só com suplemento.',
  },
  {
    q: 'Infecção urinária pode virar problema no rim?',
    a: 'Sim. Quando a infecção sobe da bexiga para o rim, torna-se pielonefrite, com febre alta, calafrios e dor lombar. É um quadro que pode ser grave e exige avaliação no mesmo dia. É o principal motivo para não adiar o tratamento de uma cistite.',
  },
  {
    q: 'Preciso fazer urocultura sempre?',
    a: 'Nem sempre em um primeiro episódio simples, mas ela é muito importante quando há repetição, quando o tratamento falhou ou quando o quadro é mais grave. A urocultura identifica a bactéria e mostra a quais antibióticos ela responde, o que evita tratamento às cegas.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Bexiga', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga' },
    { '@type': 'ListItem', position: 3, name: 'Infecção Urinária', item: 'https://drericodiogenes.com.br/condicoes-urologicas/bexiga/infeccao-urinaria' },
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

export default function InfeccaoUrinaria() {
  return (
    <>
      <MedicalWebPageSchema
        name="Infecção Urinária em Fortaleza: Sintomas, Tipos e Tratamento"
        description="Tipos de infecção urinária, por que ela se repete e quando a investigação urológica é necessária. Dr. Érico Diógenes, urologista em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/bexiga/infeccao-urinaria"
        specialty="Urology"
      />

      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Bexiga e Trato Urinário · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Se a infecção urinária volta sempre,{' '}
                <span className="text-brand-gold">o problema não é a bactéria.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                Tratar o episódio alivia. Mas quando a infecção retorna três, quatro vezes por ano, existe quase sempre um fator por trás que o antibiótico não alcança. Encontrar esse fator é o que interrompe o ciclo, e é exatamente isso que a avaliação urológica procura.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar Avaliação
                </a>
                <Link href="/condicoes-urologicas/bexiga" className="btn-silver">
                  Ver Condições da Bexiga
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

      {/* SEÇÃO 2 — TIPOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Nem toda infecção é igual</p>
            <h2 className="section-title mt-2">OS TIPOS DE INFECÇÃO URINÁRIA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O nome muda conforme o local acometido e a forma de apresentação. E cada um pede uma conduta diferente, inclusive a de não tratar.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.nome} className={`rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-lg ${t.corTxt}`}>{t.nome}</h3>
                  <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm whitespace-nowrap">{t.local}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
                <div className="mt-4 pt-3 border-t border-white/60">
                  <p className="text-xs font-medium text-brand-navy">{t.conduta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — POR QUE VOLTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">A pergunta que importa</p>
            <h2 className="section-title mt-2">POR QUE ELA VOLTA SEMPRE</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {porQueVolta.map((f, i) => (
              <div key={f.fator} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <h3 className="font-display text-lg text-brand-navy">{f.fator}</h3>
                <p className="text-sm text-brand-muted mt-2">{f.detalhe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — QUANDO PROCURAR */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Além do tratamento do episódio</p>
            <h2 className="section-title mt-2">QUANDO PROCURAR O UROLOGISTA</h2>
            <p className="text-brand-muted mt-4">
              Um episódio simples costuma ser resolvido na atenção primária. Os itens abaixo indicam que vale uma avaliação especializada.
            </p>
          </div>
          <div className="bg-brand-beige-light rounded-2xl p-6 md:p-8" data-aos="fade-up">
            <ul className="space-y-3">
              {quandoUrologista.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-brand-gold" />
                  <span className="text-sm text-brand-muted">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-sm text-brand-muted mt-6" data-aos="fade-up">
            Febre alta com dor lombar e mal-estar importante indica possível infecção no rim. Procure atendimento no mesmo dia.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 — ESPECIALISTA */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação em Fortaleza</p>
            <h2 className="section-title mt-2">INVESTIGAR A CAUSA, NÃO SÓ TRATAR O EPISÓDIO</h2>
            <p className="text-brand-muted mt-4">
              A infecção urinária de repetição é uma das queixas mais frequentes no consultório, e também uma das que mais gera frustração: o paciente toma antibiótico, melhora, e meses depois está de volta. A avaliação urológica procura o que sustenta esse ciclo.
            </p>
            <p className="text-brand-muted mt-4">
              Dr. Érico Diógenes atende no Pátio Dom Luís, na Aldeota, de segunda a sexta, das 8h às 18h.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/bexiga/sangue-na-urina" className="btn-silver">
                Sangue na Urina
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demos/dr-erico/img/dr-erico-foto-5.webp"
                alt="Dr. Érico Diógenes, urologista em Fortaleza"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE INFECÇÃO URINÁRIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Infecção urinária que volta sempre tem causa. Vamos encontrá-la." />
    </>
  )
}
