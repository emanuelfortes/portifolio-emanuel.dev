/**
 * Status e prioridades.
 *
 * Correção 5.5: status NÃO é enum nativo do Postgres. Vive na tabela
 * `task_statuses` com ordem e cor, para poder ser renomeado sem migração.
 * Estas constantes são apenas os slugs do seed, usados em regra de negócio
 * (ex: "atrasado" ignora concluído e cancelado).
 */
export const TASK_STATUS = {
  NAO_INICIADO: 'nao_iniciado',
  EM_ANDAMENTO: 'em_andamento',
  EM_REVISAO: 'em_revisao',
  CONCLUIDO: 'concluido',
  CANCELADO: 'cancelado',
} as const

export type TaskStatusSlug = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

/** Status que encerram a demanda: não contam para atraso nem para carga de trabalho. */
export const TERMINAL_STATUSES: readonly string[] = [
  TASK_STATUS.CONCLUIDO,
  TASK_STATUS.CANCELADO,
]

/**
 * Slug do tipo "Cronograma": a demanda de equipe cujos itens do checklist têm
 * responsável, tipo, data e briefing próprios. A tela troca o checklist
 * simples pela lista em acordeão quando a demanda é deste tipo.
 *
 * É dado (linha em `task_types`, criada pela migration 0012 e pelo seed), não
 * código; o slug é o contrato entre os dois lados.
 */
export const TASK_TYPE_CRONOGRAMA = 'cronograma'

/** A revisão de uma peça do cronograma. Nulo = nunca foi marcada. */
export const PECA_REVIEW = {
  EM_REVISAO: 'em_revisao',
  APROVADA: 'aprovada',
  REPROVADA: 'reprovada',
} as const
export type PecaReview = (typeof PECA_REVIEW)[keyof typeof PECA_REVIEW]

/**
 * Os sons dos avisos de peça, que cada pessoa escolhe para si.
 *
 * Os arquivos ficam em `apps/web/public/audio`. Pôr um som novo é pôr o
 * arquivo lá e uma linha aqui: o id vai para o banco, o nome para o select,
 * o arquivo para o `<audio>`. `nenhum` é a opção de silêncio e não tem
 * arquivo.
 */
export const SONS_DE_AVISO = [
  { id: 'notificacao', nome: 'Notificação', arquivo: '/demos/kanban-cev/audio/notificacao.mp3' },
  { id: 'ta-maluco', nome: 'Tá maluco', arquivo: '/demos/kanban-cev/audio/notificacao.mp3' },
  { id: 'homem-aranha', nome: 'Homem-Aranha', arquivo: '/demos/kanban-cev/audio/notificacao.mp3' },
] as const
export const SOM_NENHUM = 'nenhum'
/** Os ids que o banco aceita: os do catálogo e o silêncio. */
export const SONS_VALIDOS = ['notificacao', 'ta-maluco', 'homem-aranha', SOM_NENHUM] as const
export type SomDeAviso = (typeof SONS_VALIDOS)[number]
/** O que toca para quem nunca escolheu: `revisar` é de quem coordena, `ajustar` de quem fez. */
export const SOM_PADRAO = { revisar: 'notificacao', ajustar: 'ta-maluco' } as const satisfies Record<string, SomDeAviso>

export const TASK_PRIORITY = {
  BAIXA: 'baixa',
  MEDIA: 'media',
  ALTA: 'alta',
  URGENTE: 'urgente',
} as const

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY]

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgente: 0,
  alta: 1,
  media: 2,
  baixa: 3,
}

export const CLIENT_STATUS = {
  ATIVO: 'ativo',
  PAUSADO: 'pausado',
  ENCERRADO: 'encerrado',
} as const

export const EVENT_TYPE = {
  REUNIAO: 'reuniao',
  /**
   * Gravação externa: a equipe sai da agência e vai até o cliente.
   *
   * Tipo próprio, e não "evento genérico", por duas razões práticas: é o único
   * compromisso que exige deslocamento e equipamento, e por isso é o que mais
   * precisa de aviso antecipado — quem descobre na véspera não consegue
   * reservar o que precisa levar.
   */
  CAPTACAO: 'captacao',
  /** A equipe acompanha a cliente em entrevista, matéria ou gravação de terceiros. */
  ASSESSORIA_IMPRENSA: 'assessoria_imprensa',
  EVENTO: 'evento',
  FERIADO: 'feriado',
  DATA_IMPORTANTE: 'data_importante',
} as const

/**
 * Os compromissos que tiram a equipe da agência: os que têm cronômetro. É
 * neles que se confirma quem foi e se conta o tempo fora. Reunião fica de
 * fora por enquanto: a maioria é na agência ou por vídeo.
 */
export const EVENT_TYPES_EXTERNOS = [
  EVENT_TYPE.CAPTACAO,
  EVENT_TYPE.ASSESSORIA_IMPRENSA,
  EVENT_TYPE.EVENTO,
] as const

/**
 * As seções do onboarding do cliente, preenchidas uma vez e lidas pelo time.
 *
 * `BRIEFING` não é uma seção da tela: é onde ficam as PERGUNTAS e as RESPOSTAS
 * do cliente, num jsonb só. Cada pergunta aponta para a seção a que pertence,
 * e a página daquela seção mostra as suas — a entrevista acontece ao lado do
 * conteúdo que ela produz, não numa tela separada.
 */
export const PROFILE_SECTION_TYPE = {
  HISTORIA: 'historia',
  OBJETIVOS: 'objetivos',
  DNA: 'dna',
  ARQUETIPOS: 'arquetipos',
  PERSONA: 'persona',
  CANAIS_VENDAS: 'canais_vendas',
  BRAND_VOICE: 'brand_voice',
  CONCORRENTES: 'concorrentes',
  SWOT: 'swot',
  IDV: 'idv',
  LINKS: 'links',
  PROMPT_CONTEUDO: 'prompt_conteudo',
  BRIEFING: 'briefing',
  /**
   * As atas das reuniões com o cliente, em PDF.
   *
   * Guarda só metadado — `{ arquivos: [{ fileKey, fileName, fileSize }] }`. O
   * arquivo mora no S3 sob `clients/<id>/`, e a URL de leitura é assinada na
   * hora, nunca gravada: assinatura expira, e uma URL no banco viraria linha
   * que para de funcionar sozinha depois de uma hora.
   */
  ATAS: 'atas',
  OUTROS: 'outros',
} as const

/**
 * O BRIEFING ACEV de fábrica.
 *
 * Estas são as perguntas que TODO cliente novo recebe — o método da agência
 * escrito uma vez. A partir daí elas são dado do cliente: o social media
 * acrescenta, reescreve e remove as daquele cliente sem tocar aqui, e sem
 * deploy. Esta lista é só o ponto de partida.
 *
 * Cada pergunta declara a que bloco pertence, e o bloco é a própria seção do
 * onboarding — a resposta nasce colada no lugar onde vai virar conteúdo.
 *
 * Nem toda seção tem pergunta de fábrica: SWOT e Links se preenchem a partir
 * das outras respostas, não da entrevista.
 */
export const PERGUNTAS_PADRAO: readonly {
  id: string
  secao: string
  texto: string
  nota?: string
}[] = [
  {
    id: 'p-historia-1',
    secao: 'historia',
    texto: 'Como o negócio chegou até aqui? Qual foi o ponto de virada?',
  },
  {
    id: 'p-historia-2',
    secao: 'historia',
    texto:
      'Quais bastidores da operação são estratégicos para a marca mostrar, e o que é confidencial ou fora dos limites da comunicação?',
  },

  {
    id: 'p-dna-1',
    secao: 'dna',
    texto: 'Quais números e credenciais sustentam sua autoridade?',
    nota: 'Registrar todos: resultados, tempo de mercado, formações, clientes atendidos.',
  },
  {
    id: 'p-dna-2',
    secao: 'dna',
    texto:
      'O que você faria diferente no seu mercado? Em que ponto sua visão diverge da maioria?',
  },
  { id: 'p-dna-3', secao: 'dna', texto: 'Você trabalha com algum método próprio? Tem nome?' },

  {
    id: 'p-objetivos-1',
    secao: 'objetivos',
    texto:
      'Qual é o objetivo prioritário dos próximos 90 dias, e o que caracteriza sucesso em 12 meses?',
  },
  {
    id: 'p-objetivos-2',
    secao: 'objetivos',
    texto: 'Qual é a oferta principal, o ticket praticado e a meta de crescimento?',
  },

  {
    id: 'p-persona-1',
    secao: 'persona',
    texto: 'Quem é o cliente ideal e qual é a principal objeção que ele apresenta antes de fechar?',
  },

  {
    id: 'p-canais-1',
    secao: 'canais_vendas',
    texto:
      'Qual é a jornada desejada: a partir do conteúdo, que ação o público deve tomar e quem conduz o atendimento comercial?',
  },
  {
    id: 'p-canais-2',
    secao: 'canais_vendas',
    texto:
      'Quais iniciativas de marketing já foram executadas e o que os resultados mostraram? Existe investimento ativo em mídia paga?',
  },

  {
    id: 'p-arquetipos-1',
    secao: 'arquetipos',
    texto:
      'Três atributos que sua marca precisa transmitir e três que são inaceitáveis para o seu posicionamento.',
  },

  {
    id: 'p-voz-1',
    secao: 'brand_voice',
    texto:
      'Como é a sua comunicação com clientes no dia a dia? Quais expressões fazem parte do seu vocabulário e o que deve ser evitado, incluindo restrições legais ou de conselho de classe?',
    nota: 'Registrar LITERALMENTE: é daqui que nascem a greenlist e a redlist.',
  },

  {
    id: 'p-concorrentes-1',
    secao: 'concorrentes',
    texto:
      'Quem são os concorrentes diretos e o que na comunicação deles a sua marca não deve reproduzir? E quais marcas ou profissionais, de qualquer mercado, representam o padrão que você admira?',
    nota: 'Registrar nomes.',
  },

  {
    id: 'p-idv-1',
    secao: 'idv',
    texto:
      'Qual é a primeira percepção que sua marca deve provocar em quem a encontra? A identidade visual atual entrega isso ou precisa evoluir?',
    nota: 'Se já existir manual, cores e fontes, apenas confirmar e solicitar o envio.',
  },

  {
    id: 'p-prompt-1',
    secao: 'prompt_conteudo',
    texto:
      'Como estruturamos a produção de forma sustentável: quais formatos fazem sentido para você, qual é a disponibilidade real de agenda e você performa melhor com roteiro estruturado ou direcionamento por tópicos?',
  },
]

/**
 * Os avisos que vão ao CELULAR (Web Push), em texto para não depender da
 * ordem de definição. `status_alterado` fica de fora de propósito: é o mais
 * frequente, e um celular que vibra a cada arrasto no kanban é um celular
 * que a pessoa silencia — e aí perde o "revise", que é o que importa.
 */
export const PUSH_TYPES = [
  'nova_demanda',
  'demanda_concluida',
  'prazo_proximo',
  'demanda_atrasada',
  'comentario',
  'mencao',
  'demanda_na_fila',
  'demanda_devolvida',
  'demanda_assumida',
  'compromisso_proximo',
  'peca_para_revisar',
  'peca_aprovada',
  'peca_reprovada',
  'externa_iniciada',
  'externa_encerrada',
  'aviso_teste',
] as const

export const NOTIFICATION_TYPE = {
  NOVA_DEMANDA: 'nova_demanda',
  STATUS_ALTERADO: 'status_alterado',
  DEMANDA_CONCLUIDA: 'demanda_concluida',
  PRAZO_PROXIMO: 'prazo_proximo',
  DEMANDA_ATRASADA: 'demanda_atrasada',
  COMENTARIO: 'comentario',
  MENCAO: 'mencao',
  /** Caiu uma demanda na fila da sua função — ninguém assumiu ainda. */
  DEMANDA_NA_FILA: 'demanda_na_fila',
  /** Alguém devolveu para a fila o que estava fazendo. */
  DEMANDA_DEVOLVIDA: 'demanda_devolvida',
  /** Alguém da sua função assumiu uma demanda que estava na fila. */
  DEMANDA_ASSUMIDA: 'demanda_assumida',
  /** Compromisso do calendário se aproximando — captação, reunião, evento. */
  COMPROMISSO_PROXIMO: 'compromisso_proximo',
  /** Alguém marcou uma peça do seu cronograma: revise. */
  PECA_PARA_REVISAR: 'peca_para_revisar',
  /** Quem coordena aprovou a peça que você fez. */
  PECA_APROVADA: 'peca_aprovada',
  /** Quem coordena reprovou a peça que você fez, com o motivo. */
  PECA_REPROVADA: 'peca_reprovada',
  /** Alguém da equipe confirmou a saída: o cronômetro da externa começou. */
  EXTERNA_INICIADA: 'externa_iniciada',
  /** A externa foi encerrada, com o tempo total. */
  EXTERNA_ENCERRADA: 'externa_encerrada',
  /** O teste que a pessoa dispara ao ligar os avisos no celular. */
  AVISO_TESTE: 'aviso_teste',
} as const

/**
 * Com quantos dias de antecedência o compromisso é lembrado.
 *
 * Dois avisos, e cada um serve a uma coisa: o de 7 dias é para PREPARAR —
 * reservar equipamento, confirmar com o cliente, montar roteiro. O de 1 dia é
 * para LEMBRAR de que amanhã tem, que é outro problema.
 *
 * Um aviso só falharia nos dois: com 7 dias a pessoa esquece na véspera, com
 * 1 dia não dá tempo de preparar nada.
 */
export const DIAS_LEMBRETE_COMPROMISSO = [7, 1] as const

export const ACTIVITY_ACTION = {
  CRIADA: 'criada',
  STATUS_ALTERADO: 'status_alterado',
  PRAZO_ALTERADO: 'prazo_alterado',
  RESPONSAVEL_ALTERADO: 'responsavel_alterado',
  EDITADA: 'editada',
  EXCLUIDA: 'excluida',
  REABERTA: 'reaberta',
  DELEGACAO_ALTERADA: 'delegacao_alterada',
  HORAS_EDITADAS: 'horas_editadas',
  /** Pegou para si uma demanda que estava na fila da função. */
  ASSUMIDA: 'assumida',
  /** Abriu mão da demanda, que voltou para a fila da função. */
  DEVOLVIDA_A_FILA: 'devolvida_a_fila',
} as const

/** Anexos: apenas material leve. Vídeo finalizado fica em link externo. */
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

export const ALLOWED_ATTACHMENT_MIME = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
] as const

/**
 * Os anexos que viram miniatura na tela.
 *
 * Só imagem: PDF renderizado em miniatura exigiria um rasterizador, e um
 * ícone de clipe já diz o que precisa ser dito sobre um documento.
 *
 * SVG entra porque é seguro no contexto em que é usado — dentro de `<img>`,
 * o navegador não executa script do SVG. Se um dia a miniatura virar
 * `<object>` ou `<iframe>`, esta linha precisa sair.
 */
export const PREVIEWABLE_IMAGE_MIME = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const

export function isPreviewableImage(mimeType: string): boolean {
  return (PREVIEWABLE_IMAGE_MIME as readonly string[]).includes(mimeType)
}
