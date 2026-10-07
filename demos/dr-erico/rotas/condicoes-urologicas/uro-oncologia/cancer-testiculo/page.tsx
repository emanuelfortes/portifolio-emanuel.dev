import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Câncer de Testículo Fortaleza | Diagnóstico e Tratamento — Dr. Érico Diógenes' },
  description:
    'Câncer de testículo em Fortaleza: o tumor mais curável no homem jovem. Autoexame, diagnóstico precoce, orquiectomia e tratamento. Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/uro-oncologia/cancer-testiculo' },
  openGraph: {
    title: 'Câncer de Testículo Fortaleza | Dr. Érico Diógenes',
    description: 'Câncer de testículo: mais de 95% de cura quando detectado cedo. Aprenda o autoexame, entenda o diagnóstico e o tratamento. Dr. Érico Diógenes em Fortaleza.',
    url: '/condicoes-urologicas/uro-oncologia/cancer-testiculo',
  },
}

const autoexame = [
  'Realize o exame uma vez por mês, de preferência após banho quente (a bolsa escrotal relaxa)',
  'Com o polegar e dois dedos, palpe cada testículo separadamente',
  'Role o testículo entre os dedos: a superfície deve ser lisa, firme e sem irregularidades',
  'Identifique o epidídimo: a estrutura mole e levemente sensível na parte posterior — é normal',
  'Procure diferenças em relação ao exame do mês anterior: um testículo é levemente maior que o outro, mas o tamanho não deve mudar',
  'Qualquer nódulo duro, endurecimento, assimetria nova ou sensação de peso deve ser avaliado imediatamente',
]

const tiposTumor = [
  {
    tipo: 'Seminoma',
    freq: '50-60% dos casos',
    desc: 'O mais comum. Originado das células germinativas. Crescimento mais lento, mais radiossensível e com excelente prognóstico mesmo quando há metástases. Tratado com orquiectomia seguida de radioterapia ou quimioterapia conforme o estágio.',
    marcadores: 'BHCG pode estar levemente elevada. AFP normal.',
    cor: 'border-t-4 border-brand-gold',
  },
  {
    tipo: 'Não-Seminoma',
    freq: '40-50% dos casos',
    desc: 'Grupo que inclui carcinoma embrionário, teratoma, coriocarcinoma e tumor do saco vitelino. Crescimento mais rápido e maior tendência a metástases precoces. Mais sensível à quimioterapia baseada em cisplatina.',
    marcadores: 'AFP e/ou BHCG frequentemente elevados.',
    cor: 'border-t-4 border-brand-navy',
  },
]

const etapasTratamento = [
  {
    num: '01',
    titulo: 'Orquiectomia Radical',
    desc: 'Sempre o primeiro passo, independentemente do estágio. Remoção do testículo afetado por via inguinal (na virilha), não escrotal. Diagnóstico definitivo pela histologia e base para o estadiamento.',
  },
  {
    num: '02',
    titulo: 'Estadiamento Completo',
    desc: 'Tomografia de tórax, abdômen e pelve. Dosagem de marcadores tumorais (AFP, BHCG, LDH) antes e após a cirurgia. A queda dos marcadores após a orquiectomia é monitorada para detectar doença residual.',
  },
  {
    num: '03',
    titulo: 'Decisão Terapêutica',
    desc: 'Estágio I: vigilância ativa, radioterapia ou quimioterapia adjuvante de ciclo único. Estágio II-III: quimioterapia com BEP (bleomicina, etoposídeo, cisplatina) com altas taxas de resposta completa.',
  },
  {
    num: '04',
    titulo: 'Banco de Esperma',
    desc: 'Antes de qualquer tratamento sistêmico (quimioterapia ou radioterapia), o banco de esperma é indicado para preservar a fertilidade. Deve ser realizado antes da orquiectomia sempre que possível.',
  },
]

const faq = [
  {
    q: 'Com que frequência devo fazer o autoexame testicular?',
    a: 'Uma vez por mês é o recomendado. O melhor momento é após o banho quente, quando a bolsa escrotal está relaxada e os testículos são mais fáceis de palpar. O autoexame não substitui a consulta urológica periódica, mas é a ferramenta mais importante que um homem jovem tem para detectar o câncer de testículo em estágio inicial.',
  },
  {
    q: 'Quais são os sintomas do câncer de testículo?',
    a: 'O sintoma mais comum é um nódulo duro e indolor no testículo, frequentemente descoberto pelo próprio paciente. Outros sintomas incluem sensação de peso ou desconforto escrotal, endurecimento difuso do testículo ou aumento de volume. Dor aguda é menos frequente. Metástases podem causar dor lombar, massa abdominal ou sintomas pulmonares.',
  },
  {
    q: 'A retirada de um testículo afeta a fertilidade e a potência sexual?',
    a: 'Geralmente não. Com um testículo saudável, a produção de testosterona e espermatozoides é suficiente para manter a fertilidade e a função sexual normais. A potência sexual é preservada integralmente. O risco para a fertilidade é maior com quimioterapia ou radioterapia subsequentes, por isso o banco de esperma antes do tratamento é fortemente recomendado.',
  },
  {
    q: 'Qual a taxa de cura do câncer de testículo?',
    a: 'É o câncer sólido com maior taxa de cura na medicina moderna. Estágio I (localizado ao testículo): taxa de cura superior a 99%. Estágio II (linfonodos retroperitoneais): 95-99% de cura. Estágio III (metástases a distância): 70-80% de cura com quimioterapia. Mesmo doença avançada é tratável com alta taxa de resposta completa.',
  },
  {
    q: 'Qual a diferença entre seminoma e não-seminoma?',
    a: 'São os dois grandes grupos de tumores germinativos testiculares. O seminoma tende a crescer mais lentamente, é muito sensível à radioterapia e tem excelente prognóstico em todos os estágios. O não-seminoma cresce mais rápido, pode elevar AFP e BHCG, e é tratado prioritariamente com quimioterapia baseada em cisplatina. Ambos têm altas taxas de cura.',
  },
  {
    q: 'Por que homens jovens demoram para buscar ajuda?',
    a: 'Estudos mostram que o tempo médio entre a percepção do sintoma e a consulta médica pode ser de 3 a 5 meses no câncer de testículo, principalmente por vergonha, medo do diagnóstico ou minimização dos sintomas. Esse atraso é a principal causa de diagnóstico em estágio mais avançado. O autoexame mensal e a consulta imediata a qualquer alteração são fundamentais.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uro-Oncologia', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia' },
    { '@type': 'ListItem', position: 3, name: 'Câncer de Testículo', item: 'https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia/cancer-testiculo' },
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

export default function CancerTesticulo() {
  return (
    <>
      <MedicalWebPageSchema
        name="Câncer de Testículo em Fortaleza: O Mais Curável dos Cânceres"
        description="Câncer de testículo em Fortaleza: autoexame, diagnóstico precoce, orquiectomia e tratamento. Mais de 95% de cura. Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/condicoes-urologicas/uro-oncologia/cancer-testiculo"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Uro-Oncologia · Homem Jovem · Fortaleza</p>
              <h1 className="section-title mt-2">
                O câncer de testículo é o mais curável da medicina.{' '}
                <span className="text-brand-gold">Taxa de cura superior a 95%, mas só com diagnóstico precoce.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                É o câncer mais comum em homens entre 15 e 35 anos. Um tumor que a medicina moderna cura com altíssima eficácia em qualquer estágio, mas que mata quando ignorado por meses por vergonha ou medo. O autoexame mensal pode ser a diferença entre uma cirurgia simples e meses de quimioterapia.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Consultar em Fortaleza
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-2.webp"
              alt="Câncer de testículo em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — AUTOEXAME */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">O exame que todo homem deve fazer</p>
            <h2 className="section-title mt-2">COMO FAZER O AUTOEXAME TESTICULAR</h2>
            <p className="text-brand-muted mt-4 mb-8">
              O autoexame testicular é simples, leva menos de 3 minutos e pode detectar o câncer antes que qualquer imagem ou exame de sangue seja alterado. Homens entre 15 e 35 anos devem fazer mensalmente.
            </p>
            <ul className="space-y-3">
              {autoexame.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-brand-beige-light rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 40}>
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-left">
            <div className="bg-brand-navy rounded-3xl p-8 text-white">
              <h3 className="font-display text-xl text-brand-gold mb-6">Procure avaliação imediata se notar:</h3>
              <ul className="space-y-3">
                {[
                  'Nódulo duro e indolor no testículo',
                  'Aumento de volume ou endurecimento do testículo',
                  'Sensação de peso ou pressão na bolsa escrotal',
                  'Dor surda no abdômen inferior ou na virilha',
                  'Acúmulo súbito de líquido na bolsa escrotal (hidrocele)',
                  'Sensibilidade mamária (metástase pode liberar BHCG)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/85">
                    <Check size={14} className="mt-0.5 shrink-0 text-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/60 mt-6">O nódulo testicular não precisa doer para ser câncer. A ausência de dor é característica da doença.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — TIPOS E TRATAMENTO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="eyebrow">Biologia e tratamento</p>
            <h2 className="section-title mt-2">SEMINOMA OU NÃO-SEMINOMA: DO DIAGNÓSTICO AO TRATAMENTO</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-12">
            {tiposTumor.map((t, i) => (
              <div key={t.tipo} className={`bg-white rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display text-xl text-brand-navy">{t.tipo}</h3>
                  <span className="text-xs bg-brand-beige-light rounded-full px-3 py-1 font-medium shrink-0 ml-2">{t.freq}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
                <p className="text-xs text-brand-gold font-medium mt-3">Marcadores: {t.marcadores}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-8" data-aos="fade-up">
            <h3 className="font-display text-xl text-brand-navy">As 4 etapas do tratamento</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {etapasTratamento.map((e, i) => (
              <div key={e.titulo} className="bg-white rounded-2xl overflow-hidden shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="h-20 bg-gradient-to-br from-brand-navy to-brand-navy/70 flex items-center justify-center">
                  <span className="font-display text-4xl text-brand-gold/40">{e.num}</span>
                </div>
                <div className="p-5">
                  <h4 className="font-display text-base text-brand-navy">{e.titulo}</h4>
                  <p className="text-xs text-brand-muted mt-2">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, câncer de testículo Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Diagnóstico e tratamento em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O câncer de testículo é uma das poucas neoplasias malignas que a medicina cura de forma consistente mesmo em estágios avançados. Mas a velocidade do diagnóstico importa: cada mês de atraso pode significar um estágio mais avançado, mais ciclos de quimioterapia e mais efeitos colaterais desnecessários.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes conduz a investigação completa do nódulo testicular: ultrassonografia de alta resolução, dosagem de marcadores tumorais (AFP, BHCG, LDH) e indicação cirúrgica pela via inguinal correta. Com formação pela Universidade Federal do Ceará e especialização em uro-oncologia, acompanha cada paciente do diagnóstico ao seguimento pós-tratamento.
              </p>
              <p>
                Para o Dr. Érico, tratar câncer de testículo é também uma responsabilidade com a fertilidade e a qualidade de vida de homens no início da vida adulta. Por isso, o banco de esperma antes do tratamento é orientação padrão em todos os casos onde há indicação de quimioterapia ou radioterapia.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Avaliação
              </a>
              <Link href="/condicoes-urologicas/uro-oncologia" className="btn-silver">
                Uro-Oncologia
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE CÂNCER DE TESTÍCULO</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Nódulo no testículo? Não deixe para depois. Avalie com Dr. Érico em Fortaleza." />
    </>
  )
}
