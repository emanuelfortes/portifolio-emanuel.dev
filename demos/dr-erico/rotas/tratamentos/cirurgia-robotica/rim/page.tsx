import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cirurgia Robótica do Rim Fortaleza | Nefrectomia Da Vinci, Dr. Érico Diógenes' },
  description:
    'Cirurgia robótica do rim em Fortaleza: nefrectomia parcial e radical com sistema Da Vinci. Preservação da função renal, menor sangramento e recuperação rápida. Dr. Érico Diógenes.',
  alternates: { canonical: '/tratamentos/cirurgia-robotica/rim' },
  openGraph: {
    title: 'Cirurgia Robótica do Rim Fortaleza | Dr. Érico Diógenes',
    description: 'Nefrectomia robótica em Fortaleza: preservação máxima da função renal com o sistema Da Vinci. Dr. Érico Diógenes, especialista.',
    url: '/tratamentos/cirurgia-robotica/rim',
  },
}

const procedimentos = [
  {
    nome: 'Nefrectomia Parcial Robótica',
    desc: 'Remoção apenas da área tumoral, preservando a maior quantidade possível de tecido renal saudável. É o padrão ouro para tumores renais menores que 7 cm (T1) e para pacientes com rim único, função renal comprometida ou fatores de risco para insuficiência renal futura.',
    destaque: 'Preserva a função renal, evita ou retarda a necessidade de diálise',
    img: '/demos/dr-erico/img/post/imgid04_02.webp',
  },
  {
    nome: 'Nefrectomia Radical Robótica',
    desc: 'Remoção completa do rim, adrenal e gordura perinéfrica, com ou sem linfadenectomia. Indicada para tumores grandes (> 7 cm), tumores com invasão vascular ou quando a nefrectomia parcial não é tecnicamente viável.',
    destaque: 'Indicada para tumores localmente avançados',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
  },
  {
    nome: 'Nefrectomia com Trombectomia de Veia Cava',
    desc: 'Procedimento de alta complexidade para tumores renais que formam trombo na veia renal ou na veia cava inferior. A abordagem robótica permite precisão excepcional em estruturas vasculares críticas.',
    destaque: 'Procedimento de alta complexidade técnica',
    img: '/demos/dr-erico/img/post/imgid08_01.webp',
  },
]

const principios = [
  {
    titulo: 'Isquemia Mínima',
    desc: 'O tempo de isquemia quente, período em que o rim fica sem sangue durante a nefrectomia parcial, é determinante para preservação da função renal. A robótica permite dissecção mais rápida e precisa, reduzindo esse tempo crítico.',
  },
  {
    titulo: 'Margens Negativas',
    desc: 'A ressecção com margens cirúrgicas livres de tumor é o principal objetivo oncológico. A visão tridimensional ampliada do Da Vinci permite identificar os limites do tumor com precisão que a olho nu seria impossível.',
  },
  {
    titulo: 'Preservação do Néfron',
    desc: 'Cada unidade funcional do rim preservada contribui para a função renal de longo prazo. A nefrectomia parcial robótica permite remover apenas o tumor, deixando o máximo possível de tecido saudável intacto.',
  },
  {
    titulo: 'Hemostasia Eficaz',
    desc: 'O controle do sangramento durante a sutura renal é tecnicamente desafiador. Os instrumentos articulados do Da Vinci permitem suturas precisas em ângulos impossíveis para instrumentos rígidos laparoscópicos.',
  },
]

const faq = [
  {
    q: 'Quais são os sintomas do câncer de rim?',
    a: 'O câncer renal é frequentemente assintomático nos estágios iniciais, a maioria dos casos é descoberta incidentalmente em exames de imagem (ultrassom ou tomografia) feitos por outros motivos. Quando sintomático, pode causar sangue na urina, dor no flanco ou massa palpável no abdômen. Esses sintomas tendem a aparecer em tumores mais avançados.',
  },
  {
    q: 'É possível viver com um rim só?',
    a: 'Sim. Com um único rim saudável, é possível ter uma vida completamente normal. O rim restante assume a função do rim removido. No entanto, pacientes com rim único têm maior risco de insuficiência renal futura, por isso a nefrectomia parcial (que preserva parte do rim) é preferida sempre que tecnicamente possível.',
  },
  {
    q: 'O que é o tríplice objetivo na cirurgia do rim (trifecta renal)?',
    a: 'Na nefrectomia parcial, o trifecta renal consiste em: 1) margens cirúrgicas negativas, 2) ausência de complicações maiores e 3) tempo de isquemia inferior a 25 minutos. A robótica aumenta substancialmente a chance de atingir os três objetivos simultaneamente.',
  },
  {
    q: 'Todo tumor renal precisa de cirurgia?',
    a: 'Não necessariamente. Tumores muito pequenos (< 2 cm) em pacientes idosos ou com comorbidades podem ser acompanhados com vigilância ativa. A ablação por radiofrequência ou crioablação é alternativa para casos selecionados. O Dr. Érico avalia cada caso individualmente para definir a melhor conduta.',
  },
  {
    q: 'Qual o tempo de recuperação após a cirurgia robótica do rim?',
    a: 'Após nefrectomia parcial robótica, a maioria dos pacientes recebe alta em 2 a 3 dias e retorna às atividades leves em 2 a 3 semanas. A nefrectomia radical tem recuperação semelhante. Ambas são significativamente mais rápidas do que as equivalentes abertas, que exigem de 4 a 6 semanas de recuperação.',
  },
  {
    q: 'É necessário fazer diálise após a remoção de um rim?',
    a: 'Geralmente não, desde que o rim restante esteja saudável. A diálise é necessária apenas em casos de insuficiência renal grave, por isso a nefrectomia parcial, que preserva parte do rim doente, é preferida para pacientes com fatores de risco como hipertensão, diabetes ou função renal já comprometida.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Cirurgia Robótica', item: 'https://drericodiogenes.com.br/cirurgia-robotica' },
    { '@type': 'ListItem', position: 3, name: 'Cirurgia Robótica do Rim', item: 'https://drericodiogenes.com.br/tratamentos/cirurgia-robotica/rim' },
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

export default function CirurgiaRoboticaRim() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cirurgia Robótica do Rim em Fortaleza, Nefrectomia Da Vinci"
        description="Nefrectomia parcial e radical robótica em Fortaleza com Dr. Érico Diógenes. Preservação máxima da função renal com sistema Da Vinci."
        url="https://drericodiogenes.com.br/tratamentos/cirurgia-robotica/rim"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Nefrectomia Robótica · Sistema Da Vinci · Fortaleza</p>
              <h1 className="section-title mt-2">
                Cirurgia Robótica do Rim:{' '}
                <span className="text-brand-gold">remover o tumor preservando o máximo da função renal.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                O câncer renal é o terceiro tumor urológico mais comum. Com diagnóstico cada vez mais frequente em estágios iniciais, graças à disseminação do ultrassom e da tomografia, a cirurgia minimamente invasiva com robótica tornou-se o padrão de tratamento, unindo precisão oncológica à preservação da função do rim.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Agendar Avaliação
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-5b.webp"
              alt="Cirurgia robótica do rim em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, PROCEDIMENTOS */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Tipos de cirurgia</p>
            <h2 className="section-title mt-2">PROCEDIMENTOS ROBÓTICOS PARA O RIM</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              A cirurgia robótica do rim não é um procedimento único, mas um conjunto de técnicas indicadas conforme o tamanho, localização e extensão do tumor. A escolha correta entre elas é fundamental para garantir o melhor resultado oncológico com a menor perda de função renal.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {procedimentos.map((p, i) => (
              <div key={p.nome} className="bg-brand-beige-light rounded-2xl overflow-hidden shadow-card" data-aos="fade-up" data-aos-delay={i * 100}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.nome} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-navy">{p.nome}</h3>
                  <p className="text-sm text-brand-muted mt-2">{p.desc}</p>
                  <p className="text-xs text-brand-gold font-medium mt-3">{p.destaque}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, PRINCÍPIOS TÉCNICOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">O que faz a diferença</p>
            <h2 className="section-title mt-2">OS 4 PRINCÍPIOS DA CIRURGIA RENAL ROBÓTICA</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Na cirurgia do rim, os resultados dependem de quatro variáveis técnicas que apenas a robótica permite controlar com o nível de precisão necessário. Entender esses princípios ajuda o paciente a compreender por que a escolha da técnica, e do cirurgião, faz tanta diferença.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {principios.map((p, i) => (
              <div key={p.titulo} className="bg-white rounded-2xl p-6 shadow-card" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-start gap-3">
                  <Check size={20} className="mt-0.5 shrink-0 text-brand-green" />
                  <div>
                    <h3 className="font-display text-lg text-brand-navy">{p.titulo}</h3>
                    <p className="text-sm text-brand-muted mt-2">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Cirurgia renal avançada em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A nefrectomia parcial robótica é tecnicamente uma das cirurgias mais complexas da urologia. O desafio está em remover o tumor com margens negativas, reconstruir o rim com sutura precisa e fazê-lo no menor tempo possível de isquemia, três objetivos que precisam ser alcançados simultaneamente.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes realiza nefrectomias parciais e radicais robóticas com o sistema Da Vinci, aplicando técnicas de isquemia mínima e preservação do néfron para garantir os melhores resultados funcionais. Com formação pela Universidade Federal do Ceará e especialização em cirurgia minimamente invasiva e uro-oncologia, ele avalia cada caso individualmente, considerando tamanho e localização do tumor, função renal basal e condições clínicas do paciente.
              </p>
              <p>
                Cada rim preservado é uma vitória: para a saúde renal de longo prazo e para a qualidade de vida do paciente.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/condicoes-urologicas/uro-oncologia/cancer-rim" className="btn-primary">Sobre o Câncer de Rim</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-6.webp" alt="Dr. Érico Diógenes, cirurgia robótica rim Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Tumor renal? Agende avaliação com Dr. Érico Diógenes em Fortaleza" />
    </>
  )
}
