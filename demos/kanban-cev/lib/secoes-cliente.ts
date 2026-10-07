import {
  FileText,
  Target,
  Dna,
  Users,
  User,
  Tag,
  Volume2,
  GitCompare,
  Grid2x2,
  Palette,
  Link2,
  Sparkles,
} from 'lucide-react'

/**
 * O onboarding do cliente: preenchido uma vez, lido pelo time inteiro.
 *
 * `content` é jsonb justamente para caber os quatro formatos abaixo sem uma
 * coluna nova a cada um:
 *
 *   texto   um campo markdown só — a maioria das seções
 *   listas  blocos de itens, um por linha (SWOT, greenlist/redlist)
 *   voz     markdown E listas: como a marca fala, mais o que usar e evitar
 *   idv     campos fixos (fonte, cores, logo), porque cor vira amostra na tela
 *
 * A ORDEM aqui é a da tela. Persona vem logo depois de Arquétipos e o SWOT
 * depois de Concorrentes porque cada par se lê junto — arquétipo é a marca,
 * persona é quem ouve; concorrente é quem está do lado, SWOT é o que isso faz
 * com a gente.
 *
 * Fica fora do `page.tsx` porque o briefing também precisa dos títulos: é como
 * ele diz "esta resposta alimenta o Tom de voz" sem repetir o nome da seção em
 * dois arquivos que sairiam do lugar um do outro na primeira renomeação.
 */
/**
 * `icone` é o desenho grande no canto do cartão: identifica o bloco de relance,
 * antes de ler o título. A COR dele não vem daqui — é o token `--color-icone`,
 * que acompanha o tema (branco no escuro, verde no claro).
 */
export const SECOES = [
  { type: 'historia', title: 'História do cliente', hint: 'De onde veio, como chegou aqui.', formato: 'texto', icone: FileText },
  { type: 'objetivos', title: 'Objetivos e estratégia', hint: 'Aonde quer chegar e por qual caminho.', formato: 'texto', icone: Target },
  { type: 'dna', title: 'DNA do especialista', hint: 'No que acredita, o que domina, como se posiciona.', formato: 'texto', icone: Dna },
  { type: 'arquetipos', title: 'Arquétipos e personalidade', hint: 'O caráter da marca: se fosse gente, seria quem.', formato: 'texto', icone: Users },
  { type: 'persona', title: 'Persona', hint: 'Para quem a comunicação fala.', formato: 'texto', icone: User },
  { type: 'canais_vendas', title: 'Canais de vendas', hint: 'Por onde a venda acontece de verdade.', formato: 'texto', icone: Tag },
  { type: 'brand_voice', title: 'Tom de voz', hint: 'Como a marca escreve e fala — e o que ela nunca diz.', formato: 'voz', icone: Volume2 },
  { type: 'concorrentes', title: 'Concorrentes e referências', hint: 'Quem disputa o mesmo espaço e quem inspira.', formato: 'texto', icone: GitCompare },
  { type: 'swot', title: 'Análise SWOT', hint: 'Forças, fraquezas, oportunidades e ameaças.', formato: 'listas', icone: Grid2x2 },
  { type: 'idv', title: 'IDV — identidade visual', hint: 'Fonte, cores e logo. O que a peça precisa respeitar.', formato: 'idv', icone: Palette },
  { type: 'links', title: 'Links úteis', hint: 'Drive, redes sociais, acessos.', formato: 'texto', icone: Link2 },
  { type: 'prompt_conteudo', title: 'Prompt inicial de conteúdo', hint: 'O ponto de partida pronto para gerar conteúdo deste cliente.', formato: 'texto', icone: Sparkles },
] as const

export const SWOT_QUADRANTES = [
  { key: 'forcas', label: 'Forças', className: 'bg-emerald-500/12 ring-emerald-400/25' },
  { key: 'fraquezas', label: 'Fraquezas', className: 'bg-red-500/12 ring-red-400/25' },
  { key: 'oportunidades', label: 'Oportunidades', className: 'bg-sky-500/12 ring-sky-400/25' },
  { key: 'ameacas', label: 'Ameaças', className: 'bg-amber-500/12 ring-amber-400/25' },
] as const

/** As duas listas do tom de voz. Mesmo mecanismo do SWOT, outras chaves. */
export const VOZ_LISTAS = [
  { key: 'greenlist', label: 'Greenlist · usar', className: 'bg-emerald-500/12 ring-emerald-400/25' },
  { key: 'redlist', label: 'Redlist · evitar', className: 'bg-red-500/12 ring-red-400/25' },
] as const

/** Qual conjunto de listas cada formato usa. `texto` e `idv` não usam nenhum. */
export const LISTAS_DO_FORMATO: Record<
  string,
  readonly { key: string; label: string; className: string }[]
> = {
  listas: SWOT_QUADRANTES,
  voz: VOZ_LISTAS,
}

/** Título da seção a partir do tipo. Usado pelo "Alimenta:" do briefing. */
export function tituloDaSecao(type: string): string {
  return SECOES.find((s) => s.type === type)?.title ?? type
}

export function secaoPorTipo(type: string) {
  return SECOES.find((s) => s.type === type)
}

/**
 * Se a seção já tem conteúdo. O que conta muda com o formato, e é por isso que
 * a regra vive aqui e não dentro do editor: a grade de cards precisa da mesma
 * resposta para marcar o que falta, e duas implementações discordariam no
 * primeiro formato novo.
 */
export function secaoPreenchida(formato: string, conteudo: any): boolean {
  if (!conteudo) return false
  if (formato === 'idv') {
    return !!conteudo.fonte || !!(conteudo.cores ?? []).length || !!conteudo.logoUrl
  }
  const listas = LISTAS_DO_FORMATO[formato] ?? []
  return !!conteudo.texto || listas.some((l) => (conteudo[l.key] ?? []).length)
}
