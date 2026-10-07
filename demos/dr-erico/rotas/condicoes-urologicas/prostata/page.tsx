import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Próstata Aumentada Fortaleza | Sintomas e Tratamento, Dr. Érico Diógenes' },
  description:
    'Tudo sobre a saúde da próstata: o que é, sintomas de alerta, principais condições e tratamentos modernos em Fortaleza com Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/prostata' },
  openGraph: {
    title: 'Próstata Aumentada Fortaleza | Dr. Érico Diógenes',
    description: 'Guia completo sobre próstata: sintomas, condições e tratamentos disponíveis em Fortaleza com Dr. Érico Diógenes.',
    url: '/condicoes-urologicas/prostata',
  },
}

const condicoes = [
  {
    titulo: 'Hiperplasia Prostática Benigna (HPB)',
    desc: 'O aumento benigno da próstata afeta mais de 50% dos homens acima de 60 anos. Causa dificuldade para urinar, jato fraco e urgência urinária.',
    href: '/condicoes-urologicas/prostata/hiperplasia-prostatica',
  },
  {
    titulo: 'PSA Alterado',
    desc: 'O PSA elevado pode indicar hiperplasia, prostatite ou câncer. Entenda o que significa o resultado e quais são os próximos passos.',
    href: '/condicoes-urologicas/prostata/psa-alterado',
  },
  {
    titulo: 'Câncer de Próstata',
    desc: 'O câncer mais comum nos homens brasileiros. Quando detectado precocemente, tem taxa de cura superior a 90%. Rastreamento salva vidas.',
    href: '/condicoes-urologicas/prostata/cancer-prostata',
  },
  {
    titulo: 'Exame de Próstata',
    desc: 'PSA e toque retal são os principais exames de rastreamento. Entenda quando fazê-los, o que avaliam e como se preparar.',
    href: '/condicoes-urologicas/prostata/exame-prostata',
  },
  {
    titulo: 'HoLEP, Cirurgia a Laser',
    desc: 'A técnica mais moderna para tratamento da próstata aumentada. Sem cortes, recuperação em 24h e resultados duradouros.',
    href: '/holep',
  },
]

const sintomas = [
  'Dificuldade para iniciar a micção',
  'Jato urinário fraco ou interrompido',
  'Sensação de bexiga não esvaziada completamente',
  'Necessidade de urinar com muita frequência',
  'Urgência urinária, vontade súbita e intensa de urinar',
  'Levantar várias vezes à noite para urinar (noctúria)',
  'Dor ou ardência ao urinar',
  'Sangue na urina ou no sêmen',
]

const faq = [
  {
    q: 'Próstata aumentada é a mesma coisa que câncer de próstata?',
    a: 'Não. A hiperplasia prostática benigna (HPB) é o aumento natural da próstata com a idade, um processo benigno e muito comum. O câncer de próstata é uma doença distinta, com causas e tratamentos diferentes. É possível ter HPB sem câncer, e vice-versa.',
  },
  {
    q: 'A partir de que idade a próstata começa a dar problema?',
    a: 'Os sintomas da HPB costumam aparecer a partir dos 50 anos, mas o rastreamento do câncer de próstata deve começar aos 40 anos, ou aos 35 em homens com histórico familiar. A próstata começa a crescer naturalmente após os 40 anos em resposta às mudanças hormonais.',
  },
  {
    q: 'Próstata aumentada tem cura?',
    a: 'A HPB não tem "cura" no sentido de reverter o crescimento, mas tem tratamento muito eficaz. Medicamentos podem controlar os sintomas por anos. Cirurgias como o HoLEP removem o tecido obstrutivo de forma definitiva, com resultados duradouros.',
  },
  {
    q: 'Todos os problemas de próstata causam disfunção erétil?',
    a: 'Não diretamente. A HPB em si não causa disfunção erétil, mas alguns medicamentos usados no tratamento podem. O câncer de próstata e seu tratamento cirúrgico podem afetar a função sexual, por isso a escolha da técnica cirúrgica (como a robótica, que preserva nervos) é fundamental.',
  },
  {
    q: 'HoLEP e cirurgia robótica são para o mesmo problema?',
    a: 'Não exatamente. O HoLEP é indicado principalmente para HPB (aumento benigno). A cirurgia robótica (prostatectomia radical robótica) é o tratamento cirúrgico padrão para o câncer de próstata. Ambas são minimamente invasivas, mas com indicações distintas.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Condições Urológicas', item: 'https://drericodiogenes.com.br/condicoes-urologicas' },
    { '@type': 'ListItem', position: 3, name: 'Próstata', item: 'https://drericodiogenes.com.br/condicoes-urologicas/prostata' },
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

export default function Prostata() {
  return (
    <>
      <MedicalWebPageSchema
        name="Próstata Aumentada em Fortaleza, Sintomas e Tratamento"
        description="Guia completo sobre saúde da próstata em Fortaleza: HPB, câncer, PSA alterado e tratamentos modernos com Dr. Érico Diógenes."
        url="https://drericodiogenes.com.br/condicoes-urologicas/prostata"
        specialty="Urology"
      />



      {/* SEÇÃO 1, HERO */}
      <section className="relative bg-brand-beige overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow">Saúde da Próstata · Fortaleza, CE</p>
              <h1 className="section-title mt-2">
                Próstata aumentada:{' '}
                <span className="text-brand-gold">sintomas, causas e tratamentos modernos em Fortaleza.</span>
              </h1>
              <p className="mt-5 text-brand-muted text-base md:text-lg max-w-xl">
                A próstata é uma glândula exclusivamente masculina, e com o passar dos anos, torna-se a principal fonte de preocupação urológica do homem adulto. Entender como ela funciona, quando ela causa sintomas e quais as opções de tratamento é o primeiro passo para cuidar da saúde com segurança.
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
              src="/demos/dr-erico/img/post/imgid05_01.webp"
              alt="Saúde da próstata em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-beige to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-beige to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2, SINTOMAS */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Quando consultar</p>
            <h2 className="section-title mt-2">SINTOMAS QUE PEDEM ATENÇÃO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Os problemas de próstata raramente causam dor nos estágios iniciais, o que leva muitos homens a adiarem a consulta. Os sintomas mais comuns estão relacionados à função urinária e surgem gradualmente. Se você reconhece algum dos sinais abaixo, consulte um urologista.
            </p>
          </div>
          <ul className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {sintomas.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-brand-beige-light rounded-xl p-4 shadow-card text-sm"
                data-aos="fade-up"
                data-aos-delay={i * 40}
              >
                <Check size={16} className="mt-0.5 shrink-0 text-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-center mt-8 font-display italic text-brand-navy text-lg max-w-2xl mx-auto" data-aos="fade-up">
            O câncer de próstata em estágio inicial quase nunca causa sintomas. O rastreamento anual com PSA é a única forma de detectá-lo precocemente.
          </p>
        </div>
      </section>

      {/* SEÇÃO 3, CONDIÇÕES */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Diagnóstico e tratamento</p>
            <h2 className="section-title mt-2">PRINCIPAIS CONDIÇÕES DA PRÓSTATA</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Em Fortaleza, o Dr. Érico Diógenes é referência no diagnóstico e tratamento das doenças da próstata, com acesso às técnicas mais avançadas disponíveis, do HoLEP à cirurgia robótica Da Vinci.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {condicoes.map((item, i) => (
              <Link
                key={item.titulo}
                href={item.href}
                className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-soft transition-shadow"
                data-aos="fade-up"
                data-aos-delay={i * 70}
              >
                <h3 className="font-display text-lg text-brand-gold">{item.titulo}</h3>
                <p className="text-sm text-brand-muted mt-2">{item.desc}</p>
                <span className="inline-block mt-4 text-xs text-brand-navy font-medium">Saiba mais →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4, DR. ÉRICO */}
      <section className="py-16 bg-white">
        <div className="container-site grid lg:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <p className="eyebrow">Referência em próstata no Ceará</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                O tratamento das doenças da próstata evoluiu enormemente nas últimas décadas. Hoje, condições que antes exigiam cirurgias abertas com longos períodos de internação são tratadas por via endoscópica, com laser ou com robótica, com alta hospitalar em 24 horas e retorno rápido às atividades.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes foi um dos pioneiros nessa transformação. Com formação pela Universidade Federal do Ceará e especialização em cirurgia minimamente invasiva, foi o responsável por introduzir o HoLEP no Ceará, técnica considerada o padrão ouro mundial para HPB, e realiza rotineiramente a prostatectomia robótica com o sistema Da Vinci para o câncer de próstata.
              </p>
              <p>
                Independente do diagnóstico, o Dr. Érico avalia cada caso individualmente, apresenta todas as opções disponíveis e define, junto com o paciente, o melhor caminho para o tratamento.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dr-erico-diogenes" className="btn-primary">Conhecer o Dr. Érico</Link>
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">Agendar Consulta</a>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/dr-erico/img/dr-erico-foto-1.webp" alt="Dr. Érico Diógenes, especialista em próstata em Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE A PRÓSTATA</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Cuide da saúde da sua próstata com quem é referência em Fortaleza" />
    </>
  )
}
