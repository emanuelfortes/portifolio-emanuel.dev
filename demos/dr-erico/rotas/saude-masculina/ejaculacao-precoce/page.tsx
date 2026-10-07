import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Ejaculação Precoce Fortaleza | Tratamento — Dr. Érico Diógenes' },
  description:
    'Ejaculação precoce em Fortaleza: diagnóstico, causas neurobiológicas e tratamento comportamental e farmacológico com Dr. Érico Diógenes. A disfunção sexual masculina mais comum.',
  alternates: { canonical: '/saude-masculina/ejaculacao-precoce' },
  openGraph: {
    title: 'Ejaculação Precoce Fortaleza | Dr. Érico Diógenes',
    description: 'Tratamento da ejaculação precoce em Fortaleza: abordagem comportamental, farmacológica e combinada com Dr. Érico Diógenes.',
    url: '/saude-masculina/ejaculacao-precoce',
  },
}

const tipos = [
  {
    tipo: 'Ejaculação Precoce Primária (Lifelong)',
    desc: 'Presente desde o início da vida sexual. Base predominantemente neurobiológica: hipersensibilidade dos receptores serotonérgicos no sistema nervoso central encurta o reflexo ejaculatório. Não é causada por inexperiência ou ansiedade isolada. Responde bem a tratamento farmacológico.',
    badge: 'Desde a primeira relação sexual',
    cor: 'border-brand-navy',
  },
  {
    tipo: 'Ejaculação Precoce Adquirida (Secundária)',
    desc: 'Desenvolvida após um período de função sexual normal. Causas incluem: prostatite crônica, hipertireoidismo, disfunção erétil (o homem ejacula rapidamente antes de perder a ereção), estresse agudo e relacionamentos com alta carga de ansiedade.',
    badge: 'Surgiu após período de função normal',
    cor: 'border-brand-gold',
  },
]

const tratamentos = [
  {
    titulo: 'Técnicas Comportamentais',
    subtitulo: 'Start-stop e squeeze',
    desc: 'A técnica start-stop (Semans) treina o controle do limiar ejaculatório por interrupção repetida da estimulação antes do ponto de inevitabilidade. A técnica squeeze (Masters & Johnson) adiciona compressão da glande no momento crítico. Eficazes em 60-70% dos casos de EP primária quando praticadas com regularidade.',
    itens: ['Nenhum efeito adverso', 'Praticáveis em parceria ou individualmente', 'Resultados sustentados a longo prazo', 'Frequentemente combinadas ao tratamento farmacológico'],
    bg: 'bg-brand-beige-light',
  },
  {
    titulo: 'Tratamento Farmacológico',
    subtitulo: 'Dapoxetina e SSRIs',
    desc: 'Inibidores seletivos da recaptação de serotonina (SSRIs) aumentam os níveis de serotonina central e retardam o reflexo ejaculatório. A dapoxetina é o único SSRI de ação ultrarrápida (pico em 1h, eliminada em 24h) aprovado especificamente para EP por demanda. Outros SSRIs são usados off-label em dose diária.',
    itens: ['Dapoxetina: tomada 1-3h antes da relação', 'SSRIs diários: paroxetina, sertralina, escitalopram', 'Aumento médio do IELT de 3 a 8 vezes', 'Podem ser combinados às técnicas comportamentais'],
    bg: 'bg-white',
  },
  {
    titulo: 'Anestésico Tópico',
    subtitulo: 'Spray ou creme de lidocaína',
    desc: 'Reduz a hipersensibilidade local da glande sem interferir na ereção ou na sensação geral. A formulação em spray (lidocaína/prilocaína) é aplicada 10-15 minutos antes da relação e removida para evitar dormência na parceira. Opção eficaz especialmente nos casos de EP com componente de hipersensibilidade peniana.',
    itens: ['Aplicação local, sem efeito sistêmico', 'Não interfere com ereção', 'Camisinha recomendada se não remover antes', 'Pode ser usado em associação com outros tratamentos'],
    bg: 'bg-brand-beige-light',
  },
]

const faq = [
  {
    q: 'O que é ejaculação precoce exatamente?',
    a: 'A definição clínica envolve três critérios: ejaculação ocorrendo dentro de 1-2 minutos após a penetração (IELT < 2 min), incapacidade de retardar a ejaculação na maioria das relações, e presença de sofrimento significativo para o homem ou o casal. Não existe um tempo "correto" universal: o que importa é a satisfação e o controle.',
  },
  {
    q: 'Ejaculação precoce tem cura?',
    a: 'Depende do tipo. A EP primária com base neurobiológica geralmente é controlada (não curada no sentido estrito), com tratamento mantendo o IELT em níveis satisfatórios indefinidamente. A EP adquirida por causa identificável (prostatite, hipertireoidismo, ansiedade situacional) tem alta taxa de resolução após tratamento da causa de base.',
  },
  {
    q: 'Qual é o tempo médio de duração de uma relação sexual?',
    a: 'Estudos com cronometragem objetiva (IELT) em múltiplos países mostram mediana de 5-6 minutos de penetração. Mas há enorme variação individual e cultural: de menos de 1 minuto até 30 minutos são registrados em homens sem queixa. O problema não é o tempo em si, mas a incapacidade de controle associada a sofrimento.',
  },
  {
    q: 'A dapoxetina (Priligy) é segura?',
    a: 'Sim, com as devidas precauções. A dapoxetina é contraindicada para uso com MAOIs, tem interação com outros SSRIs e deve ser usada com cautela em pacientes com hipotensão. Os efeitos adversos mais comuns são náusea, tontura e cefaleia. Por ser de ação ultrarrápida, não acumula no organismo como os SSRIs diários, o que reduz os efeitos colaterais.',
  },
  {
    q: 'Ejaculação precoce é problema psicológico?',
    a: 'Parcialmente. Na EP primária, a base é predominantemente neurobiológica: variações no gene do transportador de serotonina (SLC6A4) e hiposensibilidade de receptores 5-HT1A/2C têm sido implicadas. O componente psicológico (ansiedade, vergonha, evitação) é real mas secundário. Na EP adquirida, fatores psicológicos têm peso maior, especialmente ansiedade de desempenho.',
  },
  {
    q: 'Posso tratar ejaculação precoce sozinho, sem médico?',
    a: 'As técnicas comportamentais podem ser praticadas de forma autônoma, mas a avaliação médica é importante para dois pontos: (1) excluir causas tratáveis como prostatite ou hipertireoidismo e (2) definir se o quadro se beneficia de tratamento farmacológico. Produtos vendidos livremente (cremes anestésicos sem prescrição) têm eficácia variável e podem causar dormência na parceira.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Saúde Masculina', item: 'https://drericodiogenes.com.br/saude-masculina' },
    { '@type': 'ListItem', position: 3, name: 'Ejaculação Precoce', item: 'https://drericodiogenes.com.br/saude-masculina/ejaculacao-precoce' },
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

export default function EjaculacaoPrecoce() {
  return (
    <>
      <MedicalWebPageSchema
        name="Ejaculação Precoce em Fortaleza: Diagnóstico e Tratamento"
        description="Tratamento da ejaculação precoce em Fortaleza: abordagem comportamental, farmacológica e combinada. Dr. Érico Diógenes, andrologia especializada no Ceará."
        url="https://drericodiogenes.com.br/saude-masculina/ejaculacao-precoce"
        specialty="Urology"
      />



      {/* HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="relative overflow-hidden min-h-[320px]" data-aos="fade-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/dr-erico/img/dr-erico-foto-6.webp" alt="Ejaculação precoce tratamento Fortaleza" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-left">
            <div>
              <p className="eyebrow">A disfunção sexual masculina mais comum · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-navy leading-tight mt-2">
                20 a 30% dos homens têm ejaculação precoce.{' '}
                <span className="text-brand-gold">Quase nenhum procura tratamento.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A ejaculação precoce não é fraqueza, inexperiência nem ansiedade inventada. Em muitos casos, tem base neurobiológica documentada. Tem tratamento eficaz que pode triplicar ou quadruplicar o tempo e transformar completamente a qualidade da vida sexual.
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

      {/* TIPOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Diagnóstico preciso antes do tratamento</p>
            <h2 className="section-title mt-2">DOIS TIPOS, ABORDAGENS DIFERENTES</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A distinção entre EP primária e adquirida não é apenas acadêmica: ela define a estratégia terapêutica. Tratar EP adquirida por prostatite com técnicas comportamentais isoladas, por exemplo, é ineficaz e frustrante para o paciente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tipos.map((t, i) => (
              <div key={t.tipo} className={`bg-brand-beige-light rounded-2xl p-7 border-t-4 ${t.cor}`} data-aos="fade-up" data-aos-delay={i * 100}>
                <span className="text-xs font-semibold bg-white rounded-full px-3 py-1 text-brand-navy inline-block mb-4">{t.badge}</span>
                <h3 className="font-display text-lg text-brand-navy mb-3">{t.tipo}</h3>
                <p className="text-sm text-brand-muted">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRATAMENTOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Abordagem baseada em evidências</p>
            <h2 className="section-title mt-2">OPÇÕES DE TRATAMENTO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              O tratamento ideal combina abordagens: nenhuma modalidade isolada tem eficácia máxima. A escolha depende do tipo, da gravidade e das preferências do paciente.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tratamentos.map((t, i) => (
              <div key={t.titulo} className={`rounded-2xl p-7 ${t.bg} shadow-card`} data-aos="fade-up" data-aos-delay={i * 80}>
                <h3 className="font-display text-lg text-brand-navy">{t.titulo}</h3>
                <p className="text-xs font-semibold text-brand-gold mt-1 mb-3">{t.subtitulo}</p>
                <p className="text-sm text-brand-muted mb-4">{t.desc}</p>
                <ul className="space-y-2">
                  {t.itens.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-brand-muted">
                      <Check size={13} className="mt-0.5 shrink-0 text-brand-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-2.webp" alt="Dr. Érico Diógenes, ejaculação precoce Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Andrologia em Fortaleza, CE</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A abordagem da ejaculação precoce no consultório do Dr. Érico Diógenes começa por uma anamnese sexual detalhada: duração do problema, contextos em que ocorre, presença ou ausência de disfunção erétil associada, histórico de prostatite, uso de medicamentos e nível de sofrimento do casal.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico conduz o tratamento andrológico da ejaculação precoce com abordagem baseada em evidências, desde a prescrição de dapoxetina ou SSRIs até a orientação estruturada de técnicas comportamentais. Quando há disfunção erétil concomitante, ambas as condições são tratadas de forma integrada, pois a interação entre elas é frequente e relevante clinicamente.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar Consulta</a>
              <Link href="/saude-masculina/disfuncao-eretil" className="btn-silver">Disfunção Erétil</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE EJACULAÇÃO PRECOCE</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Ejaculação precoce tem tratamento eficaz. Consulte Dr. Érico em Fortaleza." />
    </>
  )
}
