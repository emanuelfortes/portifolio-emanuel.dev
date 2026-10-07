import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Vasectomia Fortaleza | Procedimento Seguro — Dr. Érico Diógenes' },
  description:
    'Vasectomia em Fortaleza com Dr. Érico Diógenes: técnica sem bisturi, procedimento ambulatorial de 20 minutos, recuperação em 48h. O método contraceptivo mais eficaz disponível para homens.',
  alternates: { canonical: '/saude-masculina/vasectomia' },
  openGraph: {
    title: 'Vasectomia Fortaleza | Dr. Érico Diógenes',
    description: 'Vasectomia sem bisturi em Fortaleza com Dr. Érico Diógenes: 20 minutos, anestesia local, recuperação em 48h. Contracepção definitiva masculina.',
    url: '/saude-masculina/vasectomia',
  },
}

const mitos = [
  {
    mito: 'Vasectomia reduz a libido e a masculinidade',
    fato: 'A vasectomia interrompe apenas o canal que transporta os espermatozoides (deferente). A produção de testosterona pelos testículos não é afetada. A libido, a ereção, a ejaculação e o orgasmo permanecem absolutamente iguais.',
    icon: '🚫',
  },
  {
    mito: 'A vasectomia é a mesma coisa que castração',
    fato: 'Castração é a remoção dos testículos. Vasectomia é a secção do canal deferente, um tubo minúsculo de 0,3 mm. Os testículos permanecem intactos, produzindo testosterona e espermatozoides normalmente. Os espermatozoides são simplesmente reabsorvidos pelo organismo.',
    icon: '🚫',
  },
  {
    mito: 'O sêmen some após a vasectomia',
    fato: 'O sêmen continua sendo ejaculado normalmente. Os espermatozoides representam menos de 5% do volume do ejaculado: o restante são secreções da próstata e das vesículas seminais, não afetadas pela vasectomia. O volume, a aparência e a sensação do ejaculado são praticamente idênticos.',
    icon: '🚫',
  },
  {
    mito: 'Vasectomia é para homens que não querem filhos para sempre',
    fato: 'A vasectomia deve ser considerada definitiva, mas a reversão é possível (vasovasostomia). Taxas de permeabilidade de 85-97% até 3 anos após a vasectomia. A chance de gravidez natural diminui com o tempo decorrido. A decisão deve ser tomada com maturidade, não como solução temporária.',
    icon: '⚠️',
  },
]

const etapas = [
  { num: '01', titulo: 'Consulta de avaliação', desc: 'Discussão de motivações, saúde reprodutiva, confirmação de que a decisão é voluntária e firme. Exame físico escrotal. Orientações pré-procedimento.' },
  { num: '02', titulo: 'Dia do procedimento', desc: 'Anestesia local na bolsa escrotal. Acesso ao deferente por pequena perfuração (técnica sem bisturi). Secção e oclusão dos deferentes bilateralmente. Duração total: 20-30 minutos.' },
  { num: '03', titulo: 'Recuperação imediata', desc: '48 horas de repouso relativo com suporte escrotal (cueca justa). Retorno ao trabalho de escritório em 2-3 dias. Atividade física moderada após 1 semana. Relações sexuais após 1 semana.' },
  { num: '04', titulo: 'Confirmação de eficácia', desc: 'Espermograma de controle após 3 meses ou 20 ejaculações. A vasectomia só é considerada eficaz após a confirmação de azoospermia. Contracepção adicional deve ser mantida até esse ponto.' },
]

const vantagens = [
  'Eficácia superior a 99,9%: o método contraceptivo mais eficaz disponível',
  'Procedimento ambulatorial: sem internação, sem anestesia geral',
  'Duração de 20-30 minutos em consultório ou clínica',
  'Anestesia local: o paciente fica acordado e vai embora logo após',
  'Recuperação em 48 horas para atividades do dia a dia',
  'Custo único: sem despesa mensal com anticoncepcionais',
  'Não altera hormônios, ereção, ejaculação ou prazer sexual',
  'Mais simples e com menos riscos que a laqueadura feminina',
]

const faq = [
  {
    q: 'A vasectomia dói?',
    a: 'O procedimento é realizado com anestesia local. O paciente sente a injeção anestésica inicial (semelhante a um beliscão), mas o procedimento em si é indolor. Após o efeito da anestesia ceder, pode haver desconforto leve a moderado por 2-3 dias, controlado com analgésicos simples como paracetamol ou ibuprofeno.',
  },
  {
    q: 'Qual é a eficácia da vasectomia?',
    a: 'A vasectomia tem eficácia superior a 99,9%, tornando-a o método contraceptivo mais eficaz disponível. A falha é extremamente rara e geralmente ocorre por recanalização espontânea do deferente, identificável no espermograma de controle. Por isso, o espermograma após 3 meses é obrigatório para confirmar a azoospermia.',
  },
  {
    q: 'O que é a técnica sem bisturi?',
    a: 'A vasectomia sem bisturi (No-Scalpel Vasectomy) acessa o deferente por uma pequena perfuração de 2-3 mm na bolsa escrotal, sem corte cirúrgico convencional. Reduz o sangramento, o risco de hematoma, a dor pós-operatória e o tempo de recuperação em comparação com a técnica convencional com bisturi. É a técnica padrão atual em centros especializados.',
  },
  {
    q: 'Posso reverter a vasectomia se mudar de ideia?',
    a: 'A reversão (vasovasostomia) é possível e tem alta taxa de sucesso quando realizada até 3 anos após a vasectomia (permeabilidade de 85-97%). Após 9-14 anos, a taxa cai para 53-71%. A chance de gravidez natural também diminui com o tempo. A vasectomia deve ser considerada definitiva na decisão, mas saber que a reversão existe pode ser útil. Para vasectomias antigas, FIV-ICSI com PESA pode ser mais eficaz.',
  },
  {
    q: 'Preciso de consentimento da esposa para fazer vasectomia?',
    a: 'No Brasil, a lei 9.263/1996 (Lei de Planejamento Familiar) exige que o homem tenha 25 anos ou 2 filhos vivos, além de manifesto de consentimento assinado com 60 dias de intervalo para "garantir a reflexão". O consentimento da cônjuge não é exigido legalmente, embora o diálogo no casal seja recomendado. A lei foi contestada por restringir a autonomia reprodutiva do indivíduo, e há discussões jurídicas em andamento.',
  },
  {
    q: 'Quanto tempo após a vasectomia posso parar de usar preservativo?',
    a: 'Apenas após a confirmação de azoospermia no espermograma de controle, realizado 3 meses após o procedimento (ou 20 ejaculações). Até esse resultado confirmatório, o uso de outro método contraceptivo é obrigatório, pois espermatozoides residuais no trato podem ainda causar gravidez. Isso é um ponto crítico frequentemente negligenciado.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Saúde Masculina', item: 'https://drericodiogenes.com.br/saude-masculina' },
    { '@type': 'ListItem', position: 3, name: 'Vasectomia', item: 'https://drericodiogenes.com.br/saude-masculina/vasectomia' },
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

export default function Vasectomia() {
  return (
    <>
      <MedicalWebPageSchema
        name="Vasectomia em Fortaleza: Procedimento Seguro e Definitivo"
        description="Vasectomia sem bisturi em Fortaleza com Dr. Érico Diógenes. Procedimento ambulatorial de 20 minutos com recuperação em 48 horas."
        url="https://drericodiogenes.com.br/saude-masculina/vasectomia"
        specialty="Urology"
      />



      {/* HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Contracepção Masculina Definitiva · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                20 minutos de procedimento.{' '}
                <span className="text-brand-gold">Eficácia de 99,9%. Para sempre.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                No Brasil, apenas 5% dos homens usam vasectomia. Nos EUA, são 25%. A diferença não é médica: é informação. A vasectomia é mais simples, mais barata e mais eficaz do que qualquer método feminino. E não afeta em nada a vida sexual.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Consultar sobre Vasectomia em Fortaleza
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/dr-erico/img/dr-erico-foto-2.webp" alt="Vasectomia Fortaleza, Dr. Érico Diógenes" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* MITOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Informação que liberta da hesitação</p>
            <h2 className="section-title mt-2">O QUE A VASECTOMIA NÃO FAZ</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Os mitos em torno da vasectomia são a principal barreira para que homens escolham o método mais eficaz disponível. Vamos desfazê-los com precisão clínica.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {mitos.map((m, i) => (
              <div key={m.mito} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{m.icon}</span>
                  <p className="text-sm font-semibold text-red-500 line-through decoration-red-400">{m.mito}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <p className="text-sm text-brand-muted">{m.fato}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ETAPAS + VANTAGENS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <p className="eyebrow">Do primeiro contato ao resultado</p>
            <h2 className="section-title mt-2">COMO FUNCIONA O PROCEDIMENTO</h2>
            <div className="mt-6 space-y-4">
              {etapas.map((e, i) => (
                <div key={e.num} className="flex gap-4 bg-white rounded-2xl p-5 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                  <span className="font-display text-3xl text-brand-gold shrink-0 leading-none">{e.num}</span>
                  <div>
                    <h3 className="font-display text-sm text-brand-navy">{e.titulo}</h3>
                    <p className="text-xs text-brand-muted mt-1">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Por que escolher a vasectomia</p>
            <h2 className="section-title mt-2">VANTAGENS DO MÉTODO</h2>
            <ul className="mt-6 space-y-3">
              {vantagens.map((v, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 40}>
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, vasectomia Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Urologia e andrologia em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A consulta de vasectomia com o Dr. Érico Diógenes começa por uma avaliação clínica detalhada e uma conversa franca sobre motivações, expectativas e o caráter definitivo do procedimento. Nenhum julgamento: o objetivo é garantir que a decisão seja informada, voluntária e madura.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico realiza a vasectomia pela técnica sem bisturi (No-Scalpel Vasectomy) sob anestesia local, em procedimento ambulatorial. O paciente vai embora andando no mesmo dia, com orientações claras sobre o período de recuperação e a necessidade do espermograma de confirmação após 3 meses.
              </p>
              <p>
                Homens que desejam discutir a reversão de uma vasectomia anterior também são atendidos, com avaliação do tempo decorrido e da melhor estratégia para alcançar a gravidez.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar Consulta</a>
              <Link href="/saude-masculina/infertilidade" className="btn-silver">Infertilidade Masculina</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE VASECTOMIA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Vasectomia segura e definitiva em Fortaleza com Dr. Érico Diógenes." />
    </>
  )
}
