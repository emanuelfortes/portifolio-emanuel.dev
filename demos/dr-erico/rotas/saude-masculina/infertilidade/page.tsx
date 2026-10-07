import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Infertilidade Masculina Fortaleza | Espermograma — Dr. Érico Diógenes' },
  description:
    'Infertilidade masculina em Fortaleza: espermograma, varicocele, causas hormonais e tratamentos com Dr. Érico Diógenes. O fator masculino está presente em 50% dos casos de infertilidade conjugal.',
  alternates: { canonical: '/saude-masculina/infertilidade' },
  openGraph: {
    title: 'Infertilidade Masculina Fortaleza | Dr. Érico Diógenes',
    description: 'O fator masculino causa 50% dos casos de infertilidade conjugal. Investigação e tratamento em Fortaleza com Dr. Érico Diógenes.',
    url: '/saude-masculina/infertilidade',
  },
}

const causas = [
  {
    nome: 'Varicocele',
    freq: 'Causa mais comum e mais tratável: 35-40% dos casos',
    desc: 'Dilatação das veias do testículo que eleva a temperatura escrotal e prejudica a produção de espermatozoides. A cirurgia de varicocelectomia melhora o espermograma em 60-70% dos casos e é o tratamento masculino com maior evidência de eficácia em reprodução assistida.',
    cor: 'border-t-4 border-brand-gold',
  },
  {
    nome: 'Causas Obstrutivas',
    freq: 'Azoospermia obstrutiva: espermatogênese normal, obstrução na saída',
    desc: 'Ausência congênita dos vasos deferentes (associada a mutação CFTR da fibrose cística), epididimite prévia com fibrose do epidídimo ou vasectomia prévia. Tratamento: reconstrução microcirúrgica (vasovasostomia, vasoepididimostomia) ou aspiração espermática (PESA/TESA) para FIV-ICSI.',
    cor: 'border-t-4 border-brand-navy',
  },
  {
    nome: 'Causas Hormonais',
    freq: 'Hipogonadismo hipogonadotrófico',
    desc: 'Deficiência de FSH e LH (gonadotrofinas) resulta em testosterona baixa e espermatogênese comprometida. Causas: hiperprolactinemia, tumores hipofisários, uso de esteroides anabolizantes, síndrome de Kallmann. Tratamento: gonadotrofinas exógenas (HCG + FSH) com altas taxas de recuperação da fertilidade.',
    cor: 'border-t-4 border-red-400',
  },
  {
    nome: 'Causas Genéticas',
    freq: 'Microdeleções do cromossomo Y, síndrome de Klinefelter',
    desc: 'Microdeleções na região AZF do cromossomo Y interferem diretamente com genes essenciais da espermatogênese. A síndrome de Klinefelter (47,XXY) é a causa genética mais comum de azoospermia secretora: alguns homens ainda têm ilhas de espermatogênese passíveis de TESE com êxito.',
    cor: 'border-t-4 border-brand-green',
  },
]

const espermograma = [
  { param: 'Volume do ejaculado', ref: 'Mínimo 1,4 mL', obs: 'Volume baixo: obstrução dos ductos ejaculatórios ou ausência dos deferentes' },
  { param: 'Concentração espermática', ref: 'Mínimo 16 milhões/mL', obs: 'Oligozoospermia: redução de concentração; azoospermia: ausência total' },
  { param: 'Motilidade progressiva (PR)', ref: 'Mínimo 30%', obs: 'Astenozoospermia: motilidade reduzida, impacta capacidade de fertilização' },
  { param: 'Morfologia normal (Kruger)', ref: 'Mínimo 4% de formas normais', obs: 'Teratozoospermia: morfologia anormal, associada a falhas de fertilização em FIV' },
  { param: 'Vitalidade', ref: 'Mínimo 54% de espermatozoides vivos', obs: 'Necrozoospermia: alta proporção de espermatozoides mortos no ejaculado' },
]

const tratamentos = [
  {
    nivel: 'Correção Cirúrgica',
    desc: 'Varicocelectomia microcirúrgica (varicocele), vasovasostomia (pós-vasectomia), ressecção de cistos prostáticos ou obstrutivos. Meta: recuperação da fertilidade natural.',
    cor: 'bg-brand-navy text-brand-beige',
  },
  {
    nivel: 'Indução Hormonal',
    desc: 'Gonadotrofinas (HCG + FSH recombinante) para hipogonadismo hipogonadotrófico. Clomifeno off-label para oligozoospermia com FSH normal. Suspensão de anabolizantes com acompanhamento da recuperação.',
    cor: 'bg-brand-gold text-white',
  },
  {
    nivel: 'Reprodução Assistida',
    desc: 'Inseminação intrauterina (IIU) para oligospermia leve-moderada. FIV-ICSI para casos severos. Aspiração espermática (PESA, TESE) para azoospermia obstrutiva ou secretora com ilhas de espermatogênese.',
    cor: 'bg-brand-green text-white',
  },
]

const faq = [
  {
    q: 'O que é o espermograma e quando fazer?',
    a: 'O espermograma (análise seminal) é o exame básico da fertilidade masculina. Avalia volume, concentração, motilidade e morfologia dos espermatozoides segundo os critérios da OMS (5ª edição, 2021). Todo casal com dificuldade para engravidar após 12 meses de tentativas (ou 6 meses se a parceira tiver mais de 35 anos) deve incluir o espermograma na investigação inicial. Um único resultado alterado deve ser confirmado com segundo exame após 2-3 meses.',
  },
  {
    q: 'O fator masculino é realmente investigado na mesma proporção que o feminino?',
    a: 'Não. Apesar de o fator masculino estar presente em 40-50% dos casos de infertilidade conjugal, a mulher ainda é investigada com muito mais frequência e precocidade. Isso atrasa o diagnóstico em anos e expõe a parceira a procedimentos desnecessários. A investigação do homem é simples (espermograma), não invasiva e deve ser feita simultaneamente à avaliação feminina.',
  },
  {
    q: 'Varicocele sempre causa infertilidade?',
    a: 'Não. Muitos homens com varicocele têm fertilidade normal. O problema ocorre quando a varicocele compromete suficientemente a espermatogênese a ponto de reduzir concentração, motilidade ou morfologia no espermograma. A indicação de cirurgia depende da combinação: casal com infertilidade + varicocele clinicamente palpável + espermograma alterado. Varicocele isolada sem desejo de fertilidade não tem indicação cirúrgica por esse motivo.',
  },
  {
    q: 'Uso de anabolizantes prejudica a fertilidade?',
    a: 'Sim, profundamente. Esteroides anabolizantes exógenos suprimem o eixo hipotálamo-hipófise-gonadal, zerando a produção endógena de gonadotrofinas e, consequentemente, a espermatogênese. Azoospermia induzida por anabolizantes é reversível na maioria dos casos após suspensão, mas pode levar 12-24 meses para normalizar. Uso prolongado pode resultar em supressão irreversível.',
  },
  {
    q: 'Vasectomia pode ser revertida?',
    a: 'Sim. A vasovasostomia (reversão de vasectomia) tem taxas de permeabilidade de 85-97% quando realizada até 3 anos após a vasectomia, e de 53-71% após 9-14 anos. O sucesso de gravidez também diminui com o tempo. Para vasectomia antiga (mais de 15 anos), a aspiração espermática com ICSI pode ser mais eficaz do que a reversão cirúrgica.',
  },
  {
    q: 'É possível ter filhos com azoospermia?',
    a: 'Em muitos casos, sim. Na azoospermia obstrutiva, a espermatogênese é normal e os espermatozoides podem ser aspirados do epidídimo (PESA) ou do testículo (TESE) para fertilização in vitro com ICSI. Na azoospermia secretora (falha da espermatogênese), existem casos com ilhas de espermatogênese detectáveis por TESE microcirúrgica, com taxas de recuperação de 50-60% em centros especializados.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Saúde Masculina', item: 'https://drericodiogenes.com.br/saude-masculina' },
    { '@type': 'ListItem', position: 3, name: 'Infertilidade Masculina', item: 'https://drericodiogenes.com.br/saude-masculina/infertilidade' },
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

export default function InfertilidadeMasculina() {
  return (
    <>
      <MedicalWebPageSchema
        name="Infertilidade Masculina em Fortaleza: Espermograma e Tratamento"
        description="Investigação e tratamento da infertilidade masculina em Fortaleza: espermograma, varicocele, causas hormonais e genéticas. Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/saude-masculina/infertilidade"
        specialty="Urology"
      />



      {/* HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="relative overflow-hidden min-h-[320px]" data-aos="fade-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/dr-erico/img/dr-erico-foto-3.webp" alt="Infertilidade masculina tratamento Fortaleza" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-left">
            <div>
              <p className="eyebrow">Andrologia Reprodutiva · Fortaleza, CE</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-navy leading-tight mt-2">
                O casal não consegue engravidar.{' '}
                <span className="text-brand-gold">Em metade dos casos, a causa está no homem. Mas o homem é o último a ser investigado.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O espermograma é o exame mais simples, mais barato e mais informativo da reprodução masculina. Um resultado normal descarta o fator masculino em minutos. Um resultado alterado aponta o caminho de um tratamento eficaz.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Consultar em Fortaleza
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPERMOGRAMA */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O ponto de partida</p>
            <h2 className="section-title mt-2">O QUE O ESPERMOGRAMA AVALIA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O espermograma avalia cinco parâmetros principais com valores de referência definidos pela OMS (2021). Cada parâmetro alterado tem um nome clínico, causas específicas e tratamentos diferentes.
            </p>
          </div>
          <div className="overflow-x-auto max-w-5xl mx-auto">
            <table className="w-full text-sm rounded-2xl overflow-hidden shadow-card" data-aos="fade-up">
              <thead className="bg-brand-navy text-brand-beige">
                <tr>
                  <th className="text-left px-5 py-3 font-display font-medium">Parâmetro</th>
                  <th className="text-left px-5 py-3 font-display font-medium">Referência OMS 2021</th>
                  <th className="text-left px-5 py-3 font-display font-medium">O que significa se alterado</th>
                </tr>
              </thead>
              <tbody>
                {espermograma.map((e, i) => (
                  <tr key={e.param} className={i % 2 === 0 ? 'bg-brand-beige-light' : 'bg-white'}>
                    <td className="px-5 py-4 font-medium text-brand-navy">{e.param}</td>
                    <td className="px-5 py-4 text-brand-gold font-semibold">{e.ref}</td>
                    <td className="px-5 py-4 text-brand-muted">{e.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CAUSAS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Diagnóstico diferencial masculino</p>
            <h2 className="section-title mt-2">CAUSAS DA INFERTILIDADE MASCULINA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Cada causa tem abordagem diagnóstica e terapêutica específica. O caminho da varicocelectomia é completamente diferente do caminho da indução hormonal ou da aspiração espermática.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {causas.map((c, i) => (
              <div key={c.nome} className={`bg-white rounded-2xl p-6 shadow-card ${c.cor}`} data-aos="fade-up" data-aos-delay={i * 70}>
                <h3 className="font-display text-lg text-brand-navy mb-1">{c.nome}</h3>
                <p className="text-xs font-semibold text-brand-gold mb-3">{c.freq}</p>
                <p className="text-sm text-brand-muted">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-5xl mx-auto" data-aos="fade-up">
            <p className="eyebrow text-center mb-6">Linha de tratamento</p>
            <div className="grid md:grid-cols-3 gap-4">
              {tratamentos.map((t, i) => (
                <div key={t.nivel} className={`rounded-2xl p-6 ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                  <h3 className="font-display text-base mb-3">{t.nivel}</h3>
                  <p className="text-sm opacity-90">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Andrologia reprodutiva em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A investigação andrológica da infertilidade masculina em Fortaleza começa com o espermograma, mas vai muito além dele. O Dr. Érico Diógenes realiza a investigação completa do fator masculino: exames hormonais (FSH, LH, testosterona, prolactina), ultrassom escrotal com Doppler para avaliação de varicocele, e investigação genética quando indicada.
              </p>
              <p>
                Para homens com varicocele e espermograma alterado, a varicocelectomia microcirúrgica oferece chance de recuperação da fertilidade natural antes de qualquer recurso à reprodução assistida. Para casos mais complexos, o Dr. Érico coordena com clínicas de reprodução humana para definir a melhor estratégia incluindo FIV-ICSI com espermatozoides obtidos por PESA ou TESE.
              </p>
              <p>
                Homens em tratamento oncológico que precisam preservar a fertilidade também recebem orientação sobre criopreservação de sêmen antes de quimioterapia ou radioterapia.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar Consulta</a>
              <Link href="/saude-masculina/baixa-testosterona" className="btn-silver">Baixa Testosterona</Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-5.webp" alt="Dr. Érico Diógenes, infertilidade masculina Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE INFERTILIDADE MASCULINA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Fator masculino em 50% dos casos. Investigue com Dr. Érico em Fortaleza." />
    </>
  )
}
