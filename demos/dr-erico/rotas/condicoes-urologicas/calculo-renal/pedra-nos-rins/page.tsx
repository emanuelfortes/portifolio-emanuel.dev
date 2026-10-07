import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Pedra nos Rins Fortaleza | Tipos, Causas e Prevenção — Dr. Érico Diógenes' },
  description:
    'Pedra nos rins em Fortaleza: entenda os tipos de cálculo renal, por que eles se formam, quem está em risco e como prevenir novas crises. Dr. Érico Diógenes explica.',
  alternates: { canonical: '/condicoes-urologicas/calculo-renal/pedra-nos-rins' },
  openGraph: {
    title: 'Pedra nos Rins Fortaleza | Dr. Érico Diógenes',
    description: 'Conheça os tipos de pedra nos rins, as causas, os fatores de risco e as estratégias de prevenção com Dr. Érico Diógenes em Fortaleza.',
    url: '/condicoes-urologicas/calculo-renal/pedra-nos-rins',
  },
}

const tipos = [
  {
    nome: 'Oxalato de Cálcio',
    freq: '70% dos casos',
    cor: 'bg-brand-gold/10 border-t-4 border-brand-gold',
    corTxt: 'text-brand-gold',
    desc: 'O tipo mais comum. Forma-se quando a urina tem excesso de cálcio e oxalato. Alimentos ricos em oxalato (espinafre, amêndoas, cacau) e baixa ingestão de água são os principais gatilhos.',
    prevencao: 'Hidratação abundante, redução de oxalato na dieta, cálcio alimentar adequado.',
  },
  {
    nome: 'Ácido Úrico',
    freq: '10% dos casos',
    cor: 'bg-brand-navy/5 border-t-4 border-brand-navy',
    corTxt: 'text-brand-navy',
    desc: 'Relacionado à gota, obesidade e dietas ricas em proteína animal. A urina ácida favorece a precipitação do ácido úrico. Ao contrário dos outros tipos, pode se dissolver com medicamentos.',
    prevencao: 'Alcalinização da urina, redução de proteína animal, tratamento da gota.',
  },
  {
    nome: 'Estruvita (Infecciosa)',
    freq: '10% dos casos',
    cor: 'bg-red-50 border-t-4 border-red-400',
    corTxt: 'text-red-500',
    desc: 'Formada por bactérias urease-positivas que alcalinizam a urina. Pode crescer rapidamente e ocupar toda a pelve renal (cálculo coraliforme). Mais comum em mulheres com infecções urinárias de repetição.',
    prevencao: 'Tratamento rigoroso das infecções urinárias. Exige acompanhamento especializado.',
  },
  {
    nome: 'Cistina',
    freq: 'Menos de 2%',
    cor: 'bg-brand-green/10 border-t-4 border-brand-green',
    corTxt: 'text-brand-green',
    desc: 'Causa genética (cistinúria). Esses cálculos tendem a ser recorrentes, bilaterais e de difícil tratamento. Diagnóstico pela análise do cálculo e pesquisa de cistina na urina de 24 horas.',
    prevencao: 'Hiperhidratação extrema, alcalinização da urina e medicamentos específicos.',
  },
]

const fatores = [
  { fator: 'Desidratação crônica', detalhe: 'Principal causa no Brasil, especialmente no Nordeste. Urina concentrada favorece a precipitação de cristais. A meta é produzir mais de 2 litros de urina por dia.' },
  { fator: 'Dieta hipercalórica e hiperproteica', detalhe: 'Excesso de sal aumenta a excreção de cálcio urinário. Proteína animal em excesso aumenta ácido úrico e reduz o pH da urina.' },
  { fator: 'Histórico familiar', detalhe: 'Ter parentes com cálculo renal aumenta significativamente o risco. Algumas alterações metabólicas que predispõem ao cálculo têm base genética.' },
  { fator: 'Obesidade e síndrome metabólica', detalhe: 'Resistência à insulina altera o metabolismo do ácido úrico e reduz o pH urinário, favorecendo cálculos de ácido úrico.' },
  { fator: 'Alterações metabólicas', detalhe: 'Hipercalciúria, hiperoxalúria, hiperuricosúria, hipocitratúria e hipomagnesúria são alterações detectadas na urina de 24h que aumentam o risco.' },
  { fator: 'Doenças intestinais', detalhe: 'Doença de Crohn, ressecção intestinal e síndrome do intestino curto aumentam a absorção de oxalato, levando à hiperoxalúria entérica.' },
]

const prevencao = [
  'Beber no mínimo 2,5 litros de água por dia, especialmente no Nordeste',
  'Reduzir o sal para menos de 5g por dia (equivalente a 1 colher de chá)',
  'Não exagerar na proteína animal: menos de 0,8g por kg de peso corporal por dia',
  'Manter ingestão adequada de cálcio PELA ALIMENTAÇÃO (laticínios), nunca pelo suplemento',
  'Evitar excesso de alimentos ricos em oxalato: espinafre, amêndoas, cacau, chá preto',
  'Fazer urina de 24 horas periodicamente para identificar alterações metabólicas',
]

const faq = [
  {
    q: 'Pedra nos rins passa sozinha?',
    a: 'Depende do tamanho e localização. Pedras menores de 4 mm têm alta taxa de eliminação espontânea (mais de 80%) com hidratação e analgesia. Entre 4 e 6 mm, a taxa cai para 50-60%. Acima de 6 mm, a eliminação espontânea é improvável e alguma intervenção costuma ser necessária. O urologista define a conduta certa para cada caso.',
  },
  {
    q: 'Devo evitar cálcio se tenho pedra nos rins?',
    a: 'Não. A maioria das pessoas faz exatamente o oposto do que deveria: reduz cálcio achando que vai prevenir pedra. Na verdade, cálcio alimentar adequado (laticínios com as refeições) REDUZ a formação de cálculos de oxalato, porque o cálcio se liga ao oxalato no intestino, impedindo sua absorção. O que deve ser evitado é o suplemento de cálcio isolado.',
  },
  {
    q: 'Por que a pedra dói tanto?',
    a: 'A dor não é causada pela pedra em si, mas pela obstrução que ela provoca no ureter. O bloqueio causa distensão da via urinária e espasmo ureteral intenso. A cólica renal é classificada como uma das dores mais intensas da medicina, comparável às contrações do parto. A dor é em ondas porque o espasmo ureteral tem ritmo próprio.',
  },
  {
    q: 'Qual exame diagnostica pedra nos rins?',
    a: 'A tomografia computadorizada sem contraste (uro-TC) é o padrão ouro: detecta praticamente 100% dos cálculos, independentemente do tipo. O ultrassom é útil como triagem e para acompanhar pedras conhecidas. A radiografia simples detecta apenas cálculos radiopacos. O urologista indica o exame mais adequado para cada situação.',
  },
  {
    q: 'Quem já teve pedra vai ter de novo?',
    a: 'O risco de recorrência é alto: sem investigação e prevenção, até 50% dos pacientes têm novo episódio em 5 anos. Por isso, após a eliminação ou tratamento do cálculo, a investigação metabólica (urina de 24h, exames de sangue, análise do cálculo) é fundamental para identificar a causa e traçar um plano de prevenção individualizado.',
  },
  {
    q: 'Pedra nos rins tem relação com o clima do Nordeste?',
    a: 'Sim, diretamente. O Nordeste brasileiro, incluindo Fortaleza, está inserido no chamado "cinturão de pedra" climático, onde a combinação de calor e desidratação aumenta a concentração urinária e favorece a formação de cálculos. A prevalência de cálculo renal na região é uma das mais altas do Brasil, o que torna o rastreamento e a hidratação ainda mais importantes.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Cálculo Renal', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal' },
    { '@type': 'ListItem', position: 3, name: 'Pedra nos Rins', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal/pedra-nos-rins' },
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

export default function PedraNosRins() {
  return (
    <>
      <MedicalWebPageSchema
        name="Pedra nos Rins em Fortaleza: Tipos, Causas e Prevenção"
        description="Tipos de cálculo renal, causas, fatores de risco e estratégias de prevenção. Dr. Érico Diógenes, urologista especialista em cálculo renal em Fortaleza."
        url="https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal/pedra-nos-rins"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Cálculo Renal · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                1 em cada 10 brasileiros vai ter pedra nos rins ao longo da vida.{' '}
                <span className="text-brand-gold">Entenda por que e como evitar.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O cálculo renal é uma das condições urológicas mais prevalentes no Brasil e a mais comum no Nordeste. Não é apenas uma pedra: é um sinal de que algo no metabolismo ou nos hábitos precisa mudar. Conhecer o tipo, a causa e os fatores de risco é o primeiro passo para nunca mais ter uma crise.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Consultar em Fortaleza
                </a>
                <Link href="/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal" className="btn-silver">
                  Ver Tratamentos
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5b.webp"
              alt="Pedra nos rins Fortaleza, Dr. Érico Diógenes"
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
            <p className="eyebrow">O tipo define o tratamento</p>
            <h2 className="section-title mt-2">OS 4 TIPOS DE PEDRA NOS RINS</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Nem toda pedra nos rins é igual. A composição do cálculo determina sua causa, seu comportamento e, principalmente, a estratégia de prevenção. Identificar o tipo é o passo mais importante após o episódio inicial.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.nome} className={`rounded-2xl p-6 shadow-card ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-display text-lg ${t.corTxt}`}>{t.nome}</h3>
                  <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 shadow-sm">{t.freq}</span>
                </div>
                <p className="text-sm text-brand-muted">{t.desc}</p>
                <div className="mt-4 pt-3 border-t border-white/60">
                  <p className="text-xs font-medium text-brand-navy">Prevenção: {t.prevencao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — FATORES + PREVENÇÃO */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-start">
          <div data-aos="fade-right">
            <p className="eyebrow">Por que acontece</p>
            <h2 className="section-title mt-2">FATORES DE RISCO</h2>
            <p className="text-brand-muted mt-4 mb-8">
              O cálculo renal raramente tem uma causa única. É quase sempre o resultado da combinação de hábitos, genética e alterações metabólicas que podem ser identificadas, corrigidas e monitoradas.
            </p>
            <div className="space-y-3">
              {fatores.map((item, i) => (
                <div key={item.fator} className="bg-white rounded-xl p-4 shadow-card" data-aos="fade-up" data-aos-delay={i * 50}>
                  <p className="font-medium text-brand-navy text-sm">{item.fator}</p>
                  <p className="text-xs text-brand-muted mt-1">{item.detalhe}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Como evitar novas crises</p>
            <h2 className="section-title mt-2">PREVENÇÃO BASEADA EM EVIDÊNCIAS</h2>
            <p className="text-brand-muted mt-4 mb-8">
              As medidas abaixo são validadas por evidências científicas e podem reduzir o risco de recorrência em até 70%. A prevenção começa no consultório com uma investigação metabólica completa.
            </p>
            <ul className="space-y-3">
              {prevencao.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 50}>
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-5 bg-brand-navy rounded-2xl text-white text-sm" data-aos="fade-up">
              <p className="font-display text-base text-brand-gold mb-2">Atenção ao clima do Nordeste</p>
              <p className="text-white/80">Fortaleza integra o "cinturão de pedra" climático. O calor intenso aumenta a perda hídrica e concentra a urina, tornando a hidratação ainda mais crítica nessa região.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Especialista em cálculo renal em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                Tratar a pedra nos rins é urgente. Prevenir a próxima é o que faz a diferença na vida do paciente. O Dr. Érico Diógenes conduz essa investigação de forma completa: análise do cálculo expelido (quando possível), urina de 24 horas, exames de sangue e avaliação dos hábitos alimentares para identificar a causa raiz de cada caso.
              </p>
              <p>
                Em Fortaleza, onde o clima potencializa o risco de formação de cálculos, o acompanhamento especializado é ainda mais relevante. Com formação pela Universidade Federal do Ceará e experiência no tratamento endoscópico de cálculos renais e ureterais, o Dr. Érico oferece tanto o tratamento agudo das crises quanto o plano preventivo de longo prazo.
              </p>
              <p>
                Se você já teve pedra nos rins uma vez, a probabilidade de ter de novo é alta. O momento certo para investigar a causa é agora.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal" className="btn-silver">
                Ver Opções de Tratamento
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-3.webp" alt="Dr. Érico Diógenes, especialista em pedra nos rins Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS FREQUENTES SOBRE PEDRA NOS RINS</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Já teve pedra nos rins? Investigue a causa antes da próxima crise." />
    </>
  )
}
