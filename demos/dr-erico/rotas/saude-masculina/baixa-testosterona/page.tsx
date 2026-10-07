import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Baixa Testosterona Fortaleza | Hipogonadismo — Dr. Érico Diógenes' },
  description:
    'Diagnóstico e tratamento da baixa testosterona (hipogonadismo) em Fortaleza com Dr. Érico Diógenes. Fadiga, libido baixa, ganho de peso: saiba quando investigar seus níveis hormonais.',
  alternates: { canonical: '/saude-masculina/baixa-testosterona' },
  openGraph: {
    title: 'Baixa Testosterona Fortaleza | Dr. Érico Diógenes',
    description: 'Hipogonadismo masculino em Fortaleza: diagnóstico hormonal completo e terapia de reposição de testosterona com Dr. Érico Diógenes.',
    url: '/saude-masculina/baixa-testosterona',
  },
}

const sintomas = [
  { grupo: 'Energia e disposição', itens: ['Fadiga persistente mesmo com sono adequado', 'Redução da resistência física e mental', 'Sensação de lentidão e falta de iniciativa'] },
  { grupo: 'Saúde sexual', itens: ['Queda da libido (desejo sexual)', 'Dificuldade de ereção ou ereções menos firmes', 'Redução do volume ejaculado'] },
  { grupo: 'Composição corporal', itens: ['Ganho de gordura abdominal', 'Perda de massa muscular mesmo com atividade física', 'Ginecomastia (acúmulo de gordura nas mamas)'] },
  { grupo: 'Humor e cognição', itens: ['Depressão, irritabilidade, ansiedade', 'Dificuldade de concentração e memória', 'Perda de motivação e senso de bem-estar'] },
]

const formasTRT = [
  {
    nome: 'Injeção Intramuscular',
    detalhe: 'Undecanoato (Nebido) ou cipionato/enantato de testosterona',
    freq: 'A cada 10-14 semanas (Nebido) ou 2-3 semanas',
    vant: 'Adesão simples, menor custo, níveis estáveis com Nebido',
    img: '/demos/dr-erico/img/post/imgid04_02.webp',
  },
  {
    nome: 'Gel Transdérmico',
    detalhe: 'Aplicado nos ombros, braços ou abdômen diariamente',
    freq: 'Aplicação diária',
    vant: 'Níveis mais estáveis, sem pico pós-injeção, reversível a qualquer momento',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
  },
  {
    nome: 'Pastilha Subcutânea (Implante)',
    detalhe: 'Pellet de testosterona implantado sob a pele a cada 3-6 meses',
    freq: 'A cada 3 a 6 meses',
    vant: 'Maior comodidade, níveis estáveis por meses, sem dose diária',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
  },
]

const exames = [
  'Testosterona total matinal (8h-10h): o padrão ouro inicial',
  'Testosterona livre calculada: para casos com SHBG alterada',
  'LH e FSH: diferenciam hipogonadismo primário do secundário',
  'Prolactina: rastrear adenoma hipofisário',
  'Hematócrito e hemoglobina (basal e no acompanhamento)',
  'PSA antes de iniciar TRT (rastreamento de câncer de próstata)',
  'Glicemia, colesterol, triglicerídeos (síndrome metabólica associada)',
]

const faq = [
  {
    q: 'Qual é o valor normal de testosterona?',
    a: 'Os valores de referência variam entre laboratórios, mas geralmente considera-se hipogonadismo quando a testosterona total matinal está abaixo de 300 ng/dL (10,4 nmol/L), com sintomas. A coleta deve ser feita entre 8h e 10h da manhã (pico circadiano) e confirmada em uma segunda dosagem antes de iniciar tratamento.',
  },
  {
    q: 'A testosterona baixa é normal no envelhecimento?',
    a: 'A testosterona declina cerca de 1-2% ao ano após os 30 anos. Isso é fisiológico. Mas quando os níveis caem abaixo do limiar clínico e há sintomas significativos (fadiga, perda de libido, perda muscular, depressão), configura-se o hipogonadismo de início tardio, que é tratável. Envelhecer não significa aceitar sintomas que reduzem a qualidade de vida.',
  },
  {
    q: 'A terapia de reposição de testosterona causa câncer de próstata?',
    a: 'Não há evidência de que a TRT em homens com níveis fisiológicos cause ou acelere câncer de próstata. A hipótese de saturação de receptores andrógenos explica por que acima de certos níveis, o aumento de testosterona não estimula mais o crescimento prostático. Ainda assim, a TRT é contraindicada em homens com câncer de próstata ativo ou não tratado, e o PSA deve ser monitorado periodicamente.',
  },
  {
    q: 'A reposição de testosterona afeta a fertilidade?',
    a: 'Sim, significativamente. A TRT suprime o eixo hipotálamo-hipófise-gonadal, reduzindo ou zerando a produção endógena de espermatozoides. Homens que ainda desejam ter filhos devem discutir alternativas como gonadotrofinas (HCG) ou clomifeno, que estimulam a produção testicular sem a supressão do eixo. É uma conversa fundamental antes de iniciar qualquer TRT.',
  },
  {
    q: 'Existe testosterona em suplementos vendidos em lojas de nutrição?',
    a: 'Não. Produtos rotulados como "boosters de testosterona" vendidos em lojas de suplementos contêm compostos como D-aspartato de zinco, extrato de feno-grego e tribulus terrestris. Os estudos não mostram elevação clinicamente significativa da testosterona com esses compostos. Testosterona é hormônio controlado e só pode ser comercializado com receita médica.',
  },
  {
    q: 'Por quanto tempo preciso fazer reposição de testosterona?',
    a: 'Depende da causa. Hipogonadismo primário (testículo não produz) geralmente requer TRT indefinida. Hipogonadismo secundário por obesidade, sedentarismo ou síndrome metabólica pode se resolver com mudança de estilo de vida. Alguns casos de hipogonadismo tardio permitem redução ou suspensão da TRT após normalização do peso e dos hábitos. O médico avalia periodicamente a necessidade de continuação.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Saúde Masculina', item: 'https://drericodiogenes.com.br/saude-masculina' },
    { '@type': 'ListItem', position: 3, name: 'Baixa Testosterona', item: 'https://drericodiogenes.com.br/saude-masculina/baixa-testosterona' },
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

export default function BaixaTestosterona() {
  return (
    <>
      <MedicalWebPageSchema
        name="Baixa Testosterona e Hipogonadismo em Fortaleza"
        description="Diagnóstico e tratamento de hipogonadismo masculino em Fortaleza. Reposição de testosterona com Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/saude-masculina/baixa-testosterona"
        specialty="Urology"
      />



      {/* HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Hipogonadismo · Andrologia · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Fadiga, libido baixa, ganho de gordura, depressão.{' '}
                <span className="text-brand-gold">Muitos homens atribuem ao estresse. Pode ser testosterona baixa.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                A testosterona cai 1-2% ao ano após os 30 anos. Quando os níveis ficam abaixo do limiar clínico, os sintomas são reais e mensuráveis. O diagnóstico é simples. O tratamento é eficaz. O que falta é a testagem.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Avaliar Testosterona em Fortaleza
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/dr-erico/img/dr-erico-foto-1.webp" alt="Baixa testosterona tratamento Fortaleza" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SINTOMAS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Reconheça os sinais</p>
            <h2 className="section-title mt-2">SINTOMAS DO HIPOGONADISMO MASCULINO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Os sintomas de testosterona baixa são inespecíficos e fáceis de normalizar: "é a idade", "é o trabalho", "é o estresse". Por isso, o diagnóstico frequentemente demora anos. O reconhecimento dos padrões de sintomas é o primeiro passo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {sintomas.map((s, i) => (
              <div key={s.grupo} className="bg-brand-beige-light rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 70}>
                <h3 className="font-display text-base text-brand-navy mb-3">{s.grupo}</h3>
                <ul className="space-y-2">
                  {s.itens.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-brand-muted">
                      <Check size={13} className="mt-0.5 shrink-0 text-brand-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMES + TRT */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site grid lg:grid-cols-2 gap-12">
          <div data-aos="fade-right">
            <p className="eyebrow">Avaliação hormonal completa</p>
            <h2 className="section-title mt-2">EXAMES PARA DIAGNÓSTICO</h2>
            <p className="text-brand-muted mt-4 mb-6">
              Um único exame de testosterona total não é suficiente para o diagnóstico. A avaliação completa do eixo hormonal masculino inclui:
            </p>
            <ul className="space-y-3">
              {exames.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card text-sm" data-aos="fade-up" data-aos-delay={i * 40}>
                  <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Terapia de reposição de testosterona</p>
            <h2 className="section-title mt-2">FORMAS DE TRATAMENTO</h2>
            <div className="mt-6 space-y-5">
              {formasTRT.map((f, i) => (
                <div key={f.nome} className="bg-white rounded-2xl overflow-hidden shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.nome} className="h-24 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="font-display text-base text-brand-navy">{f.nome}</h3>
                    <p className="text-xs text-brand-gold font-medium mt-1">{f.detalhe}</p>
                    <p className="text-xs text-brand-muted mt-2"><span className="font-semibold">Frequência:</span> {f.freq}</p>
                    <p className="text-xs text-brand-muted mt-1"><span className="font-semibold">Vantagem:</span> {f.vant}</p>
                  </div>
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
            <p className="eyebrow">Andrologia hormonal em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O diagnóstico de hipogonadismo não deve ser feito pela dosagem de testosterona total isolada. O Dr. Érico Diógenes conduz a avaliação hormonal completa em Fortaleza, incluindo dosagem matinal seriada, avaliação de LH e FSH (para classificar o tipo de hipogonadismo), prolactina, função tireoidiana e perfil metabólico.
              </p>
              <p>
                A escolha da forma de reposição de testosterona é individualizada de acordo com o perfil do paciente: frequência de consultas, preferência por auto-aplicação, planos de fertilidade futura e custo. O acompanhamento inclui reavaliação periódica de testosterona, hematócrito e PSA para garantir segurança a longo prazo.
              </p>
              <p>
                Homens que desejam ter filhos no futuro recebem orientação específica sobre alternativas à TRT que preservam a espermatogênese.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar Consulta</a>
              <Link href="/saude-masculina/infertilidade" className="btn-silver">Infertilidade Masculina</Link>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-7.webp" alt="Dr. Érico Diógenes, hipogonadismo testosterona Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE BAIXA TESTOSTERONA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Testosterona baixa tem diagnóstico simples e tratamento eficaz. Consulte em Fortaleza." />
    </>
  )
}
