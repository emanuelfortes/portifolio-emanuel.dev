import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cirurgia Robótica de Próstata Fortaleza | Prostatectomia Da Vinci, Dr. Érico Diógenes' },
  description:
    'Prostatectomia radical robótica em Fortaleza com Dr. Érico Diógenes. Sistema Da Vinci, preservação de nervos, continência e potência. O padrão ouro para câncer de próstata no Ceará.',
  alternates: { canonical: '/tratamentos/cirurgia-robotica/prostata' },
  openGraph: {
    title: 'Cirurgia Robótica de Próstata Fortaleza | Dr. Érico Diógenes',
    description: 'Prostatectomia radical robótica em Fortaleza: preservação de nervos, recuperação rápida e os melhores resultados oncológicos.',
    url: '/tratamentos/cirurgia-robotica/prostata',
  },
}

const vantagens = [
  {
    titulo: 'Visão 3D Ampliada em Até 10×',
    desc: 'O sistema Da Vinci oferece visão tridimensional com magnificação de até 10 vezes. O cirurgião enxerga com precisão milimétrica estruturas que seriam invisíveis na cirurgia aberta, nervos, vasos e tecidos críticos.',
  },
  {
    titulo: 'Preservação Nervosa Bilareral',
    desc: 'A técnica nerve-sparing (preservação de nervos) é o principal diferencial da robótica. Os feixes neurovasculares responsáveis pela ereção são identificados e preservados com muito mais precisão do que nas abordagens convencionais.',
  },
  {
    titulo: 'Mínimo Sangramento Intraoperatório',
    desc: 'A hemostasia precisa e o campo cirúrgico limpo reduzem drasticamente a necessidade de transfusão sanguínea, complicação comum na prostatectomia aberta.',
  },
  {
    titulo: 'Alta Hospitalar em 1 a 2 Dias',
    desc: 'As pequenas incisões (0,5 a 1,5 cm) e o menor trauma tecidual permitem recuperação significativamente mais rápida. A maioria dos pacientes recebe alta no segundo dia.',
  },
  {
    titulo: 'Continência Urinária Preservada',
    desc: 'A dissecção robótica precisa do esfíncter externo e do colo vesical maximiza as chances de continência urinária precoce, fator crítico para a qualidade de vida pós-operatória.',
  },
  {
    titulo: 'Retorno Mais Rápido às Atividades',
    desc: 'Pacientes submetidos à prostatectomia robótica retornam às atividades leves em 2 a 3 semanas, comparado a 6 a 8 semanas na cirurgia aberta.',
  },
]

const trifecta = [
  {
    meta: 'Cura Oncológica',
    desc: 'Margens cirúrgicas negativas, sem células tumorais nos bordos da peça operatória, são o principal indicador de sucesso oncológico. A robótica maximiza as chances de margens livres.',
    icone: '🎯',
  },
  {
    meta: 'Continência Urinária',
    desc: 'Definida como o uso de zero ou um absorvente de segurança por dia. A preservação precisa do esfíncter externo e do mecanismo de continência é o grande benefício funcional da abordagem robótica.',
    icone: '💧',
  },
  {
    meta: 'Preservação da Potência',
    desc: 'Em pacientes com boa função erétil pré-operatória e tumor que permite a técnica nerve-sparing bilateral, as taxas de preservação da potência sexual são significativamente maiores com a robótica.',
    icone: '⚡',
  },
]

const faq = [
  {
    q: 'Qual é a diferença entre prostatectomia robótica e laparoscópica?',
    a: 'Na laparoscopia convencional, o cirurgião manipula instrumentos rígidos com movimentos limitados e visão 2D. No sistema Da Vinci, os instrumentos têm 7 graus de liberdade (como o punho humano), a visão é tridimensional e ampliada e os movimentos são filtrados eletronicamente, eliminando tremores. A precisão é substancialmente superior.',
  },
  {
    q: 'O que é a técnica nerve-sparing?',
    a: 'A técnica nerve-sparing (preservação de nervos) consiste em identificar e preservar, durante a prostatectomia, os feixes neurovasculares que correm ao lado da próstata e são responsáveis pela ereção. Pode ser uni ou bilateral, dependendo da localização e extensão do tumor. Só é possível quando o câncer não invadiu essas estruturas.',
  },
  {
    q: 'Quanto tempo dura a cirurgia?',
    a: 'A prostatectomia radical robótica dura entre 2 e 4 horas, dependendo do volume prostático, das características do tumor e da necessidade de linfadenectomia pélvica (remoção de linfonodos). O paciente fica sob anestesia geral durante todo o procedimento.',
  },
  {
    q: 'Quando o PSA deve ser dosado após a cirurgia?',
    a: 'O PSA deve ser indetectável (< 0,1 ng/mL) 4 a 6 semanas após a prostatectomia radical. Valores detectáveis ou crescentes nesse período podem indicar tecido prostático residual ou recidiva bioquímica, o que exige avaliação imediata.',
  },
  {
    q: 'É possível ter erecão após a prostatectomia robótica?',
    a: 'Sim, especialmente com a técnica nerve-sparing bilateral em pacientes com boa função erétil pré-operatória e tumor de baixo risco. A recuperação da ereção pode levar de 6 meses a 2 anos. Medicamentos como inibidores da PDE5 (sildenafil) facilitam a reabilitação peniana no pós-operatório.',
  },
  {
    q: 'A cirurgia robótica está disponível em Fortaleza?',
    a: 'Sim. O Dr. Érico Diógenes realiza a prostatectomia radical robótica com o sistema Da Vinci em Fortaleza, sendo um dos especialistas de referência para esse procedimento no Ceará.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Cirurgia Robótica', item: 'https://drericodiogenes.com.br/cirurgia-robotica' },
    { '@type': 'ListItem', position: 3, name: 'Cirurgia Robótica de Próstata', item: 'https://drericodiogenes.com.br/tratamentos/cirurgia-robotica/prostata' },
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

export default function CirurgiaRoboticaProstata() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cirurgia Robótica de Próstata em Fortaleza, Prostatectomia Da Vinci"
        description="Prostatectomia radical robótica em Fortaleza com Dr. Érico Diógenes. Sistema Da Vinci, preservação de nervos e os melhores resultados oncológicos e funcionais."
        url="https://drericodiogenes.com.br/tratamentos/cirurgia-robotica/prostata"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Prostatectomia Radical · Sistema Da Vinci · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Cirurgia Robótica de Próstata:{' '}
                <span className="text-brand-gold">cura do câncer com máxima preservação da qualidade de vida.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                A prostatectomia radical robótica com o sistema Da Vinci é hoje o procedimento cirúrgico mais avançado para o tratamento do câncer de próstata localizado. Alia precisão oncológica à preservação das funções urinárias e sexuais, os dois maiores medos dos pacientes ao receber o diagnóstico.
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
              src="/demos/dr-erico/img/dr-erico-foto-1.webp"
              alt="Cirurgia robótica de próstata em Fortaleza, Dr. Érico Diógenes"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, TRIFECTA */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">O objetivo do tratamento</p>
            <h2 className="section-title mt-2">A TRIFECTA DA PROSTATECTOMIA ROBÓTICA</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Em uro-oncologia, o sucesso da prostatectomia radical vai além da remoção do tumor. O conceito de <strong className="text-brand-navy">"trifecta"</strong> reúne os três resultados que todo paciente e cirurgião buscam alcançar simultaneamente, e que a abordagem robótica maximiza de forma única.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {trifecta.map((item, i) => (
              <div
                key={item.meta}
                className="rounded-2xl p-8 text-center bg-brand-navy text-white"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="text-4xl mb-4">{item.icone}</div>
                <h3 className="font-display text-xl text-brand-gold">{item.meta}</h3>
                <p className="text-sm text-white/75 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3, VANTAGENS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Por que escolher a robótica</p>
            <h2 className="section-title mt-2">VANTAGENS DA PROSTATECTOMIA ROBÓTICA</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Comparada à cirurgia aberta e à laparoscopia convencional, a prostatectomia robótica com Da Vinci oferece vantagens concretas que impactam tanto o resultado oncológico quanto a qualidade de vida do paciente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {vantagens.map((item, i) => (
              <div
                key={item.titulo}
                className="bg-white rounded-2xl p-6 shadow-card"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <Check size={20} className="text-brand-green mb-3" />
                <h3 className="font-display text-base text-brand-navy">{item.titulo}</h3>
                <p className="text-sm text-brand-muted mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, prostatectomia robótica Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Referência em robótica urológica no Ceará</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A prostatectomia radical robótica é um dos procedimentos mais tecnicamente exigentes da urologia. Resultados superiores dependem não apenas do equipamento, mas da experiência e do treinamento específico do cirurgião, fatores que determinam a qualidade das margens cirúrgicas e a preservação nervosa.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes é referência em prostatectomia robótica com o sistema Da Vinci, com formação pela Universidade Federal do Ceará e especialização em uro-oncologia e cirurgia minimamente invasiva. Cada caso é avaliado individualmente, analisando o estágio do tumor, o Gleason score, o PSA e as preferências do paciente, para definir a abordagem que maximiza ao mesmo tempo os resultados oncológicos e a qualidade de vida.
              </p>
              <p>
                Para o Dr. Érico, o sucesso cirúrgico não termina nas margens negativas: continência urinária e preservação sexual são metas igualmente importantes e tratadas com o mesmo rigor técnico.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/condicoes-urologicas/prostata/cancer-prostata" className="btn-primary">Sobre o Câncer de Próstata</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
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
      <CtaBanner title="Cirurgia robótica de próstata em Fortaleza, agende sua avaliação com Dr. Érico" />
    </>
  )
}
