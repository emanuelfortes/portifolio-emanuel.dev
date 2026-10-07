/**
 * Configuração central do portal.
 *
 * Os arquivos .md em /content foram mantidos EXATAMENTE como entregues.
 * Os marcadores entre colchetes ([MARCA], [NOME DO MÉDICO], [WHATSAPP] etc.)
 * são substituídos em tempo de build pelos valores abaixo.
 *
 * Deixe um valor vazio ("") para manter o marcador visível na página
 * (útil para localizar o que ainda falta preencher).
 */

/**
 * Réplica: o original lê NEXT_PUBLIC_SITE_URL (definida na Vercel) e cai em
 * "https://exemplo.com.br" sem ela. A réplica não usa variáveis de ambiente,
 * então fica direto com esse valor (só aparece no [DOMÍNIO] da política de privacidade).
 */
export const siteUrl = "https://exemplo.com.br";

export const siteConfig = {
  /** Nome da marca (aparece no title de todas as páginas) */
  marca: "Cirurgia de Mohs",
  /** Domínio sem protocolo, usado nos JSON-LD e canônicas */
  dominio: siteUrl.replace(/^https?:\/\//, ""),
  /**
   * Blocos de autoria: nome, CRM, RQE, bio e retrato do médico, em nove pontos
   * do site. Desligados enquanto esses dados forem marcadores, para não mostrar
   * "[NOME DO MÉDICO]" ao visitante.
   *
   * O que volta ao ligar, o que preencher antes e o que conferir depois está em
   * docs/autoria-do-medico.md. Não vá ao ar com isto em false: a identificação
   * do médico é exigência do CFM e sinal de E-E-A-T para o Google.
   */
  mostrarAutoria: false,
  /** Nome do médico como deve aparecer no site */
  nomeMedico: "",
  nomeCompletoMedico: "",
  crm: "",
  rqe: "",
  /** Somente dígitos, com DDD. Ex.: 85999999999 */
  whatsapp: "",
  whatsappProfissional: "",
  /** Somente dígitos, com DDD. Ex.: 8533333333 */
  telefone: "",
  email: "",
  endereco: "",
  bairro: "",
  cidade: "Fortaleza",
  cep: "",
  lat: "",
  lng: "",
  /** Data padrão de publicação/revisão dos conteúdos (AAAA-MM-DD) */
  data: "2026-09-21",
  instituicao: "",
  ano: "",
  urlInstagram: "",
  urlDoctoralia: "",
  urlGoogleBusiness: "",
  urlGoogleMaps: "",
  urlLattes: "",
  horario: "",
  horaAbertura: "",
  horaFechamento: "",
  nomeDpo: "",
  emailDpo: "",
  cpfCnpj: "",
  tagline: "Especialidade em Câncer de Pele.",
  descricaoCurta:
    "Portal de referência sobre cirurgia de Mohs e câncer de pele para pacientes e médicos do Nordeste.",
};

/**
 * Mapa marcador → valor. As chaves são exatamente como aparecem nos .md.
 * Marcadores sem valor permanecem no texto.
 */
export const placeholderMap: Record<string, string> = {
  "[MARCA]": siteConfig.marca,
  "[DOMÍNIO]": siteConfig.dominio,
  "[NOME DO MÉDICO]": siteConfig.nomeMedico,
  "[NOME COMPLETO DO MÉDICO]": siteConfig.nomeCompletoMedico,
  "[CRM]": siteConfig.crm,
  "[RQE]": siteConfig.rqe,
  "[WHATSAPP]": siteConfig.whatsapp,
  "[WHATSAPP PROFISSIONAL]": siteConfig.whatsappProfissional,
  "[TELEFONE]": siteConfig.telefone,
  "[E-MAIL]": siteConfig.email,
  "[ENDEREÇO]": siteConfig.endereco,
  "[BAIRRO]": siteConfig.bairro,
  "[CIDADE]": siteConfig.cidade,
  "[CEP]": siteConfig.cep,
  "[LAT]": siteConfig.lat,
  "[LNG]": siteConfig.lng,
  "[DATA]": siteConfig.data,
  "[INSTITUIÇÃO]": siteConfig.instituicao,
  "[ANO]": siteConfig.ano,
  "[URL INSTAGRAM]": siteConfig.urlInstagram,
  "[URL DOCTORALIA]": siteConfig.urlDoctoralia,
  "[URL GOOGLE BUSINESS]": siteConfig.urlGoogleBusiness,
  "[URL GOOGLE MAPS]": siteConfig.urlGoogleMaps,
  "[URL LATTES]": siteConfig.urlLattes,
  "[HORÁRIO]": siteConfig.horario,
  "[HORA ABERTURA]": siteConfig.horaAbertura,
  "[HORA FECHAMENTO]": siteConfig.horaFechamento,
  "[NOME DO DPO]": siteConfig.nomeDpo,
  "[E-MAIL DPO]": siteConfig.emailDpo,
  "[CPF/CNPJ]": siteConfig.cpfCnpj,
};

/** Substitui os marcadores conhecidos que tiverem valor definido. */
export function applyPlaceholders(text: string): string {
  let out = text;
  for (const [token, value] of Object.entries(placeholderMap)) {
    if (value) out = out.split(token).join(value);
  }
  return out;
}

export const whatsappLink = (message: string) =>
  `https://wa.me/55${siteConfig.whatsapp || "[WHATSAPP]"}?text=${encodeURIComponent(message)}`;

export const phoneLink = () => `tel:+55${siteConfig.telefone || "[TELEFONE]"}`;

export const doctorName = () => siteConfig.nomeMedico || "[NOME DO MÉDICO]";

/** Bio curta do médico (home e artigos). Marcadores ficam visíveis até serem preenchidos. */
export const doctorBio = () =>
  `Formação em Dermatologia, treinamento em cirurgia micrográfica de Mohs em ${siteConfig.instituicao || "[INSTITUIÇÃO]"}, atuação em Fortaleza desde ${siteConfig.ano || "[ANO]"}. Membro da Sociedade Brasileira de Dermatologia. Registro: CRM ${siteConfig.crm || "[CRM]"} · RQE ${siteConfig.rqe || "[RQE]"}.`;

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

/**
 * Onde fazer a cirurgia de Mohs: fonte única para o menu, o rodapé e a lateral
 * das páginas regionais. Fortaleza é o serviço de referência e vem sempre
 * primeiro. Não existe serviço de Mohs no interior do Ceará: quem mora lá
 * opera em Fortaleza, então o interior não aparece como local.
 */
export const locaisMohs = [
  { label: "Ceará – Fortaleza", href: "/cirurgia-de-mohs-fortaleza" },
  { label: "Piauí", href: "/cirurgia-de-mohs-nordeste/piaui" },
  { label: "Maranhão", href: "/cirurgia-de-mohs-nordeste/maranhao" },
  { label: "Rio Grande do Norte", href: "/cirurgia-de-mohs-nordeste/rio-grande-do-norte" },
  { label: "Paraíba", href: "/cirurgia-de-mohs-nordeste/paraiba" },
  { label: "Pernambuco", href: "/cirurgia-de-mohs-nordeste/pernambuco" },
] as const;

/** Navegação do masthead (docs/HANDOFF.md §2.1); também usada no rodapé e na 404. */
export const mainNav: NavItem[] = [
  { label: "Cirurgia de Mohs", href: "/cirurgia-de-mohs" },
  {
    label: "Câncer de Pele",
    href: "/cancer-de-pele",
    children: [
      { label: "Carcinoma basocelular", href: "/cancer-de-pele/carcinoma-basocelular" },
      { label: "Carcinoma espinocelular", href: "/cancer-de-pele/carcinoma-espinocelular" },
      { label: "Melanoma", href: "/cancer-de-pele/melanoma" },
      { label: "Tumores raros", href: "/cancer-de-pele/tumores-raros" },
    ],
  },
  { label: "Pós-operatório", href: "/pos-operatorio" },
  { label: "Para Médicos", href: "/para-medicos" },
  {
    label: "Onde fazer",
    href: "/cirurgia-de-mohs-nordeste",
    children: [...locaisMohs, { label: "Panorama do Nordeste", href: "/cirurgia-de-mohs-nordeste" }],
  },
  { label: "Blog", href: "/blog" },
];

export const blogCategories = [
  "Cirurgia de Mohs",
  "Tipos de câncer de pele",
  "Pós-operatório",
  "Convênios e custos",
] as const;
