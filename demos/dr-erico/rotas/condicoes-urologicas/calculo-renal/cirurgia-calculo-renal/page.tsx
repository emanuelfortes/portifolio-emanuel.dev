import type { Metadata } from 'next'
import Link from '@/demos/dr-erico/lib/Link'
import { Check } from 'lucide-react'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import UrologiaFaq from '@/demos/dr-erico/components/urologia/UrologiaFaq'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { MedicalWebPageSchema } from '@/demos/dr-erico/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: { absolute: 'Cirurgia Pedra nos Rins Fortaleza | Laser e Ureteroscopia — Dr. Érico Diógenes' },
  description:
    'Tratamento cirúrgico para pedra nos rins em Fortaleza: ureteroscopia com laser holmium, nefrolitotripsia percutânea e litotripsia extracorpórea. Dr. Érico Diógenes.',
  alternates: { canonical: '/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal' },
  openGraph: {
    title: 'Cirurgia Pedra nos Rins Fortaleza | Dr. Érico Diógenes',
    description: 'Entenda quando a pedra nos rins precisa de cirurgia e qual o procedimento mais indicado para cada caso. Dr. Érico Diógenes em Fortaleza.',
    url: '/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal',
  },
}

const criteriosCircurgia = [
  { criterio: 'Pedra maior que 6 mm', detalhe: 'Baixíssima chance de eliminação espontânea. Intervenção praticamente sempre necessária.' },
  { criterio: 'Obstrução com infecção', detalhe: 'Emergência urológica. Risco de pionefroses e sepse. Drenagem imediata é obrigatória.' },
  { criterio: 'Dor incontrolável', detalhe: 'Cólica renal refratária a analgésicos indica que o organismo não conseguirá eliminar a pedra.' },
  { criterio: 'Comprometimento da função renal', detalhe: 'Obstrução prolongada pode causar dano renal irreversível. O tempo de intervenção é crítico.' },
  { criterio: 'Pedra em rim único', detalhe: 'Qualquer obstrução em rim único é urgência urológica, independente do tamanho da pedra.' },
  { criterio: 'Ausência de progressão', detalhe: 'Pedra que não migra em 4 a 6 semanas, mesmo de tamanho favorável, indica necessidade de intervenção.' },
]

const procedimentos = [
  {
    nome: 'Ureteroscopia com Laser (URS-L)',
    indicacao: 'Pedras no ureter e pelve renal até 2 cm',
    como: 'Um ureteroscópio (tubo fino com câmera) é introduzido pela uretra até o local da pedra, sem incisão. O laser holmium pulveriza o cálculo em partículas microscópicas eliminadas pela urina.',
    vantagens: ['Sem incisão, sem cicatriz', 'Alta hospitalar em 24h', 'Retorno imediato às atividades', 'Eficaz para a maioria dos cálculos ureterais'],
    recuperacao: '1 a 2 dias',
    img: '/demos/dr-erico/img/post/imgid09_01.webp',
    destaque: 'Procedimento de escolha para cálculos ureterais',
  },
  {
    nome: 'Nefrolitotripsia Percutânea (NLPC)',
    indicacao: 'Pedras renais acima de 2 cm e cálculos coraliformes',
    como: 'Acesso ao rim por punção lombar guiada por imagem (1,5 cm de incisão). Um nefroscópio entra diretamente no rim e fragmenta a pedra por laser ou ultrassom, com aspiração dos fragmentos.',
    vantagens: ['Taxa de sucesso superior a 90% para pedras grandes', 'Remove grandes volumes de cálculo em uma sessão', 'Indicada para coraliformes inacessíveis por outras vias'],
    recuperacao: '2 a 3 dias',
    img: '/demos/dr-erico/img/post/imgid10_01.webp',
    destaque: 'Padrão ouro para pedras grandes',
  },
  {
    nome: 'Litotripsia Extracorpórea (LEOC)',
    indicacao: 'Pedras renais até 1,5 cm sem complicações',
    como: 'Ondas de choque geradas externamente convergem sobre a pedra e a fragmentam. Não há incisão. Os fragmentos são eliminados espontaneamente pela urina ao longo de dias ou semanas.',
    vantagens: ['Sem anestesia geral (sedação leve)', 'Sem incisão', 'Procedimento ambulatorial'],
    recuperacao: 'Imediata (procedimento ambulatorial)',
    img: '/demos/dr-erico/img/post/imgid02_01.webp',
    destaque: 'Não invasivo, sem internação',
  },
]

const faq = [
  {
    q: 'Qual procedimento é melhor para pedra nos rins?',
    a: 'Não existe um único procedimento "melhor". A escolha depende do tamanho, localização e composição da pedra, da anatomia do paciente e de fatores clínicos. Pedras ureterais se tratam com ureteroscopia a laser; pedras renais grandes com NLPC; pedras pequenas e de localização favorável podem ser tratadas com LEOC. O urologista define a conduta mais adequada após avaliação completa.',
  },
  {
    q: 'A ureteroscopia com laser dói?',
    a: 'O procedimento é feito sob anestesia raquidiana ou geral, portanto não há dor durante a cirurgia. Após a anestesia, pode haver desconforto uretral e necessidade de analgésicos por 1 a 2 dias. A maioria dos pacientes recebe alta no dia seguinte e volta às atividades em menos de uma semana.',
  },
  {
    q: 'O que é a sonda duplo J e por que ela é colocada?',
    a: 'A sonda duplo J (cateter ureteral interno) é um tubo fino em formato de J colocado dentro do ureter para mantê-lo aberto após a cirurgia. Permite que os fragmentos residuais sejam eliminados sem obstrução e previne edema ureteral. Permanece de 2 a 4 semanas e é retirada em procedimento ambulatorial simples.',
  },
  {
    q: 'Tenho pedra de 8 mm no ureter. Posso esperar eliminar sozinho?',
    a: 'Pedras acima de 6 mm têm taxa de eliminação espontânea inferior a 20%. Uma pedra de 8 mm raramente passa sem intervenção. O tempo de espera pode ser prejudicial: quanto mais tempo a pedra permanece obstruindo o ureter, maior o risco de dano à função renal. A indicação de ureteroscopia nesse caso é praticamente certa.',
  },
  {
    q: 'Quantas sessões de LEOC são necessárias?',
    a: 'Geralmente de 1 a 3 sessões, com intervalo de 1 a 2 semanas. A LEOC é menos eficaz para pedras duras (oxalato de cálcio monohidratado) e pode não fragmentá-las adequadamente. A taxa de stone-free (rim livre de fragmentos) da LEOC é inferior à da ureteroscopia com laser ou NLPC para a maioria dos casos.',
  },
  {
    q: 'Preciso de internação para tratar pedra nos rins?',
    a: 'Depende do procedimento. A LEOC é ambulatorial, sem internação. A ureteroscopia com laser costuma exigir uma noite de internação. A NLPC requer internação de 2 a 3 dias. Em casos de obstrução com infecção, a drenagem de emergência e o tratamento da sepse podem exigir internação mais prolongada.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://drericodiogenes.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Cálculo Renal', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal' },
    { '@type': 'ListItem', position: 3, name: 'Cirurgia Pedra nos Rins', item: 'https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal' },
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

export default function CirurgiaCalculoRenal() {
  return (
    <>
      <MedicalWebPageSchema
        name="Cirurgia para Pedra nos Rins em Fortaleza: Laser, Percutânea e Litotripsia"
        description="Tratamento cirúrgico do cálculo renal em Fortaleza: ureteroscopia com laser holmium, NLPC e LEOC. Dr. Érico Diógenes explica quando operar e como escolher o procedimento."
        url="https://drericodiogenes.com.br/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal"
        specialty="Urology"
      />



      {/* SEÇÃO 1 — HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[70vh]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20" data-aos="fade-right">
            <div>
              <p className="eyebrow text-brand-gold">Ureteroscopia Laser · NLPC · Fortaleza</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-beige leading-tight mt-2">
                Nem toda pedra precisa de cirurgia.{' '}
                <span className="text-brand-gold">Mas quando precisa, a escolha do procedimento muda tudo.</span>
              </h1>
              <p className="mt-5 text-brand-beige/70 text-base md:text-lg max-w-xl">
                A medicina de hoje oferece 3 grandes abordagens para o tratamento cirúrgico do cálculo renal, cada uma com indicações precisas e resultados diferentes. A decisão correta entre elas depende de tamanho, localização, composição da pedra e condições clínicas do paciente.
              </p>
              <div className="mt-8">
                <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-silver">
                  Avaliar Meu Caso
                </a>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[320px] order-first lg:order-last" data-aos="fade-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/dr-erico/img/dr-erico-foto-6.webp"
              alt="Tratamento cirúrgico de pedra nos rins em Fortaleza"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-brand-navy to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-navy to-transparent" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — CRITÉRIOS */}
      <section className="py-16 bg-white">
        <div className="container-site" data-aos="fade-up">
          <div className="text-center mb-12">
            <p className="eyebrow">Quando intervir</p>
            <h2 className="section-title mt-2">CRITÉRIOS PARA TRATAMENTO CIRÚRGICO</h2>
            <p className="text-brand-muted mt-4 max-w-3xl mx-auto">
              Pedras menores de 4 mm frequentemente passam sozinhas com hidratação e analgesia. A partir de certos critérios clínicos, a espera representa risco real para a saúde do rim. Estes são os sinais de que é hora de agir:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {criteriosCircurgia.map((item, i) => (
              <div key={item.criterio} className="flex items-start gap-3 bg-brand-beige-light rounded-xl p-5 shadow-card" data-aos="fade-up" data-aos-delay={i * 60}>
                <Check size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <div>
                  <p className="font-medium text-brand-navy text-sm">{item.criterio}</p>
                  <p className="text-xs text-brand-muted mt-1">{item.detalhe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — PROCEDIMENTOS */}
      <section className="py-16 bg-brand-beige-light">
        <div className="container-site">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="eyebrow">Compare as opções</p>
            <h2 className="section-title mt-2">OS 3 PROCEDIMENTOS PARA PEDRA NOS RINS</h2>
            <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
              Cada técnica tem uma janela de indicação específica. Usar o procedimento errado para o caso errado compromete o resultado. Conheça as diferenças e entenda qual é a mais adequada para o seu diagnóstico.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {procedimentos.map((proc, i) => (
              <div key={proc.nome} className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col" data-aos="fade-up" data-aos-delay={i * 100}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proc.img} alt={proc.nome} className="h-40 w-full object-cover" />
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 rounded-full px-3 py-1 w-fit mb-3">{proc.destaque}</span>
                  <h3 className="font-display text-lg text-brand-navy">{proc.nome}</h3>
                  <p className="text-xs text-brand-gold font-medium mt-1">Indicação: {proc.indicacao}</p>
                  <p className="text-sm text-brand-muted mt-3">{proc.como}</p>
                  <div className="mt-4 space-y-1">
                    {proc.vantagens.map((v) => (
                      <div key={v} className="flex items-start gap-2 text-xs text-brand-muted">
                        <Check size={12} className="mt-0.5 shrink-0 text-brand-green" />
                        {v}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-brand-beige-light">
                    <p className="text-xs text-brand-navy font-medium">Recuperação: {proc.recuperacao}</p>
                  </div>
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
              <img src="/demos/dr-erico/img/dr-erico-foto-4.webp" alt="Dr. Érico Diógenes, cirurgia pedra nos rins Fortaleza" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div data-aos="fade-left">
            <p className="eyebrow">Endourologia especializada em Fortaleza</p>
            <h2 className="section-title mt-2">DR. ÉRICO DIÓGENES</h2>
            <div className="mt-5 space-y-4 text-brand-muted">
              <p>
                A ureteroscopia com laser holmium é hoje o procedimento mais avançado e mais versátil para o tratamento endoscópico do cálculo renal. Permite tratar pedras no rim, na pelve renal e em todo o trajeto do ureter sem nenhuma incisão, com alta taxa de sucesso e recuperação em dias.
              </p>
              <p>
                Em Fortaleza, o Dr. Érico Diógenes realiza ureteroscopias com laser holmium, nefrolitotripsias percutâneas e indica a litotripsia extracorpórea quando é a opção mais adequada. Cada caso é discutido individualmente: o exame de imagem, o tamanho e localização da pedra, a função renal e as condições clínicas do paciente determinam o procedimento.
              </p>
              <p>
                Com formação pela Universidade Federal do Ceará e treinamento específico em endourologia, o Dr. Érico avalia a melhor estratégia para tratar a pedra atual e prevenir as próximas.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="https://wa.me/5585981781020" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Avaliar Meu Caso
              </a>
              <Link href="/condicoes-urologicas/calculo-renal/pedra-nos-rins" className="btn-silver">
                Tipos e Prevenção
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-beige-light">
        <div className="container-site max-w-3xl">
          <h2 className="section-title text-center" data-aos="fade-up">PERGUNTAS FREQUENTES SOBRE TRATAMENTO</h2>
          <UrologiaFaq faq={faq} />
        </div>
      </section>

      <ContactMini />
      <CtaBanner title="Pedra nos rins não tratada pode comprometer a função renal. Agende em Fortaleza." />
    </>
  )
}
