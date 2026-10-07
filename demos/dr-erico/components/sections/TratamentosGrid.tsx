import Link from '@/demos/dr-erico/lib/Link'
import { ChevronRight } from 'lucide-react'

type TratamentoItem = {
  imagem: string
  titulo: string
  href: string
  links: { label: string; href: string }[]
}

const tratamentos: TratamentoItem[] = [
  {
    imagem: '/demos/dr-erico/img/post/imgid09_01.webp',
    titulo: 'Check-Up Urológico',
    href: '/urologia',
    links: [
      // PLANO DE RECUPERAÇÃO · ITEM 5 · Fim da canibalização.
      // Havia aqui um link com âncora de correspondência exata
      // ("Urologista em Fortaleza") apontando para
      // /urologia/urologista-fortaleza. Esse link mandava o sinal do termo
      // principal para uma página que disputava a home, e a home é quem
      // ranqueia. A página virou 301 para a home e o link saiu daqui.
      { label: 'Urologia Geral em Fortaleza', href: '/urologia/urologia-geral' },
      { label: 'Consulta Urologista Fortaleza', href: '/urologia/consulta' },
      // Este card tinha só dois links e ficava com um vazio visível ao lado
      // dos demais, que têm de quatro a sete. O hub de condições é o destino
      // natural de quem chega por "check-up".
      { label: 'Condições Urológicas', href: '/condicoes-urologicas' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/post/imgid05_01.webp',
    titulo: 'Tratamento a Laser HoLEP para Próstata',
    href: '/holep',
    links: [
      { label: 'Próstata Aumentada', href: '/condicoes-urologicas/prostata' },
      { label: 'Hiperplasia Prostática Benigna (HPB)', href: '/condicoes-urologicas/prostata/hiperplasia-prostatica' },
      { label: 'HoLEP em Fortaleza', href: '/holep' },
      { label: 'Cirurgia a Laser para Próstata', href: '/holep' },
      { label: 'Exame de Próstata Fortaleza', href: '/condicoes-urologicas/prostata/exame-prostata' },
      { label: 'PSA Alterado', href: '/condicoes-urologicas/prostata/psa-alterado' },
      { label: 'Câncer de Próstata Fortaleza', href: '/condicoes-urologicas/prostata/cancer-prostata' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/dr-erico-foto-1.webp',
    titulo: 'Cirurgia Robótica em Urologia',
    href: '/cirurgia-robotica',
    links: [
      { label: 'Cirurgia Robótica Urológica Fortaleza', href: '/cirurgia-robotica' },
      { label: 'Cirurgia Robótica Próstata Fortaleza', href: '/tratamentos/cirurgia-robotica/prostata' },
      { label: 'Cirurgia Robótica Rim', href: '/tratamentos/cirurgia-robotica/rim' },
      { label: 'Cirurgia Robótica Bexiga', href: '/tratamentos/cirurgia-robotica/bexiga' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/post/imgid04_01.webp',
    titulo: 'Cálculos Urinários',
    href: '/condicoes-urologicas/calculo-renal',
    links: [
      { label: 'Cálculo Renal Fortaleza', href: '/condicoes-urologicas/calculo-renal' },
      { label: 'Pedra nos Rins Fortaleza', href: '/condicoes-urologicas/calculo-renal/pedra-nos-rins' },
      { label: 'Tratamento Pedra nos Rins', href: '/condicoes-urologicas/calculo-renal/pedra-nos-rins' },
      { label: 'Cirurgia Pedra nos Rins', href: '/condicoes-urologicas/calculo-renal/cirurgia-calculo-renal' },
      { label: 'Dor nos Rins – Urologista', href: '/condicoes-urologicas/calculo-renal/dor-nos-rins' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/post/imgid08_01.webp',
    titulo: 'Uro-Oncologia',
    href: '/condicoes-urologicas/uro-oncologia',
    links: [
      { label: 'Câncer de Próstata', href: '/condicoes-urologicas/uro-oncologia/cancer-prostata' },
      { label: 'Câncer de Rim', href: '/condicoes-urologicas/uro-oncologia/cancer-rim' },
      { label: 'Câncer de Bexiga', href: '/condicoes-urologicas/uro-oncologia/cancer-bexiga' },
      { label: 'Câncer de Testículo', href: '/condicoes-urologicas/uro-oncologia/cancer-testiculo' },
      { label: 'Tumores Urológicos', href: '/condicoes-urologicas/uro-oncologia' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/post/imgid15_01.webp',
    titulo: 'Andrologia e Saúde Sexual Masculina',
    href: '/saude-masculina',
    links: [
      { label: 'Disfunção Erétil Fortaleza', href: '/saude-masculina/disfuncao-eretil' },
      { label: 'Ejaculação Precoce', href: '/saude-masculina/ejaculacao-precoce' },
      { label: 'Baixa Testosterona', href: '/saude-masculina/baixa-testosterona' },
      { label: 'Infertilidade Masculina', href: '/saude-masculina/infertilidade' },
      { label: 'Vasectomia Fortaleza', href: '/saude-masculina/vasectomia' },
    ],
  },

  // ─── Três categorias novas, adicionadas em 28/09/2026 ─────────────────
  //
  // Elas existem porque 19 páginas do site não tinham conteúdo e, por isso,
  // também não tinham porta de entrada: 16 das 19 não eram alcançáveis por
  // clique nenhum, só digitando a URL. Escritas as páginas, faltava ligá-las
  // à navegação, e este grid é o mapa real do site: o item "Tratamentos" do
  // menu aponta para a âncora #tratamentos desta seção.
  //
  // Com estas três, o grid fecha em 9 cards, ou seja, três linhas cheias de
  // três colunas, em vez das duas linhas anteriores.
  {
    imagem: '/demos/dr-erico/img/post/imgid16_01.webp',
    titulo: 'Bexiga e Trato Urinário',
    href: '/condicoes-urologicas/bexiga',
    links: [
      { label: 'Infecção Urinária Fortaleza', href: '/condicoes-urologicas/bexiga/infeccao-urinaria' },
      { label: 'Bexiga Hiperativa', href: '/condicoes-urologicas/bexiga/bexiga-hiperativa' },
      { label: 'Incontinência Urinária', href: '/condicoes-urologicas/bexiga/incontinencia' },
      { label: 'Sangue na Urina', href: '/condicoes-urologicas/bexiga/sangue-na-urina' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/post/imgid12_01.webp',
    titulo: 'Exames Urológicos',
    href: '/exames-orientacoes',
    links: [
      { label: 'Exame de PSA Fortaleza', href: '/exames-orientacoes/exames/psa' },
      { label: 'Ultrassom Urológico', href: '/exames-orientacoes/exames/ultrassom' },
      { label: 'Cistoscopia', href: '/exames-orientacoes/exames/cistoscopia' },
      { label: 'Urofluxometria', href: '/exames-orientacoes/exames/urofluxometria' },
      { label: 'Preparo para a Consulta', href: '/exames-orientacoes/orientacoes/consulta' },
    ],
  },
  {
    imagem: '/demos/dr-erico/img/post/imgid19_01.webp',
    titulo: 'Cirurgias Urológicas',
    href: '/tratamentos',
    links: [
      { label: 'Cirurgia Urológica: as vias', href: '/tratamentos/cirurgia-urologica' },
      { label: 'Postectomia Fortaleza', href: '/tratamentos/postectomia' },
      { label: 'Orquiectomia', href: '/tratamentos/orquiectomia' },
      { label: 'Orientações Pré-Operatórias', href: '/exames-orientacoes/orientacoes/pre-operatorio' },
      { label: 'Orientações Pós-Operatórias', href: '/exames-orientacoes/orientacoes/pos-operatorio' },
    ],
  },
]

export default function TratamentosGrid() {
  return (
    <section id="tratamentos" className="py-16 bg-white">
      <div className="container-site">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="eyebrow">Conheça nossos</p>
          <h2 className="section-title mt-2">Tratamentos</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tratamentos.map((item, i) => (
            <div
              key={item.titulo}
              className="bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className="h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/*
                  O título é link para a página-índice da categoria.
                  O campo `href` de cada item existia desde sempre no dado e
                  nunca era usado no render: as páginas-índice apareciam no
                  código-fonte deste componente mas não no HTML servido, e
                  portanto não eram alcançáveis por clique nenhum.
                */}
                <h3 className="font-display text-lg text-brand-navy text-center mb-4">
                  <Link href={item.href} className="hover:text-brand-gold transition-colors">
                    {item.titulo}
                  </Link>
                </h3>

                <ul className="space-y-2 flex-1">
                  {item.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="flex items-start gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors"
                      >
                        <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand-gold" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
