import Link from '@/demos/dr-erico/lib/Link'
import PageHeader from '@/demos/dr-erico/components/ui/PageHeader'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import { renderInline } from '@/demos/dr-erico/components/ui/ConteudoRico'

/**
 * Molde das páginas institucionais: política editorial, correções,
 * privacidade e termos de uso.
 *
 * Existe para as quatro não repetirem a mesma estrutura quatro vezes, e para
 * que uma correção de espaçamento não precise ser feita em quatro arquivos.
 *
 * Não introduz linguagem visual nova: usa o PageHeader que todas as páginas já
 * usam, o container padrão e as cores da marca. O que muda em relação a uma
 * página comum é só a largura do texto, menor, porque linha longa demais
 * cansa em documento que se lê do começo ao fim.
 */

/**
 * O texto dos parágrafos e dos itens aceita [rótulo](/destino), pelo mesmo
 * renderizador usado em posts e notícias. Sem isso, estas páginas citariam
 * umas às outras só em texto, que é exatamente o erro que deixou dez páginas
 * do site como "O Google não reconhece o URL".
 */
/** As quatro páginas institucionais, para se apontarem umas às outras. */
const OUTRAS = [
  { titulo: 'Política Editorial', href: '/politica-editorial' },
  { titulo: 'Política de Correções', href: '/politica-de-correcoes' },
  { titulo: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { titulo: 'Termos de Uso', href: '/termos-de-uso' },
]

export type BlocoTexto =
  | { tipo: 'p'; texto: string }
  | { tipo: 'h2'; texto: string }
  | { tipo: 'lista'; itens: string[] }

type Props = {
  titulo: string
  /** Frase curta sob o título, dizendo do que trata o documento. */
  resumo: string
  /** Data da última revisão, por extenso. Ex: '2 de outubro de 2026' */
  atualizadoEm: string
  blocos: BlocoTexto[]
}

export default function PaginaInstitucional({ titulo, resumo, atualizadoEm, blocos }: Props) {
  return (
    <>
      <PageHeader title={titulo} breadcrumb={titulo} />

      <section className="py-14 md:py-16 bg-white">
        <div className="container-site max-w-3xl">
          <p className="text-brand-muted text-base md:text-lg leading-relaxed" data-aos="fade-up">
            {resumo}
          </p>

          {/*
            A data fica no topo, não no rodapé.

            Em documento de política, quem abre quer saber primeiro se está
            lendo a versão vigente. Deixar isso para o fim obriga a rolar a
            página inteira para responder a pergunta mais básica.
          */}
          <p className="mt-3 text-sm text-brand-muted/80">
            Última atualização: {atualizadoEm}
          </p>

          <div className="mt-10">
            {blocos.map((b, i) => {
              if (b.tipo === 'h2') {
                return (
                  <h2
                    key={i}
                    className="font-display text-2xl text-brand-navy mt-10 mb-3 pb-3 border-b border-brand-beige first:mt-0"
                  >
                    {b.texto}
                  </h2>
                )
              }
              if (b.tipo === 'lista') {
                return (
                  <ul key={i} className="mt-4 space-y-2.5">
                    {b.itens.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-brand-muted text-[15px] leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
                        <span>{renderInline(item)}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={i} className="text-brand-muted leading-relaxed mt-4 text-[15px]">
                  {renderInline(b.texto)}
                </p>
              )
            })}
          </div>

          {/*
            Rodapé do documento com as outras políticas.

            Não é enfeite: documento de política raramente se lê sozinho, e quem
            chega na política de privacidade costuma querer os termos de uso em
            seguida. Sem esta lista, /termos-de-uso não receberia link de página
            nenhuma, que é a definição de página órfã.

            O plano prevê esses links também no rodapé do site, o que depende de
            aprovação do Dr. Érico.
          */}
          <div className="mt-12 pt-8 border-t border-brand-beige">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted mb-3">
              Outros documentos
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {OUTRAS.filter((o) => o.titulo !== titulo).map((o) => (
                <li key={o.href}>
                  <Link
                    href={o.href}
                    className="text-sm text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors"
                  >
                    {o.titulo}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-brand-muted">
              Dúvidas sobre este documento podem ser enviadas pela{' '}
              <Link href="/contato" className="text-brand-gold-dark underline underline-offset-2 hover:text-brand-gold transition-colors">
                página de contato
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <ContactMini />
    </>
  )
}
