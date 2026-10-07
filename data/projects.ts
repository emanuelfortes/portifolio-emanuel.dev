/**
 * Projetos exibidos na home e nas páginas /projeto/[slug].
 *
 * REVISAR: os campos `stack`, `problem`, `solution`, `result`, `fullDescription`
 * e `highlights` foram redigidos a partir do que as capturas em docs/ mostram na
 * tela. O que aparece na interface é fato; a tecnologia por trás e os números de
 * resultado são a sua história, então passe o olho e corrija antes de publicar.
 */

/** Réplica navegável exibida no monitor do card. */
export type Demo = {
  /** Rota da réplica dentro deste site, carregada num iframe. */
  path: string;
  /** Texto da barra de endereço quando a tela está ampliada. */
  label: string;
  /** Cadeado na barra. Use false em sistema interno sem domínio público. */
  secure?: boolean;
};

export type Project = {
  slug: string;
  tag: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  highlights: string[];
  liveUrl?: string;
  githubUrl?: string;
  year: string;
  demo: Demo;
};

export const projects: Project[] = [
  {
    slug: "siga-fibra",
    tag: "Dashboard",
    title: "Siga Fibra · Painel",
    shortDescription:
      "Painel que consolida seis origens de tráfego em uma leitura só, com série diária e campanhas identificadas por UTM.",
    fullDescription:
      "Painel de controle construído para quem precisa saber de onde vêm os acessos sem abrir seis relatórios diferentes. Cada plataforma de anúncio devolve os dados no seu próprio formato, e o painel normaliza tudo em uma base comum antes de exibir. A tela de tráfego parte do número total e vai abrindo em camadas: proporção por origem, série por dia e, no fim, a campanha individual.",
    problem:
      "Os dados de audiência estavam espalhados entre Google Ads, Meta Ads, TikTok Ads e o analytics do próprio site. Montar uma visão única significava exportar planilha de cada plataforma e cruzar na mão, o que levava horas e envelhecia no mesmo dia.",
    solution:
      "Painel que consome as APIs de cada origem, normaliza os retornos em um formato comum e apresenta em camadas de profundidade: total, proporção, série diária e campanha. O tooltip do gráfico abre a composição de cada dia por origem, sem trocar de tela.",
    result:
      "A leitura que antes exigia consolidação manual passou a estar disponível a qualquer momento, com histórico preservado e granularidade até a campanha.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Recharts",
      "Express",
      "Node.js",
    ],
    highlights: [
      "Consolidação de seis origens de tráfego em uma base única",
      "Sete indicadores isolados para comparação direta",
      "Série diária com tooltip que abre a composição por origem",
      "Tabela de campanhas identificadas por UTM, ordenada por volume",
      "Filtros por dia, semana e mês com janela comparativa",
    ],
    year: "2026",
    demo: {
      path: "/demo/siga-fibra",
      label: "Painel de controle · Siga Fibra",
      secure: false,
    },
  },

  {
    slug: "lexcursos",
    tag: "Plataforma EAD",
    title: "LexCursos",
    shortDescription:
      "Painel administrativo de uma plataforma de cursos, com catálogo, módulos, aulas, pedidos e financeiro na mesma interface.",
    fullDescription:
      "Área administrativa de uma plataforma de cursos preparatórios. O desafio do painel não é mostrar dados, é deixar que uma pessoa sem familiaridade técnica monte e reorganize um curso inteiro sem medo de quebrar nada. Por isso toda ação destrutiva é reversível e a publicação é granular: dá para deixar um módulo no ar e outro em rascunho dentro do mesmo curso.",
    problem:
      "A operação precisava montar cursos com dezenas de módulos e aulas, publicar parte do conteúdo e segurar o resto, sem depender de desenvolvedor para cada ajuste de ordem ou visibilidade.",
    solution:
      "Painel com hierarquia de dois níveis, módulo contendo aulas, em que ordem, visibilidade e publicação são controladas linha a linha. O catálogo convive na mesma interface com pedidos, financeiro e analytics, para que a gestão do conteúdo e a do negócio não fiquem em sistemas separados.",
    result:
      "A equipe passou a montar e reorganizar cursos sozinha, e a publicação deixou de ser um evento de tudo ou nada para virar um ajuste contínuo.",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "Mercado Pago",
      "Cloudinary",
      "HLS",
      "Tailwind CSS",
    ],
    highlights: [
      "Reordenação drag-and-drop de módulos e aulas",
      "Publicação granular, por módulo e por aula",
      "Vídeo em HLS com upload resumível, que sobrevive a queda de conexão",
      "Checkout integrado ao Mercado Pago, com liberação automática de acesso",
      "Autenticação por perfil, financeiro, analytics e logs na mesma interface",
    ],
    year: "2026",
    liveUrl: "https://lexcursos.site",
    demo: {
      path: "/demo/lexcursos",
      label: "lexcursos.site",
      secure: true,
    },
  },

  {
    slug: "dr-erico-diogenes",
    tag: "Site institucional",
    title: "Dr. Érico Diógenes",
    shortDescription:
      "Site de um urologista em Fortaleza, construído para transformar busca por sintoma em consulta agendada.",
    fullDescription:
      "Site institucional de um urologista com atuação em cirurgia robótica. A página inteira é organizada em torno de uma jornada: o paciente chega pesquisando um sintoma ou procedimento, encontra o tratamento correspondente, lê a prova social e termina no agendamento. Cada seção existe para resolver uma objeção específica dessa sequência.",
    problem:
      "Pacientes chegam ao consultório por busca, pesquisando um sintoma ou o nome de um procedimento. Sem conteúdo que respondesse essas buscas, o contato dependia de indicação direta e a credibilidade precisava ser construída do zero a cada atendimento.",
    solution:
      "Site estruturado como jornada: catálogo de tratamentos que responde à busca por procedimento, apresentação do profissional e depoimentos reais para a credibilidade, FAQ para as dúvidas que antecedem a decisão, e agendamento por WhatsApp em pontos recorrentes da página.",
    result:
      "O site passou a responder diretamente às buscas por tratamento e a conduzir o visitante até o agendamento, com as três unidades de atendimento acessíveis em qualquer ponto da navegação.",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Google APIs", "AOS"],
    highlights: [
      "Catálogo de nove tratamentos, cada um com os procedimentos cobertos",
      "Depoimentos sincronizados do perfil público no Google",
      "Biblioteca de vídeos e blog para busca orgânica",
      "FAQ em acordeão, estruturado por dúvida de paciente",
      "Três unidades de atendimento com contato próprio",
    ],
    year: "2026",
    liveUrl: "https://drericodiogenes.com.br",
    demo: {
      path: "/demo/dr-erico",
      label: "drericodiogenes.com.br",
      secure: true,
    },
  },

  {
    slug: "siga-fibra-site",
    tag: "Site e vendas",
    title: "Siga Fibra · Site",
    shortDescription:
      "Site de uma provedora de fibra óptica em Fortaleza, com planos, promoções e um checkout que fecha a venda no WhatsApp.",
    fullDescription:
      "Site institucional e de vendas da Siga Fibra, com áreas separadas para clientes residenciais e empresariais. Os planos aparecem em carrossel, ao lado da campanha do mês com streaming incluso, do chip móvel, do telefone fixo e do ecossistema de apps. O checkout monta o pedido inteiro no navegador e entrega o resumo pronto para o comercial no WhatsApp.",
    problem:
      "A venda de internet passa por várias escolhas de uma vez: velocidade, chip, streaming, telefone fixo e promoção vigente. Explicar tudo isso por mensagem, cliente a cliente, alongava a conversa e abria espaço para erro no pedido.",
    solution:
      "Um checkout em que o próprio visitante monta o pedido, vendo o total antes e depois da promoção, e fecha enviando o resumo já formatado para o WhatsApp comercial. Em volta dele, um site que separa residencial de empresarial e apresenta cada produto no seu bloco.",
    result:
      "O pedido chega ao comercial completo e no mesmo formato, e a conversa começa pela confirmação, não pela explicação dos planos.",
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "AOS", "React PDF"],
    highlights: [
      "Checkout que monta plano, chip, streaming e fixo, com totais antes e depois da promoção",
      "Pedido enviado pronto para o WhatsApp comercial",
      "Áreas separadas para clientes residenciais e empresariais",
      "Campanha do mês com streaming incluso e checkout próprio",
      "Modo escuro e seletor de cidade",
    ],
    year: "2026",
    liveUrl: "https://sigafibra.com",
    demo: {
      path: "/demo/siga-fibra-site",
      label: "sigafibra.com",
      secure: true,
    },
  },
  {
    slug: "kanban-cev",
    tag: "Sistema interno",
    title: "ACEV · Gestão de demandas",
    shortDescription:
      "Plataforma interna de uma agência para distribuir demandas, acompanhar prazos e aprovar o cronograma de conteúdo dos clientes.",
    fullDescription:
      "Ferramenta interna de gestão de demandas da agência. Cada demanda tem responsável, ou fica na fila de uma função até alguém assumir, além de prazo, checklist, anexos, comentários e histórico, num kanban com ordenação manual por arrasto. Demandas recorrentes nascem sozinhas a partir de regras de recorrência, e o cronograma de conteúdo distribui peças com dono, data e briefing próprios, com revisão e aprovação.",
    problem:
      "O trabalho da agência chegava por canais diferentes e se perdia entre conversas e planilhas: não ficava claro quem estava com cada peça, o que estava atrasado e o que já tinha passado por revisão.",
    solution:
      "Um sistema único em que toda demanda tem dono, prazo e estado visíveis no kanban, com fila por função para o que ainda não foi assumido, recorrências que se criam sozinhas e um fluxo de revisão e aprovação para cada peça do cronograma.",
    result:
      "A distribuição do trabalho e o acompanhamento de prazos passaram a acontecer num lugar só, com histórico de cada demanda.",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "TanStack Query",
      "dnd-kit",
      "Hono",
      "AWS Lambda (SST)",
      "Drizzle ORM",
      "PostgreSQL",
      "Turborepo",
    ],
    highlights: [
      "Kanban com ordenação manual por arrasto e fila por função",
      "Demandas recorrentes geradas por regra, com antecedência configurável",
      "Cronograma de conteúdo com dono, briefing, revisão e aprovação por peça",
      "Calendário da agência com compromissos, feriados e aniversários",
      "Painel de desempenho da equipe e permissões por função sem deploy",
    ],
    year: "2026",
    demo: {
      path: "/demo/kanban-cev",
      label: "acev.site",
      secure: true,
    },
  },
  {
    slug: "cirurgia-de-mohs",
    tag: "Portal editorial",
    title: "Cirurgia de Mohs",
    shortDescription:
      "Portal sobre câncer de pele e cirurgia de Mohs no Nordeste, com 68 páginas geradas a partir de Markdown.",
    fullDescription:
      "Portal editorial independente sobre câncer de pele e cirurgia micrográfica de Mohs, voltado a pacientes e a médicos que encaminham pacientes no Nordeste. Cada arquivo Markdown vira uma página estática com o template do seu tipo: pilar, artigo, área médica ou página por estado, com índice lateral e FAQ em acordeão. O layout é editorial, com cabeçalho que compacta ao rolar, infográfico comparando as margens examinadas e tabelas que viram lista no celular.",
    problem:
      "Conteúdo médico sobre um procedimento específico precisa cobrir muitas buscas diferentes, por dúvida, por tipo de leitor e por estado, sem que cada página nova vire trabalho de desenvolvimento.",
    solution:
      "Um gerador estático em que o conteúdo mora em arquivos Markdown e cada tipo de página tem o seu template. Publicar uma página nova é escrever um arquivo, e o site cuida de layout, índice, FAQ, blog com categorias, sitemaps e dados estruturados.",
    result:
      "O portal reúne 68 páginas de conteúdo e um blog com categorias e paginação, todas geradas estaticamente.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Markdown (remark/rehype)",
      "AOS",
      "sharp",
    ],
    highlights: [
      "68 páginas geradas a partir de arquivos Markdown, com template por tipo",
      "Páginas por estado do Nordeste e área dedicada a médicos",
      "Infográfico em SVG comparando as margens examinadas",
      "Tabelas que viram lista no celular, índice lateral e FAQ em acordeão",
      "Blog com categorias e paginação, sitemaps por seção e dados estruturados",
    ],
    year: "2026",
    demo: {
      path: "/demo/cirurgia-mohs",
      label: "Cirurgia de Mohs · portal editorial",
      secure: false,
    },
  },
];
