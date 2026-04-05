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
};

export const projects: Project[] = [
  {
    slug: "crm-interno",
    tag: "Sistema Web",
    title: "CRM Interno",
    shortDescription:
      "Plataforma completa de gestão de clientes com pipeline de vendas, painel administrativo e relatórios em tempo real.",
    fullDescription:
      "Sistema CRM desenvolvido do zero para centralizar o processo comercial de uma equipe de vendas. O projeto cobriu desde a modelagem do banco de dados, definição de regras de negócio, até a construção da interface final — com foco em usabilidade e performance.",
    problem:
      "A equipe utilizava planilhas descentralizadas para acompanhar clientes e negociações, o que gerava perda de informações, retrabalho e falta de visibilidade sobre o pipeline.",
    solution:
      "Desenvolvemos um CRM sob medida com autenticação por perfis, controle de etapas do funil, histórico de interações por cliente e um dashboard analítico com métricas em tempo real.",
    result:
      "Redução do tempo de acompanhamento comercial e centralização de todos os dados em uma única plataforma. A equipe passou a ter visibilidade total do pipeline e relatórios automáticos substituíram processos manuais.",
    stack: ["React.js", "Node.js", "PostgreSQL", "REST API", "JWT Auth", "Tailwind CSS"],
    highlights: [
      "Autenticação com controle de permissões por perfil",
      "Pipeline de vendas com drag-and-drop",
      "Dashboard com gráficos e métricas em tempo real",
      "Histórico completo de interações por cliente",
      "Exportação de relatórios em PDF e CSV",
    ],
    year: "2024",
  },
  {
    slug: "painel-de-metricas",
    tag: "Dashboard",
    title: "Painel de Métricas",
    shortDescription:
      "Interface analítica com visualização de dados em tempo real, filtros dinâmicos e exportação de relatórios para tomada de decisão.",
    fullDescription:
      "Dashboard analítico desenvolvido para consolidar dados de múltiplas fontes em uma interface clara e acionável. O painel permite que gestores acompanhem KPIs, identifiquem gargalos e tomem decisões baseadas em dados — sem depender de terceiros para gerar relatórios.",
    problem:
      "Os dados da operação estavam dispersos em diferentes sistemas e a geração de relatórios era manual, lenta e propensa a erros.",
    solution:
      "Construímos um painel centralizado que consome dados via API, processa e apresenta em gráficos interativos com filtros por período, categoria e equipe.",
    result:
      "Eliminação do processo manual de geração de relatórios. Gestores passaram a ter acesso imediato a dados atualizados, com impacto direto na velocidade de decisão.",
    stack: ["React.js", "TypeScript", "Chart.js", "REST API", "Node.js", "Tailwind CSS"],
    highlights: [
      "Gráficos interativos com múltiplos tipos de visualização",
      "Filtros dinâmicos por período, status e categoria",
      "Exportação de relatórios em PDF",
      "Consumo de API com atualização automática",
      "Layout responsivo e acessível",
    ],
    year: "2024",
  },
  {
    slug: "sistema-de-agendamento",
    tag: "Aplicação Web",
    title: "Sistema de Agendamento",
    shortDescription:
      "Plataforma de agendamento online com confirmação automática, gestão de horários e painel do prestador de serviço.",
    fullDescription:
      "Aplicação web que permite que clientes agendem serviços de forma autônoma, com confirmação por e-mail, controle de disponibilidade em tempo real e painel dedicado para o prestador gerenciar todos os agendamentos.",
    problem:
      "O processo de agendamento era feito manualmente via WhatsApp, gerando conflitos de horário, perda de dados e sobrecarga no atendimento.",
    solution:
      "Sistema com calendário interativo, confirmação automática por e-mail e painel administrativo para gestão completa de agendamentos e clientes.",
    result:
      "Eliminação de conflitos de horário e redução do tempo dedicado ao atendimento manual. O prestador ganhou autonomia e os clientes, conveniência.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Nodemailer", "Prisma ORM", "Tailwind CSS"],
    highlights: [
      "Calendário interativo com disponibilidade em tempo real",
      "Confirmação automática por e-mail",
      "Painel administrativo completo",
      "Histórico de agendamentos por cliente",
      "Notificações e lembretes automáticos",
    ],
    year: "2024",
  },
];
