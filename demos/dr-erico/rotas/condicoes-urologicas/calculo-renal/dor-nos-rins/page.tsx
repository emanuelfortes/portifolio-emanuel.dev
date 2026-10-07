import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Dor nos Rins Urologista Fortaleza | Cólica Renal — Dr. Érico Diógenes' },
  description:
    'Sentiu dor nos rins em Fortaleza? Entenda a diferença entre cólica renal, dor muscular e infecção. Saiba quando ir à emergência e quando consultar um urologista.',
  alternates: { canonical: '/condicoes-urologicas/calculo-renal/dor-nos-rins' },
  openGraph: {
    title: 'Dor nos Rins: Cólica Renal ou Outra Causa? | Dr. Érico Diógenes Fortaleza',
    description: 'A dor nos rins pode ter causas muito diferentes. Aprenda a identificar a cólica renal, os sinais de emergência e quando procurar um urologista em Fortaleza.',
    url: '/condicoes-urologicas/calculo-renal/dor-nos-rins',
  },
}

const causas = [
  {
    causa: 'Cólica Renal (Cálculo)',
    perfil: 'Dor intensa em ondas, no flanco, irradiando para a virilha. Sem posição de alívio. Acompanha náusea e sudorese.',
    urgencia: 'Consultar urologista em até 24-48h',
    cor: 'border-l-4 border-brand-gold bg-brand-gold/5',
  },
  {
    causa: 'Infecção Urinária Alta (Pielonefrite)',
    perfil: 'Dor lombar constante, febre alta acima de 38,5°C, calafrios, mal-estar intenso. Pode ter ardência ao urinar.',
    urgencia: 'EMERGÊNCIA: procurar pronto-socorro imediatamente',
    cor: 'border-l-4 border-red-500 bg-red-50',
  },
  {
    causa: 'Dor Muscular Lombar',
    perfil: 'Dor constante, piora com movimento ou posição. Alivia com anti-inflamatório. Sem sintomas urinários.',
    urgencia: 'Consulta eletiva (clínica geral ou ortopedia)',
    cor: 'border-l-4 border-brand-navy/30 bg-brand-navy/5',
  },
  {
    causa: 'Obstrução com Infecção (Pionefrosis)',
    perfil: 'Febre alta + dor lombar + urina turva ou fétida. O rim obstruído e infectado é emergência cirúrgica.',
    urgencia: 'EMERGÊNCIA ABSOLUTA: ir imediatamente ao pronto-socorro',
    cor: 'border-l-4 border-red-700 bg-red-100',
  },
]

const naoCriseDoQue = [
  { mito: 'Tomar suco de limão ou cranberry resolve', realidade: 'Não dissolve cálculo de oxalato de cálcio (o tipo mais comum). Pode atrasar o tratamento adequado.' },
  { mito: 'Tomar muito refrigerante para forçar a passagem', realidade: 'Refrigerante aumenta a concentração urinária e o risco de novos cálculos. Água é o único líquido indicado.' },
  { mito: 'Aguentar a dor em casa por dias', realidade: 'Obstrução prolongada causa dano renal progressivo. Dor refratária por mais de 72h indica necessidade de intervenção.' },
  { mito: 'Fazer exercício intenso para forçar a saída da pedra', realidade: 'Sem evidência científica. Pode piorar a dor e o estado geral.' },
]

const sinaisEmergencia = [
  'Febre acima de 38,5°C associada à dor lombar',
  'Urina turva, com cheiro forte ou com pus',
  'Dor que não melhora com nenhuma posição ou analgésico',
  'Náuseas e vômitos incontroláveis, sem conseguir tomar medicamentos',
  'Calafrios e tremores junto com dor lombar',
  'Rim único obstruído (qualquer dor lombar nesse caso é urgência)',
]

const oQueEsperar = [
  {
    etapa: 'Diagnóstico de Imagem',
    desc: 'Tomografia ou ultrassom identifica localização, tamanho e grau de obstrução. Define se há urgência cirúrgica ou se é possível aguardar.',
  },
  {
    etapa: 'Controle da Dor',
    desc: 'Anti-inflamatórios (cetorolaco, dipirona) e antiespasmódicos controlam a cólica renal. Morfina e tramadol para dor refratária.',
  },
  {
    etapa: 'Decisão de Conduta',
    desc: 'Pedras menores de 4-5 mm: aguardar com hidratação e tamsulosina (relaxa o ureter). Pedras maiores: indicar procedimento endoscópico.',
  },
  {
    etapa: 'Investigação Pós-crise',
    desc: 'Após a crise, investigação metabólica completa para identificar a causa e prevenir a próxima pedra.',
  },
]

const faq = [
  {
    q: 'A cólica renal realmente dói tanto quanto dizem?',
    a: 'Sim. A cólica renal é consistentemente classificada em estudos médicos como uma das dores mais intensas que um ser humano pode experimentar, comparável às contrações do trabalho de parto e à dor pós-cirúrgica sem analgesia. A intensidade se deve ao espasmo do músculo liso do ureter, que não responde ao repouso nem à mudança de posição. Não existe uma posição confortável durante a cólica renal.',
  },
  {
    q: 'Dor nas costas é sempre pedra nos rins?',
    a: 'Não. A maioria das dores lombares tem causa musculoesquelética (tensão muscular, hérnias, artrose). A cólica renal tem características específicas: localização no flanco (lateral, entre a costela e o quadril), irradiação para a virilha ou genitais, caráter em ondas, sem posição de alívio, frequentemente acompanhada de náusea. Dor lombar simples costuma melhorar com repouso.',
  },
  {
    q: 'Qual médico devo consultar por dor nos rins?',
    a: 'Em caso de suspeita de cólica renal, o urologista é o especialista mais indicado. Em situações de emergência (febre alta + dor lombar), o pronto-socorro é a primeira opção para estabilização e exames. Após a fase aguda, o urologista conduz a investigação completa e define o tratamento.',
  },
  {
    q: 'Quanto tempo dura uma crise de cólica renal?',
    a: 'Uma crise de cólica renal pode durar de minutos a horas. A dor tende a vir em ondas de intensidade crescente. Sem tratamento, pode persistir por dias enquanto a pedra tenta migrar. Com analgesia adequada, a dor é controlada. Se a pedra não avançar, pode ser necessária intervenção cirúrgica para resolver definitivamente.',
  },
  {
    q: 'Posso ficar com a pedra no rim sem operar?',
    a: 'Depende do caso. Pedras renais assintomáticas e pequenas podem ser acompanhadas clinicamente com exames periódicos. O risco é que a pedra migre para o ureter e cause obstrução aguda. Pedras grandes no rim, cálculos coraliformes ou pedras que causam infecções de repetição precisam de tratamento ativo mesmo sem sintomas agudos.',
  },
  {
    q: 'Qual a diferença entre dor no rim e dor na bexiga?',
    a: 'A dor renal (cólica ou pielonefrite) se manifesta no flanco: lateral do abdômen, abaixo da costela. Pode irradiar para a virilha conforme a pedra desce pelo ureter. A dor vesical costuma ser suprapúbica (baixo abdômen central), associada a urgência urinária, ardência ao urinar e necessidade frequente de ir ao banheiro.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Cálculo Renal', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal' },
    { '@type': 'ListItem', position: 3, name: 'Dor nos Rins', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal/dor-nos-rins' },
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

export default function DorNosRins() {
  return (
    <>
      <MedicalWebPageSchema
        name="Dor nos Rins em Fortaleza: Cólica Renal e Quando Procurar Urologista"
        description="Dor nos rins em Fortaleza: entenda as causas, a diferença entre cólica renal e dor muscular, os sinais de emergência e quando consultar Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal/dor-nos-rins"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Cólica Renal · Diagnóstico · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                A cólica renal é uma das dores mais intensas da medicina.{' '}
                <span className="text-brand-gold">Entenda o que causa, o que fazer e quando é emergência.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                A dor nos rins pode ter origens muito diferentes: cálculo renal, infecção, causa muscular ou até problemas de outra localização. Identificar a causa correta é fundamental para o tratamento certo, no tempo certo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
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
              src="/demos/dr-erico/img/dr-erico-foto-7.webp"
              alt="Dor nos rins, cólica renal Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — DIFERENCIAL DE CAUSAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Identifique o seu caso</p>
            <h2 className="section-title mt-2">QUAL TIPO DE DOR NOS RINS VOCÊ TEM?</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O perfil da dor, os sintomas associados e a presença de febre são os elementos que distinguem uma cólica renal de uma emergência ou de uma causa benigna. Reconhecer esses sinais pode salvar a função do seu rim.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {causas.map((c, i) => (
              <div key={c.causa} className={`rounded-2xl p-6 ${c.cor}`} data-aos="fade-up" data-aos-delay={i * 80}>
                <h3 className="font-display text-lg text-brand-navy">{c.causa}</h3>
                <p className="text-sm text-brand-muted mt-2">{c.perfil}</p>
                <p className="text-xs font-semibold text-brand-navy mt-3 uppercase tracking-wide">{c.urgencia}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — EMERGÊNCIA + MITOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-start">
          <div data-aos="fade-right">
            <div className="inline-block bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-4">Sinais de Emergência</div>
            <h2 className="section-title">VÁ AO PRONTO-SOCORRO SE VOCÊ TIVER:</h2>
            <p className="text-brand-muted mt-4 mb-6">
              Esses sinais indicam que a dor nos rins pode ser causada por infecção com obstrução, uma das emergências urológicas mais graves. O tratamento nas primeiras horas é decisivo.
            </p>
            <ul className="space-y-3">
              {sinaisEmergencia.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card" data-aos="fade-up" data-aos-delay={i * 40}>
                  <span className="text-red-500 font-bold text-lg leading-none mt-0.5">!</span>
                  <span className="text-sm text-brand-navy font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-left">
            <div className="inline-block bg-brand-gold text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-4">O que NÃO fazer</div>
            <h2 className="section-title">MITOS QUE ATRAPALHAM O TRATAMENTO</h2>
            <p className="text-brand-muted mt-4 mb-6">
              Na internet circulam muitos remédios caseiros para pedra nos rins. Além de não funcionar, alguns podem atrasar o diagnóstico e o tratamento adequado.
            </p>
            <div className="space-y-4">
              {naoCriseDoQue.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                  <p className="text-sm font-medium text-red-500 line-through decoration-red-400">{item.mito}</p>
                  <p className="text-xs text-brand-muted mt-2">{item.realidade}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação especializada em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A cólica renal é uma urgência que exige avaliação rápida e tratamento correto desde o início. O diagnóstico de imagem define o tamanho e a localização exata da pedra, o grau de obstrução e a necessidade de intervenção imediata ou programada.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes conduz a avaliação completa do cálculo renal: da fase aguda ao plano de prevenção de recorrência. Com formação pela Universidade Federal do Ceará e experiência em endourologia, ele oferece desde o manejo conservador de cálculos pequenos até a ureteroscopia com laser holmium e a nefrolitotripsia percutânea para casos mais complexos.
              </p>
              <p>
                A cólica que passou não significa que o problema acabou. A investigação pós-crise é o que impede a próxima.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {oQueEsperar.map((etapa, i) => (
                <div key={etapa.etapa} className="bg-brand-beige-light rounded-xl p-4 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                  <p className="font-display text-xs text-brand-gold uppercase tracking-wide">Etapa {i + 1}</p>
                  <p className="font-medium text-brand-navy text-sm mt-1">{etapa.etapa}</p>
                  <p className="text-xs text-brand-muted mt-1">{etapa.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Agendar Consulta
              </a>
              <Link href="/condicoes-urologicas/calculo-renal/pedra-nos-rins" className="btn-silver">
                Tipos de Pedra nos Rins
              </Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-2.webp" alt="Dr. Érico Diógenes, dor nos rins Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">DÚVIDAS SOBRE DOR NOS RINS</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Dor nos rins em Fortaleza? Avalie com Dr. Érico Diógenes antes que piore." />
    </>
  )
}
