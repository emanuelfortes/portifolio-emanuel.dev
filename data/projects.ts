/**
 * Projetos exibidos na home e nas páginas /projeto/[slug].
 *
 * REVISAR: os campos `stack`, `problem`, `solution`, `result`, `fullDescription`
 * e `highlights` foram redigidos a partir do que as capturas em docs/ mostram na
 * tela. O que aparece na interface é fato; a tecnologia por trás e os números de
 * resultado são a sua história, então passe o olho e corrija antes de publicar.
 */

/** Região clicável sobreposta à captura, usada na vitrine ampliada. */
export type Hotspot = {
  /** Caixa em % da imagem completa, na ordem [x, y, largura, altura]. */
  box: [number, number, number, number];
  /** Rótulo curto, exibido ao passar o mouse. */
  title: string;
  /** Explicação que abre ao clicar. */
  note: string;
};

export type Shot = {
  /** Recorte do topo, 16:10, carregado junto com o card. */
  thumb: string;
  /** Página inteira, baixada só quando o visitante interage. */
  full: string;
  /** Dimensões da imagem completa, usadas para calcular o percurso da rolagem. */
  width: number;
  height: number;
  /** Texto da barra de endereço do mockup. */
  label: string;
  /** Cadeado na barra. Use false em sistema interno sem domínio público. */
  secure?: boolean;
  hotspots: Hotspot[];
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
  shot: Shot;
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
    shot: {
      thumb: "/shots/sigafibra-thumb.webp",
      full: "/shots/sigafibra.webp",
      width: 1280,
      height: 2080,
      label: "Painel de controle · Siga Fibra",
      secure: false,
      hotspots: [
        {
          box: [15, 4.6, 32, 3.8],
          title: "O número de cima",
          note: "129.683 acessos no período. Não é a leitura de uma plataforma, é a soma consolidada de seis origens, cada uma devolvendo os dados em um formato diferente antes de virar uma base comum.",
        },
        {
          box: [15, 9.4, 83, 4],
          title: "Sete indicadores isolados",
          note: "Google Orgânico, Google Ads, Meta Ads, TikTok Ads, Redes Sociais, Acesso Direto e Outros, cada um no seu próprio bloco. Separar permite comparar de relance qual canal sustenta o volume.",
        },
        {
          box: [15, 14.2, 83, 15.5],
          title: "A mesma base, duas leituras",
          note: "À esquerda a proporção, à direita o número absoluto com barra de participação. Resolve a pergunta que todo gráfico de pizza deixa no ar: esse pedaço representa quanto, afinal?",
        },
        {
          box: [15, 30.8, 83, 9.4],
          title: "Série diária com composição",
          note: "Cada barra é um dia. O tooltip abre a quebra daquele dia por origem, então dá para entender um pico sem sair da tela nem trocar de filtro.",
        },
        {
          box: [15, 79.8, 83, 18],
          title: "Até a campanha individual",
          note: "O último nível de profundidade. Cada campanha identificada por UTM, com origem e meio, ordenada por volume. É onde a leitura deixa de ser diagnóstico e vira decisão de verba.",
        },
      ],
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
    shot: {
      thumb: "/shots/lexcursos-thumb.webp",
      full: "/shots/lexcursos.webp",
      width: 1280,
      height: 1671,
      label: "lexcursos.site/admin",
      secure: true,
      hotspots: [
        {
          box: [0.5, 2, 12.5, 20],
          title: "Dez áreas, dois grupos",
          note: "Gestão reúne o que a operação usa todo dia: usuários, produtos, cursos, pedidos, financeiro e analytics. Sistema guarda o que se mexe raramente: integrações, logs e configurações. A separação evita que a barra lateral vire uma lista sem hierarquia.",
        },
        {
          box: [13.5, 6.3, 84, 3.2],
          title: "O estado do curso no cabeçalho",
          note: "Contagem de aulas, duração, alunos e preço ficam ao lado do nome. Publicar e despublicar é um botão, e é reversível, então a operação mexe sem precisar pedir confirmação para ninguém.",
        },
        {
          box: [14.5, 11.6, 83, 6.6],
          title: "Vinte e um módulos, controle por linha",
          note: "Cada módulo carrega professor, estado e contagem de aulas, com subir, descer, ocultar, editar e remover na própria linha. Montar um curso deixa de exigir navegação entre telas.",
        },
        {
          box: [14.5, 59.8, 83, 12.5],
          title: "A hierarquia aberta",
          note: "O módulo expande e revela as aulas, cada uma com seu próprio estado de publicação e a marcação de gratuita. É aqui que fica clara a decisão de projeto: visibilidade é granular até o último nível.",
        },
      ],
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
    shot: {
      thumb: "/shots/dr-erico-thumb.webp",
      full: "/shots/dr-erico.webp",
      width: 1280,
      height: 6536,
      label: "drericodiogenes.com.br",
      secure: true,
      hotspots: [
        {
          box: [2, 2, 96, 7.5],
          title: "Três respostas antes da rolagem",
          note: "Quem é, o que faz e onde atua, resolvidos na primeira dobra. Em site de saúde o visitante chega por busca e decide em segundos se está no lugar certo, então especialidade e cidade precisam estar visíveis sem rolar.",
        },
        {
          box: [2, 18.5, 96, 15.5],
          title: "Catálogo que responde à busca",
          note: "Nove tratamentos em grade, cada card listando os procedimentos cobertos. Funciona como índice para quem navega e, ao mesmo tempo, como conteúdo para quem pesquisa o nome do procedimento no Google.",
        },
        {
          box: [2, 48, 96, 7],
          title: "Prova social com rastro",
          note: "Depoimentos reais de pacientes, com nota e data, e link para o perfil público de origem. Avaliação verificável pesa muito mais que depoimento sem procedência, ainda mais na área de saúde.",
        },
        {
          box: [2, 80.5, 96, 9.3],
          title: "FAQ com função dupla",
          note: "O acordeão responde a dúvida de quem já está na página e, ao mesmo tempo, cobre as perguntas que o paciente digita na busca. Uma seção servindo conversão e tráfego orgânico ao mesmo tempo.",
        },
        {
          box: [2, 91.5, 96, 4.5],
          title: "Onde a jornada fecha",
          note: "Três unidades de atendimento, cada uma com endereço e telefone próprios. É o último obstáculo entre interesse e consulta, então fica explícito em vez de escondido atrás de um formulário.",
        },
      ],
    },
  },
];
