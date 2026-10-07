/**
 * O banco da réplica: a agência, a equipe, os clientes e as demandas.
 *
 * Tudo é fictício. Status, tipos de demanda e funções seguem o seed do
 * original (são configuração do produto); pessoas, clientes e demandas foram
 * inventados para uma agência de marketing qualquer.
 *
 * As datas são relativas ao momento em que a página abre: "vence hoje" vence
 * hoje para quem estiver olhando, em qualquer dia.
 */

import { PERGUNTAS_PADRAO } from '@/demos/kanban-cev/shared'

export const ME_ID = 'u-julia'

/* ------------------------------------------------------------------ tempo */

const AGORA = new Date()

/** Hoje + `dias`, na hora dada (hora local de quem vê). */
export function dia(dias: number, hora = 18, minuto = 0): string {
  const d = new Date(AGORA)
  d.setDate(d.getDate() + dias)
  d.setHours(hora, minuto, 0, 0)
  return d.toISOString()
}

/** Agora menos `min` minutos. */
export function haMin(min: number): string {
  return new Date(AGORA.getTime() - min * 60_000).toISOString()
}

/** AAAA-MM-DD com o mês e o dia de hoje + `dias`, no ano dado (aniversários). */
function aniversario(ano: number, dias: number): string {
  const d = new Date(AGORA)
  d.setDate(d.getDate() + dias)
  // Aniversário que cairia no mês seguinte volta para o fim deste: o painel
  // "Aniversários do mês" é o que mostra.
  if (d.getMonth() !== AGORA.getMonth()) d.setTime(new Date(AGORA.getFullYear(), AGORA.getMonth() + 1, 0).getTime())
  if (d.getDate() === AGORA.getDate()) d.setDate(d.getDate() > 1 ? d.getDate() - 1 : 2)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${ano}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/* ------------------------------------------------------------------ RNG */

let semente = 20260917
export function rand() {
  semente = (semente * 1664525 + 1013904223) % 4294967296
  return semente / 4294967296
}
export const escolher = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!

/* ------------------------------------------------------------------ configuração (seed do original) */

export interface DbRole {
  id: number
  slug: string
  displayName: string
  isSystem: boolean
  isActive: boolean
  acessoTotal: boolean
  permissionKeys: string[]
}

const TODAS = [
  'task:view_all',
  'task:edit_any',
  'task:delete',
  'task:assign_any',
  'client:manage',
  'delegation:manage',
  'user:manage',
  'role:manage',
  'task_type:manage',
  'event:manage',
]

export const ROLES: DbRole[] = [
  { id: 1, slug: 'coordenador', displayName: 'Coordenador', isSystem: true, isActive: true, acessoTotal: true, permissionKeys: TODAS },
  { id: 2, slug: 'desenvolvedor', displayName: 'Desenvolvedor', isSystem: true, isActive: true, acessoTotal: false, permissionKeys: [] },
  { id: 3, slug: 'design_grafico', displayName: 'Design gráfico', isSystem: true, isActive: true, acessoTotal: false, permissionKeys: [] },
  { id: 4, slug: 'editor_video', displayName: 'Editor de vídeo', isSystem: true, isActive: true, acessoTotal: false, permissionKeys: [] },
  { id: 5, slug: 'gestor_trafego', displayName: 'Gestor de tráfego', isSystem: true, isActive: true, acessoTotal: false, permissionKeys: ['client:manage'] },
  { id: 6, slug: 'estrategista_social', displayName: 'Estrategista de social media', isSystem: true, isActive: true, acessoTotal: false, permissionKeys: ['client:manage', 'event:manage'] },
  { id: 7, slug: 'jornalista', displayName: 'Jornalista', isSystem: true, isActive: true, acessoTotal: false, permissionKeys: ['event:manage'] },
]

export interface DbStatus {
  slug: string
  displayName: string
  color: string
  order: number
  isTerminal: boolean
}

export const STATUSES: DbStatus[] = [
  { slug: 'nao_iniciado', displayName: 'Não iniciado', color: '#94a3b8', order: 0, isTerminal: false },
  { slug: 'em_andamento', displayName: 'Em andamento', color: '#3b82f6', order: 1, isTerminal: false },
  { slug: 'em_revisao', displayName: 'Em revisão', color: '#f59e0b', order: 2, isTerminal: false },
  { slug: 'concluido', displayName: 'Concluído', color: '#10b981', order: 3, isTerminal: true },
  { slug: 'cancelado', displayName: 'Cancelado', color: '#6b7280', order: 4, isTerminal: true },
]

export interface DbTaskType {
  id: number
  slug: string
  displayName: string
  color: string
  defaultRoleId: number | null
  isActive: boolean
}

export const TASK_TYPES: DbTaskType[] = [
  { id: 1, slug: 'post_feed', displayName: 'Post de feed', color: '#ec4899', defaultRoleId: 3, isActive: true },
  { id: 2, slug: 'stories', displayName: 'Stories', color: '#f472b6', defaultRoleId: 3, isActive: true },
  { id: 3, slug: 'carrossel', displayName: 'Carrossel', color: '#f43f5e', defaultRoleId: 3, isActive: true },
  { id: 4, slug: 'estatico', displayName: 'Estático', color: '#fb7185', defaultRoleId: 3, isActive: true },
  { id: 5, slug: 'video_reels', displayName: 'Vídeo / Reels', color: '#8b5cf6', defaultRoleId: 4, isActive: true },
  { id: 6, slug: 'landing_page', displayName: 'Landing page', color: '#06b6d4', defaultRoleId: 2, isActive: true },
  { id: 7, slug: 'materia', displayName: 'Matéria / Pauta', color: '#14b8a6', defaultRoleId: 7, isActive: true },
  { id: 8, slug: 'campanha_trafego', displayName: 'Campanha de tráfego', color: '#f97316', defaultRoleId: 5, isActive: true },
  { id: 9, slug: 'relatorio', displayName: 'Relatório', color: '#64748b', defaultRoleId: 5, isActive: true },
  { id: 10, slug: 'planejamento', displayName: 'Planejamento', color: '#a855f7', defaultRoleId: 6, isActive: true },
  { id: 11, slug: 'cronograma', displayName: 'Cronograma', color: '#eab308', defaultRoleId: 6, isActive: true },
  { id: 12, slug: 'interno', displayName: 'Interno', color: '#94a3b8', defaultRoleId: null, isActive: true },
]

/* ------------------------------------------------------------------ pessoas */

export interface DbUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  birthday: string | null
  isActive: boolean
  isAdmin: boolean
  roleId: number
  extraRoleIds: number[]
}

const u = (
  id: string,
  name: string,
  roleId: number,
  birthday: string | null,
  extra: Partial<DbUser> = {},
): DbUser => ({
  id,
  name,
  email: `${name.split(' ')[0]!.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}@agenciaexemplo.com.br`,
  avatarUrl: null,
  birthday,
  isActive: true,
  isAdmin: false,
  roleId,
  extraRoleIds: [],
  ...extra,
})

export const USERS: DbUser[] = [
  u(ME_ID, 'Júlia Ramos', 1, '1991-03-18', { isAdmin: true, extraRoleIds: [6] }),
  u('u-otavio', 'Otávio Bezerra', 1, '1988-06-02'),
  u('u-larissa', 'Larissa Moura', 3, aniversario(1997, 6)),
  u('u-caio', 'Caio Teixeira', 3, '1999-01-27'),
  u('u-renan', 'Renan Furtado', 4, '1995-11-09'),
  u('u-sabrina', 'Sabrina Lopes', 4, aniversario(1998, 15)),
  u('u-natalia', 'Natália Freire', 5, '1993-07-21'),
  u('u-igor', 'Igor Sampaio', 6, '1996-02-14'),
  u('u-beatriz', 'Beatriz Holanda', 6, '1994-12-05'),
  u('u-fernanda', 'Fernanda Quintela', 7, '1990-09-30'),
  u('u-andre', 'André Mota', 2, '1992-04-11'),
  u('u-vinicius', 'Vinícius Paiva', 3, null, { isActive: false }),
]

/* ------------------------------------------------------------------ clientes */

export interface DbSection {
  sectionType: string
  title: string
  content: Record<string, unknown>
  updatedAt: string
}

export interface DbAcesso {
  id: string
  platform: string
  label: string | null
  username: string | null
  password: string | null
  phone: string | null
  notes: string | null
}

export interface DbClient {
  id: string
  name: string
  segment: string | null
  logoUrl: string | null
  status: 'ativo' | 'pausado' | 'encerrado'
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  anniversary: string | null
  createdAt: string
  socialMediaIds: string[]
  sections: DbSection[]
  acessos: DbAcesso[]
}

const c = (id: string, name: string, segment: string, extra: Partial<DbClient> = {}): DbClient => ({
  id,
  name,
  segment,
  logoUrl: null,
  status: 'ativo',
  contactName: null,
  contactEmail: null,
  contactPhone: null,
  anniversary: null,
  createdAt: dia(-420),
  socialMediaIds: [],
  sections: [],
  acessos: [],
  ...extra,
})

export const CLIENTS: DbClient[] = [
  c('c-trigo', 'Padaria Trigo Dourado', 'Alimentação', {
    contactName: 'Sr. Wagner',
    contactEmail: 'contato@trigodourado.exemplo',
    contactPhone: '(85) 98800-1201',
    anniversary: aniversario(2009, 9),
    createdAt: dia(-610),
    socialMediaIds: ['u-igor'],
    sections: [
      {
        sectionType: 'briefing',
        title: 'Briefing',
        updatedAt: dia(-41),
        content: {
          perguntas: [...PERGUNTAS_PADRAO],
          finalizado: true,
          respostas: {
            'p-historia-1': 'Começou como padaria de bairro em 2009. A virada foi o delivery em 2020, que levou a marca para fora do bairro.',
            'p-dna-1': '17 anos de mercado, três lojas, cerca de 1.200 pães de fermentação natural por dia.',
            'p-objetivos-1': 'Nos próximos 90 dias, crescer as encomendas de bolo para festas. Em 12 meses, abrir a quarta loja com fila na porta.',
            'p-objetivos-2': 'Bolos por encomenda, ticket médio de R$ 180. Meta de 30% de crescimento até dezembro.',
            'p-persona-1': 'Famílias da região. A objeção é o preço comparado ao supermercado.',
            'p-canais-1': 'Do Instagram para o WhatsApp da loja; quem atende é a equipe do balcão.',
            'p-voz-1': 'Fala como no balcão: "fornada", "feito hoje", "receita da casa". Nada de "promoção imperdível".',
            'p-concorrentes-1': 'As padarias de rede do shopping. Admiram a comunicação de cafeterias artesanais.',
            'p-idv-1': 'Tradição e calor. A identidade atual funciona; só falta padronizar as fotos.',
          },
        },
      },
      {
        sectionType: 'historia',
        title: 'História do cliente',
        updatedAt: dia(-40),
        content: {
          texto:
            'Padaria de bairro aberta em 2009 pelo casal Wagner e Rosa, que começou vendendo pão de fermentação natural para os vizinhos. Hoje são **três lojas** e uma linha de bolos por encomenda.\n\nO ponto de virada foi a entrega por aplicativo durante 2020: o delivery virou 40% do faturamento e a marca passou a ser conhecida fora do bairro.',
        },
      },
      {
        sectionType: 'objetivos',
        title: 'Objetivos e estratégia',
        updatedAt: dia(-38),
        content: {
          texto:
            '- Aumentar as encomendas de bolos para festas em 30% até dezembro\n- Fortalecer o Instagram como vitrine da linha de fermentação natural\n- Divulgar a quarta loja, prevista para o primeiro semestre',
        },
      },
      {
        sectionType: 'persona',
        title: 'Persona',
        updatedAt: dia(-35),
        content: {
          texto:
            'Mães e pais de 30 a 50 anos, moradores da região, que valorizam produto artesanal e compram para a família. Encomendam bolo para aniversário com uma semana de antecedência e decidem pelo Instagram.',
        },
      },
      {
        sectionType: 'brand_voice',
        title: 'Tom de voz',
        updatedAt: dia(-35),
        content: {
          texto: 'Acolhedor e caseiro, como quem conversa no balcão. Frases curtas, sem gíria de internet.',
          greenlist: ['fornada', 'feito hoje', 'receita da casa', 'quentinho'],
          redlist: ['industrializado', 'promoção imperdível', 'corre que acaba'],
        },
      },
      {
        sectionType: 'swot',
        title: 'Análise SWOT',
        updatedAt: dia(-30),
        content: {
          forcas: ['Fermentação natural como diferencial', 'Clientela fiel no bairro'],
          fraquezas: ['Fotos de produto feitas no celular', 'Pouca presença no Google'],
          oportunidades: ['Encomendas para festas corporativas', 'Kits de café da manhã em datas comemorativas'],
          ameacas: ['Redes de supermercado com padaria própria'],
        },
      },
      {
        sectionType: 'idv',
        title: 'IDV — identidade visual',
        updatedAt: dia(-30),
        content: { fonte: 'Fraunces e Work Sans', cores: ['#7a4a1f', '#f3d9a4', '#2f2a26'] },
      },
    ],
    acessos: [
      { id: 'a-trigo-ig', platform: 'instagram', label: 'Perfil principal', username: '@trigodourado.exemplo', password: 'demo', phone: null, notes: null },
      { id: 'a-trigo-fb', platform: 'facebook', label: 'Página e gerenciador de anúncios', username: 'marketing@trigodourado.exemplo', password: 'demo', phone: null, notes: 'Acesso de anunciante liberado para a agência.' },
    ],
  }),
  c('c-sorriso', 'Clínica Sorriso Pleno', 'Odontologia', {
    contactName: 'Dra. Patrícia',
    contactEmail: 'recepcao@sorrisopleno.exemplo',
    contactPhone: '(85) 99710-3344',
    createdAt: dia(-380),
    socialMediaIds: ['u-beatriz'],
    sections: [
      {
        sectionType: 'historia',
        title: 'História do cliente',
        updatedAt: dia(-60),
        content: { texto: 'Clínica fundada em 2015 com foco em ortodontia e estética. Atende convênios e particular, com duas unidades.' },
      },
    ],
  }),
  c('c-horizonte', 'Imobiliária Horizonte', 'Imobiliário', {
    contactName: 'Mariana',
    contactPhone: '(85) 98123-4455',
    createdAt: dia(-300),
    socialMediaIds: ['u-igor'],
  }),
  c('c-pulso', 'Academia Pulso Forte', 'Fitness', {
    contactName: 'Rodrigo',
    anniversary: aniversario(2018, 3),
    createdAt: dia(-250),
    socialMediaIds: ['u-beatriz'],
  }),
  c('c-visao', 'Ótica Visão Clara', 'Varejo óptico', {
    contactName: 'Sônia',
    createdAt: dia(-200),
    socialMediaIds: ['u-igor'],
  }),
  c('c-passos', 'Escola Pequenos Passos', 'Educação infantil', {
    contactName: 'Coordenação pedagógica',
    createdAt: dia(-160),
    socialMediaIds: ['u-beatriz'],
  }),
  c('c-alicerce', 'Construtora Alicerce', 'Construção civil', {
    status: 'pausado',
    contactName: 'Eng. Fábio',
    createdAt: dia(-500),
  }),
  c('c-serra', 'Café Serra Azul', 'Cafeteria', {
    contactName: 'Lúcia',
    createdAt: dia(-120),
    socialMediaIds: ['u-igor', 'u-beatriz'],
  }),
  c('c-camila', 'Dra. Camila Arruda · Dermatologia', 'Saúde', {
    contactName: 'Dra. Camila',
    createdAt: dia(-90),
    socialMediaIds: ['u-beatriz'],
  }),
  c('c-amigo', 'Pet Shop Amigo Fiel', 'Pet', { status: 'encerrado', createdAt: dia(-700) }),
]

/* ------------------------------------------------------------------ etiquetas */

export interface DbLabel {
  id: string
  name: string
  color: string
}

export const LABELS: DbLabel[] = [
  { id: 'l-outubro', name: 'Campanha de outubro', color: '#d4af4a' },
  { id: 'l-aprovacao', name: 'Aprovação do cliente', color: '#2563eb' },
  { id: 'l-trafego', name: 'Tráfego pago', color: '#9333ea' },
  { id: 'l-black', name: 'Black Friday', color: '#db2777' },
  { id: 'l-refacao', name: 'Refação', color: '#dc2626' },
  { id: 'l-ano', name: '2026', color: '#64748b' },
]

/* ------------------------------------------------------------------ demandas */

export interface DbTask {
  id: string
  title: string
  description: string | null
  observations: string | null
  status: string
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  deadline: string
  taskTypeId: number
  clientId: string | null
  assigneeId: string | null
  queueRoleId: number | null
  createdById: string
  createdAt: string
  completedAt: string | null
  startedAt: string | null
  recurrenceId: string | null
  participantIds: string[]
  labelIds: string[]
}

interface Nova extends Partial<DbTask> {
  id: string
  title: string
  status: string
  deadline: string
  taskTypeId: number
}

function t(n: Nova): DbTask {
  const terminal = n.status === 'concluido' || n.status === 'cancelado'
  return {
    description: null,
    observations: null,
    priority: 'media',
    clientId: null,
    assigneeId: ME_ID,
    queueRoleId: null,
    createdById: 'u-otavio',
    createdAt: dia(-6, 9, 30),
    completedAt: terminal && n.status === 'concluido' ? dia(-1, 16, 20) : null,
    startedAt: n.status !== 'nao_iniciado' ? dia(-3, 10) : null,
    recurrenceId: null,
    participantIds: [],
    labelIds: [],
    ...n,
  }
}

/** As demandas que aparecem no quadro de quem está logado, mais as da equipe. */
export const TASKS: DbTask[] = [
  /* ---------- Não iniciado */
  t({
    id: 't-landing-bf',
    title: 'Landing page — Black Friday da Ótica Visão Clara',
    status: 'nao_iniciado',
    priority: 'alta',
    deadline: dia(4, 18),
    taskTypeId: 6,
    clientId: 'c-visao',
    assigneeId: 'u-andre',
    participantIds: [ME_ID],
    createdById: ME_ID,
    labelIds: ['l-black'],
    description:
      'Página única para a campanha de Black Friday, com contagem regressiva e formulário de captura.\n\n- Hero com a oferta principal (armações com 40% off)\n- Grade de produtos em destaque\n- Formulário: nome, WhatsApp e loja preferida\n\nReferência de layout na pasta da campanha no Drive.',
  }),
  t({
    id: 't-planejamento-nov',
    title: 'Planejamento de conteúdo de novembro — Café Serra Azul',
    status: 'nao_iniciado',
    priority: 'media',
    deadline: dia(6, 18),
    taskTypeId: 10,
    clientId: 'c-serra',
    createdById: 'u-otavio',
    labelIds: ['l-ano'],
  }),
  t({
    id: 't-reuniao-pauta',
    title: 'Pauta da reunião mensal com a Clínica Sorriso Pleno',
    status: 'nao_iniciado',
    priority: 'baixa',
    deadline: dia(2, 14),
    taskTypeId: 12,
    clientId: 'c-sorriso',
    createdById: ME_ID,
  }),
  t({
    id: 't-relatorio-pulso',
    title: 'Relatório de resultados de setembro — Academia Pulso Forte',
    status: 'nao_iniciado',
    priority: 'alta',
    deadline: dia(-1, 18),
    taskTypeId: 9,
    clientId: 'c-pulso',
    createdById: 'u-otavio',
    labelIds: ['l-trafego'],
  }),

  /* ---------- Em andamento */
  t({
    id: 't-post-outubro',
    title: 'Post Instagram — campanha de outubro',
    status: 'em_andamento',
    priority: 'urgente',
    deadline: dia(0, 17),
    taskTypeId: 1,
    clientId: 'c-trigo',
    createdById: 'u-igor',
    participantIds: ['u-larissa'],
    labelIds: ['l-outubro', 'l-aprovacao'],
    description:
      'Post de abertura da campanha **"Outubro da fornada"**: a padaria completa 17 anos e vai sortear uma cesta de café da manhã por semana.\n\nLegenda aprovada pelo cliente no grupo. Arte no padrão da campanha, com a foto da vitrine feita na captação.',
    observations: 'Publicar até as 18h. O cliente pediu para marcar o perfil das três lojas.',
  }),
  t({
    id: 't-cronograma-semana',
    title: 'Cronograma da semana — Padaria Trigo Dourado',
    status: 'em_andamento',
    priority: 'alta',
    deadline: dia(3, 18),
    taskTypeId: 11,
    clientId: 'c-trigo',
    createdById: ME_ID,
    participantIds: ['u-larissa', 'u-renan', 'u-igor'],
    labelIds: ['l-outubro'],
    description: 'As peças da semana da campanha de outubro. Cada item tem dono, data e briefing próprios.',
  }),
  t({
    id: 't-video-institucional',
    title: 'Vídeo institucional — Imobiliária Horizonte',
    status: 'em_andamento',
    priority: 'media',
    deadline: dia(8, 18),
    taskTypeId: 5,
    clientId: 'c-horizonte',
    assigneeId: 'u-renan',
    participantIds: [ME_ID],
    createdById: ME_ID,
    description:
      'Vídeo de 60 segundos para o site e o YouTube, com as imagens de drone dos três lançamentos.\n\n1. Abertura com a vista aérea do bairro\n2. Depoimento da diretora\n3. Encerramento com a assinatura da marca',
  }),
  t({
    id: 't-trafego-pulso',
    title: 'Campanha de tráfego — matrículas de fim de ano',
    status: 'em_andamento',
    priority: 'alta',
    deadline: dia(1, 12),
    taskTypeId: 8,
    clientId: 'c-pulso',
    createdById: 'u-natalia',
    labelIds: ['l-trafego'],
  }),

  /* ---------- Em revisão */
  t({
    id: 't-carrossel-dicas',
    title: 'Carrossel "5 cuidados com o aparelho ortodôntico"',
    status: 'em_revisao',
    priority: 'media',
    deadline: dia(1, 18),
    taskTypeId: 3,
    clientId: 'c-sorriso',
    createdById: 'u-beatriz',
    participantIds: ['u-caio'],
    labelIds: ['l-aprovacao'],
  }),
  t({
    id: 't-materia-escola',
    title: 'Matéria para o blog: semana da criança na escola',
    status: 'em_revisao',
    priority: 'baixa',
    deadline: dia(2, 18),
    taskTypeId: 7,
    clientId: 'c-passos',
    createdById: 'u-fernanda',
  }),
  t({
    id: 't-stories-serra',
    title: 'Stories — lançamento do café coado da casa',
    status: 'em_revisao',
    priority: 'media',
    deadline: dia(-2, 18),
    taskTypeId: 2,
    clientId: 'c-serra',
    createdById: 'u-igor',
    recurrenceId: 'r-stories',
  }),

  /* ---------- Concluído / cancelado */
  t({
    id: 't-calendario-out',
    title: 'Calendário editorial de outubro — Dra. Camila Arruda',
    status: 'concluido',
    deadline: dia(-3, 18),
    taskTypeId: 10,
    clientId: 'c-camila',
    completedAt: dia(-4, 15, 10),
  }),
  t({
    id: 't-briefing-alicerce',
    title: 'Briefing de reposicionamento — Construtora Alicerce',
    status: 'concluido',
    deadline: dia(-5, 18),
    taskTypeId: 10,
    clientId: 'c-alicerce',
    completedAt: dia(-5, 11, 40),
  }),
  t({
    id: 't-onboarding-camila',
    title: 'Onboarding da nova cliente: kickoff e acessos',
    status: 'concluido',
    deadline: dia(-8, 18),
    taskTypeId: 12,
    clientId: 'c-camila',
    completedAt: dia(-9, 17, 5),
  }),
  t({
    id: 't-ensaio-cancelado',
    title: 'Ensaio fotográfico das novas armações',
    status: 'cancelado',
    priority: 'baixa',
    deadline: dia(-4, 10),
    taskTypeId: 12,
    clientId: 'c-visao',
  }),

  /* ---------- Criadas por mim para a equipe */
  t({
    id: 't-estatico-promo',
    title: 'Estático — promoção de bolos para festas',
    status: 'nao_iniciado',
    priority: 'media',
    deadline: dia(2, 12),
    taskTypeId: 4,
    clientId: 'c-trigo',
    assigneeId: 'u-caio',
    createdById: ME_ID,
    labelIds: ['l-outubro'],
  }),
  t({
    id: 't-reels-academia',
    title: 'Reels — tour pela nova área de musculação',
    status: 'em_andamento',
    priority: 'alta',
    deadline: dia(1, 18),
    taskTypeId: 5,
    clientId: 'c-pulso',
    assigneeId: 'u-sabrina',
    createdById: ME_ID,
  }),
  t({
    id: 't-anuncio-escola',
    title: 'Anúncios de rematrícula 2027 — Escola Pequenos Passos',
    status: 'em_revisao',
    priority: 'alta',
    deadline: dia(0, 19),
    taskTypeId: 8,
    clientId: 'c-passos',
    assigneeId: 'u-natalia',
    createdById: ME_ID,
    labelIds: ['l-trafego', 'l-aprovacao'],
  }),
  t({
    id: 't-post-dermato',
    title: 'Post de feed — protetor solar no dia a dia',
    status: 'nao_iniciado',
    priority: 'media',
    deadline: dia(3, 12),
    taskTypeId: 1,
    clientId: 'c-camila',
    assigneeId: 'u-larissa',
    createdById: 'u-beatriz',
  }),
  t({
    id: 't-pauta-imprensa',
    title: 'Pauta para imprensa: inauguração da terceira loja',
    status: 'em_andamento',
    priority: 'media',
    deadline: dia(5, 18),
    taskTypeId: 7,
    clientId: 'c-trigo',
    assigneeId: 'u-fernanda',
    createdById: 'u-otavio',
  }),
  t({
    id: 't-site-ajustes',
    title: 'Ajustes no site da Clínica Sorriso Pleno',
    status: 'em_andamento',
    priority: 'baixa',
    deadline: dia(9, 18),
    taskTypeId: 6,
    clientId: 'c-sorriso',
    assigneeId: 'u-andre',
    createdById: 'u-beatriz',
  }),

  /* ---------- Na fila de uma função, sem dono */
  t({
    id: 't-fila-aprovacao',
    title: 'Aprovar o calendário de novembro com o Café Serra Azul',
    status: 'nao_iniciado',
    priority: 'alta',
    deadline: dia(2, 18),
    taskTypeId: 10,
    clientId: 'c-serra',
    assigneeId: null,
    queueRoleId: 1,
    createdById: 'u-igor',
  }),
  t({
    id: 't-fila-design',
    title: 'Capa de destaque do Instagram — Academia Pulso Forte',
    status: 'nao_iniciado',
    priority: 'baixa',
    deadline: dia(4, 18),
    taskTypeId: 4,
    clientId: 'c-pulso',
    assigneeId: null,
    queueRoleId: 3,
    createdById: 'u-beatriz',
  }),
]

/* Histórico: o que a agência entregou nos últimos meses. Alimenta a busca,
   os gráficos da Administração e o histórico de cada cliente. */
const MOLDES: [string, number][] = [
  ['Post de feed — dica da semana', 1],
  ['Stories — bastidores da produção', 2],
  ['Carrossel educativo', 3],
  ['Arte de data comemorativa', 4],
  ['Reels com depoimento de cliente', 5],
  ['Relatório mensal de tráfego', 9],
  ['Campanha de remarketing', 8],
  ['Release para imprensa', 7],
  ['Planejamento mensal de conteúdo', 10],
  ['Ajuste de layout no site', 6],
]
const DONO_POR_TIPO: Record<number, string[]> = {
  1: ['u-larissa', 'u-caio'],
  2: ['u-larissa', 'u-caio'],
  3: ['u-caio', 'u-larissa'],
  4: ['u-caio', 'u-vinicius'],
  5: ['u-renan', 'u-sabrina'],
  6: ['u-andre'],
  7: ['u-fernanda'],
  8: ['u-natalia'],
  9: ['u-natalia'],
  10: ['u-igor', 'u-beatriz'],
}
const ATIVOS = CLIENTS.filter((x) => x.status !== 'encerrado')

for (let i = 0; i < 96; i++) {
  const [titulo, tipo] = escolher(MOLDES)
  const cliente = escolher(ATIVOS)
  const criadaHa = 4 + Math.floor(rand() * 100)
  const prazoEm = Math.floor(rand() * 8) + 1
  const atraso = rand() < 0.18 ? Math.floor(rand() * 3) + 1 : -Math.floor(rand() * 2)
  const cancelada = rand() < 0.04
  TASKS.push(
    t({
      id: `t-h${String(i).padStart(3, '0')}`,
      title: `${titulo} — ${cliente.name.split(' · ')[0]}`,
      status: cancelada ? 'cancelado' : 'concluido',
      priority: escolher(['baixa', 'media', 'media', 'alta'] as const),
      taskTypeId: tipo,
      clientId: cliente.id,
      assigneeId: escolher(DONO_POR_TIPO[tipo]!),
      createdById: escolher(['u-otavio', 'u-igor', 'u-beatriz', ME_ID]),
      createdAt: dia(-criadaHa, 9),
      deadline: dia(-criadaHa + prazoEm, 18),
      startedAt: dia(-criadaHa + 1, 10),
      completedAt: cancelada ? null : dia(-criadaHa + prazoEm + atraso, 15),
    }),
  )
}

/** Ordem manual do kanban: um rank global, como o rank fracionário do original. */
export const ORDEM: string[] = TASKS.map((x) => x.id)

/* ------------------------------------------------------------------ checklist */

export interface DbChecklistItem {
  id: string
  taskId: string
  content: string
  isDone: boolean
  position: number
  doneById: string | null
  doneAt: string | null
  startedAt: string | null
  reviewStatus: 'em_revisao' | 'aprovada' | 'reprovada' | null
  reviewNote: string | null
  reviewedById: string | null
  reviewedAt: string | null
  description: string | null
  assigneeId: string | null
  taskTypeId: number | null
  dueAt: string | null
  delivery: string | null
}

let pos = 0
const item = (taskId: string, content: string, extra: Partial<DbChecklistItem> = {}): DbChecklistItem => ({
  id: `ci-${++pos}`,
  taskId,
  content,
  isDone: false,
  position: pos,
  doneById: null,
  doneAt: null,
  startedAt: null,
  reviewStatus: null,
  reviewNote: null,
  reviewedById: null,
  reviewedAt: null,
  description: null,
  assigneeId: null,
  taskTypeId: null,
  dueAt: null,
  delivery: null,
  ...extra,
})

export const CHECKLIST: DbChecklistItem[] = [
  item('t-post-outubro', 'Arte aprovada pelo cliente', { isDone: true, doneById: 'u-larissa', doneAt: haMin(150) }),
  item('t-post-outubro', 'Legenda revisada', { isDone: true, doneById: ME_ID, doneAt: haMin(95) }),
  item('t-post-outubro', 'Agendar no Meta Business Suite'),
  item('t-post-outubro', 'Responder os primeiros comentários'),

  item('t-landing-bf', 'Wireframe aprovado'),
  item('t-landing-bf', 'Textos finais do cliente'),
  item('t-landing-bf', 'Integração do formulário com o CRM'),

  item('t-trafego-pulso', 'Públicos salvos', { isDone: true, doneById: ME_ID, doneAt: haMin(60 * 22) }),
  item('t-trafego-pulso', 'Criativos no gerenciador', { isDone: true, doneById: ME_ID, doneAt: haMin(40) }),
  item('t-trafego-pulso', 'Pixel conferido'),

  item('t-relatorio-pulso', 'Exportar dados do gerenciador'),
  item('t-relatorio-pulso', 'Comparativo com agosto'),

  /* O cronograma: cada peça com dono, tipo, data e briefing. */
  item('t-cronograma-semana', 'Post de abertura da campanha', {
    assigneeId: 'u-larissa',
    taskTypeId: 1,
    dueAt: dia(0, 12),
    isDone: true,
    doneById: 'u-larissa',
    doneAt: haMin(200),
    startedAt: haMin(60 * 26),
    reviewStatus: 'aprovada',
    reviewedById: ME_ID,
    reviewedAt: haMin(170),
    description: 'Foto da vitrine com o selo dos 17 anos. Legenda no documento da campanha.',
    delivery: 'Arte final na pasta Outubro/Semana 2 do Drive.',
  }),
  item('t-cronograma-semana', 'Reels — a fornada das 6h', {
    assigneeId: 'u-renan',
    taskTypeId: 5,
    dueAt: dia(1, 18),
    startedAt: haMin(60 * 5),
    description: 'Vídeo vertical de 30s com as imagens da captação de terça. Trilha calma, sem locução.',
  }),
  item('t-cronograma-semana', 'Stories — enquete do sabor da semana', {
    assigneeId: 'u-larissa',
    taskTypeId: 2,
    dueAt: dia(2, 10),
    isDone: true,
    doneById: 'u-larissa',
    doneAt: haMin(35),
    startedAt: haMin(90),
    reviewStatus: 'em_revisao',
    description: 'Três telas: pergunta, opções (broa de milho, pão de queijo, sonho) e chamada para a loja.',
  }),
  item('t-cronograma-semana', 'Carrossel — como nasce o pão de fermentação natural', {
    assigneeId: 'u-caio',
    taskTypeId: 3,
    dueAt: dia(3, 12),
    description: 'Seis cards com o passo a passo, do levain ao forno. Fotos da captação.',
  }),
  item('t-cronograma-semana', 'Legendas e agendamento da semana', {
    assigneeId: 'u-igor',
    taskTypeId: 10,
    dueAt: dia(3, 17),
  }),
]

/* ------------------------------------------------------------------ comentários, histórico e anexos */

export interface DbComment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
  editado: boolean
}

export const COMMENTS: DbComment[] = [
  { id: 'cm-1', taskId: 't-post-outubro', authorId: 'u-larissa', content: 'Subi a arte na pasta da campanha. Fiz duas versões do selo dos 17 anos, a segunda com o fundo mais claro.', createdAt: haMin(180), editado: false },
  { id: 'cm-2', taskId: 't-post-outubro', authorId: ME_ID, content: 'Cliente aprovou a **segunda versão**. Pode seguir com ela.', createdAt: haMin(150), editado: false },
  { id: 'cm-3', taskId: 't-post-outubro', authorId: 'u-igor', content: 'Legenda final:\n\n> Há 17 anos a primeira fornada sai às 6h. Em outubro, quem comemora é você: toda semana sorteamos uma cesta de café da manhã.', createdAt: haMin(100), editado: true },
  { id: 'cm-4', taskId: 't-landing-bf', authorId: 'u-andre', content: 'Vou precisar das fotos das armações em fundo branco. O cliente consegue mandar até quinta?', createdAt: haMin(60 * 20), editado: false },
  { id: 'cm-5', taskId: 't-video-institucional', authorId: 'u-renan', content: 'Primeiro corte pronto, 1min12s. Falta a trilha e a assinatura no final.', createdAt: haMin(60 * 6), editado: false },
  { id: 'cm-6', taskId: 't-carrossel-dicas', authorId: 'u-caio', content: 'Arte na revisão. Ajustei as cores para a paleta nova da clínica.', createdAt: haMin(60 * 3), editado: false },
  { id: 'cm-7', taskId: 't-cronograma-semana', authorId: 'u-renan', content: 'Comecei o reels da fornada. Usando as tomadas da porta do forno.', createdAt: haMin(60 * 5), editado: false },
]

export interface DbActivity {
  id: string
  taskId: string
  userId: string
  action: string
  oldValue: unknown
  newValue: unknown
  createdAt: string
}

export const ACTIVITY: DbActivity[] = []
for (const x of TASKS.slice(0, 24)) {
  ACTIVITY.push({ id: `ac-${x.id}-c`, taskId: x.id, userId: x.createdById, action: 'criada', oldValue: null, newValue: null, createdAt: x.createdAt })
  if (x.status !== 'nao_iniciado') {
    ACTIVITY.push({
      id: `ac-${x.id}-s`,
      taskId: x.id,
      userId: x.assigneeId ?? x.createdById,
      action: 'status_alterado',
      oldValue: { status: 'Não iniciado' },
      newValue: { status: STATUSES.find((s) => s.slug === x.status)!.displayName },
      createdAt: x.completedAt ?? x.startedAt ?? x.createdAt,
    })
  }
}

export interface DbAttachment {
  id: string
  taskId: string
  fileKey: string
  fileName: string
  mimeType: string
  fileSize: number
  createdAt: string
  checklistItemId: string | null
  uploadedById: string
}

export const ATTACHMENTS: DbAttachment[] = [
  { id: 'at-1', taskId: 't-post-outubro', fileKey: 'demo/briefing-outubro.pdf', fileName: 'briefing-campanha-outubro.pdf', mimeType: 'application/pdf', fileSize: 482_133, createdAt: haMin(60 * 30), checklistItemId: null, uploadedById: 'u-igor' },
  { id: 'at-2', taskId: 't-post-outubro', fileKey: 'demo/legenda.docx', fileName: 'legendas-semana-2.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 24_380, createdAt: haMin(110), checklistItemId: null, uploadedById: 'u-igor' },
  { id: 'at-3', taskId: 't-landing-bf', fileKey: 'demo/wireframe.pdf', fileName: 'wireframe-landing-black-friday.pdf', mimeType: 'application/pdf', fileSize: 1_204_551, createdAt: haMin(60 * 26), checklistItemId: null, uploadedById: 'u-andre' },
]

/* ------------------------------------------------------------------ calendário */

export interface DbEvent {
  id: string
  title: string
  description: string | null
  eventType: string
  startAt: string
  endAt: string
  allDay: boolean
  location: string | null
  clientId: string | null
  attendeeIds: string[]
}

export const EVENTS: DbEvent[] = [
  { id: 'ev-1', title: 'Captação de fotos — Padaria Trigo Dourado', description: 'Fotos de produto e da equipe para a campanha de outubro.', eventType: 'captacao', startAt: dia(1, 7, 30), endAt: dia(1, 10, 0), allDay: false, location: 'Loja do Centro', clientId: 'c-trigo', attendeeIds: ['u-renan', 'u-larissa'] },
  { id: 'ev-2', title: 'Reunião de resultados — Academia Pulso Forte', description: null, eventType: 'reuniao', startAt: dia(2, 15, 0), endAt: dia(2, 16, 0), allDay: false, location: 'Google Meet', clientId: 'c-pulso', attendeeIds: [ME_ID, 'u-natalia'] },
  { id: 'ev-3', title: 'Gravação do vídeo institucional', description: 'Depoimento da diretora e imagens internas.', eventType: 'captacao', startAt: dia(4, 9, 0), endAt: dia(4, 12, 0), allDay: false, location: 'Sede da Imobiliária Horizonte', clientId: 'c-horizonte', attendeeIds: ['u-renan', 'u-sabrina', ME_ID] },
  { id: 'ev-4', title: 'Alinhamento semanal da equipe', description: null, eventType: 'reuniao', startAt: dia(5, 9, 0), endAt: dia(5, 9, 45), allDay: false, location: 'Sala de reunião', clientId: null, attendeeIds: USERS.filter((x) => x.isActive).map((x) => x.id) },
  { id: 'ev-5', title: 'Entrevista na rádio — Dra. Camila Arruda', description: 'Acompanhar a cliente na entrevista sobre cuidados com a pele no verão.', eventType: 'assessoria_imprensa', startAt: dia(9, 10, 0), endAt: dia(9, 11, 0), allDay: false, location: 'Rádio Litoral FM', clientId: 'c-camila', attendeeIds: ['u-fernanda'] },
  { id: 'ev-6', title: 'Feira de imóveis', description: null, eventType: 'evento', startAt: dia(13, 9, 0), endAt: dia(13, 18, 0), allDay: false, location: 'Centro de Eventos', clientId: 'c-horizonte', attendeeIds: ['u-renan', 'u-igor'] },
  { id: 'ev-7', title: 'Reunião de kickoff — Café Serra Azul', description: null, eventType: 'reuniao', startAt: dia(-6, 14, 0), endAt: dia(-6, 15, 0), allDay: false, location: 'Na cafeteria', clientId: 'c-serra', attendeeIds: [ME_ID, 'u-igor'] },
  { id: 'ev-8', title: 'Captação — treino funcional ao ar livre', description: null, eventType: 'captacao', startAt: dia(-3, 6, 30), endAt: dia(-3, 8, 0), allDay: false, location: 'Praça do bairro', clientId: 'c-pulso', attendeeIds: ['u-sabrina'] },
]

/** Feriados nacionais de data fixa, no ano de qualquer data. */
export const FERIADOS: [number, number, string][] = [
  [1, 1, 'Confraternização Universal'],
  [4, 21, 'Tiradentes'],
  [5, 1, 'Dia do Trabalho'],
  [9, 7, 'Independência do Brasil'],
  [10, 12, 'Nossa Senhora Aparecida'],
  [11, 2, 'Finados'],
  [11, 15, 'Proclamação da República'],
  [11, 20, 'Dia da Consciência Negra'],
  [12, 25, 'Natal'],
]

/* ------------------------------------------------------------------ avisos */

export interface DbNotification {
  id: string
  type: string
  taskId: string | null
  actorId: string | null
  payload: Record<string, unknown>
  readAt: string | null
  createdAt: string
}

export const NOTIFICATIONS: DbNotification[] = [
  { id: 'n-1', type: 'comentario', taskId: 't-post-outubro', actorId: 'u-igor', payload: {}, readAt: null, createdAt: haMin(100) },
  { id: 'n-2', type: 'nova_demanda', taskId: 't-planejamento-nov', actorId: 'u-otavio', payload: {}, readAt: null, createdAt: haMin(60 * 4) },
  { id: 'n-3', type: 'prazo_proximo', taskId: 't-trafego-pulso', actorId: null, payload: {}, readAt: null, createdAt: haMin(60 * 6) },
  { id: 'n-4', type: 'status_alterado', taskId: 't-carrossel-dicas', actorId: 'u-caio', payload: {}, readAt: haMin(60 * 2), createdAt: haMin(60 * 3) },
  { id: 'n-5', type: 'demanda_concluida', taskId: 't-calendario-out', actorId: 'u-beatriz', payload: {}, readAt: haMin(60 * 50), createdAt: haMin(60 * 98) },
  { id: 'n-6', type: 'demanda_atrasada', taskId: 't-stories-serra', actorId: null, payload: {}, readAt: haMin(60 * 20), createdAt: haMin(60 * 30) },
]

/* ------------------------------------------------------------------ recorrências */

export interface DbRecurrence {
  id: string
  template: {
    title: string
    description?: string | null
    taskTypeId: number
    clientId?: string | null
    assigneeId: string
    priority: string
    observations?: string | null
    porResponsavelDeClientes?: boolean
    checklistDeVerificacao?: boolean
  }
  rrule: string
  leadTimeDays: number
  deadlineTime: string
  isActive: boolean
  lastRunAt: string | null
  createdBy: string
  createdAt: string
}

export const RECURRENCES: DbRecurrence[] = [
  {
    id: 'r-cronograma',
    template: { title: 'Cronograma semanal de conteúdo', taskTypeId: 11, assigneeId: ME_ID, priority: 'alta', porResponsavelDeClientes: true },
    rrule: 'FREQ=WEEKLY;BYDAY=MO',
    leadTimeDays: 3,
    deadlineTime: '18:00',
    isActive: true,
    lastRunAt: dia(-3, 6),
    createdBy: ME_ID,
    createdAt: dia(-90),
  },
  {
    id: 'r-stories',
    template: { title: 'Stories — lançamento do café coado da casa', taskTypeId: 2, clientId: 'c-serra', assigneeId: ME_ID, priority: 'media' },
    rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
    leadTimeDays: 1,
    deadlineTime: '18:00',
    isActive: true,
    lastRunAt: dia(-2, 6),
    createdBy: 'u-igor',
    createdAt: dia(-45),
  },
  {
    id: 'r-relatorio',
    template: { title: 'Relatório mensal de tráfego — Academia Pulso Forte', taskTypeId: 9, clientId: 'c-pulso', assigneeId: 'u-natalia', priority: 'alta' },
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=5',
    leadTimeDays: 2,
    deadlineTime: '12:00',
    isActive: true,
    lastRunAt: dia(-4, 6),
    createdBy: ME_ID,
    createdAt: dia(-200),
  },
  {
    id: 'r-conferencia',
    template: { title: 'Conferência das entregas da semana', taskTypeId: 12, assigneeId: 'u-otavio', priority: 'media', checklistDeVerificacao: true },
    rrule: 'FREQ=WEEKLY;BYDAY=FR',
    leadTimeDays: 0,
    deadlineTime: '17:00',
    isActive: true,
    lastRunAt: dia(-5, 6),
    createdBy: ME_ID,
    createdAt: dia(-60),
  },
  {
    id: 'r-blog',
    template: { title: 'Post para o blog da Escola Pequenos Passos', taskTypeId: 7, clientId: 'c-passos', assigneeId: 'u-fernanda', priority: 'baixa' },
    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH',
    leadTimeDays: 4,
    deadlineTime: '18:00',
    isActive: false,
    lastRunAt: dia(-30, 6),
    createdBy: 'u-otavio',
    createdAt: dia(-150),
  },
]

/* ------------------------------------------------------------------ delegação */

/** "de-para" das funções: quem cria (linha) para quem recebe (coluna). */
export const DELEGACAO = new Set<string>(
  [
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
    [6, 3], [6, 4], [6, 7],
    [5, 3],
    [7, 3],
  ].map(([a, b]) => `${a}-${b}`),
)
