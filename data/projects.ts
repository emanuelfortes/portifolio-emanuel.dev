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
    title: "Siga Fibra",
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
];
