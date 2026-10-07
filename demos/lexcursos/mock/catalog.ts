import type { CourseModuleLink, LessonData, ModuleData, Product } from "@/demos/lexcursos/lib/types";
import { asset } from "@/demos/lexcursos/lib/paths";
import { rng } from "./rand";

// Catálogo fictício de preparações (preços e números sintéticos). Os cursos e as
// fotos de capa seguem as carreiras do hero do site: PF, Polícia Civil, Guarda Municipal e BEPI.

/** Curso da vitrine do portfólio: a área de módulos dele é a tela principal da réplica. */
export const SHOWCASE_COURSE_ID = "cmbx7pf2a0001lexq9d3k7w2";

export const PRODUCTS: Product[] = [
  {
    id: "prd_pf", slug: "policia-federal-agente-escrivao", courseId: SHOWCASE_COURSE_ID,
    title: "Polícia Federal — Agente e Escrivão",
    shortDescription: "Preparação completa para Agente e Escrivão da PF: teoria, PDFs e questões comentadas no estilo Cebraspe.",
    description: "Todas as matérias do edital de Agente e Escrivão da Polícia Federal, com aulas objetivas, PDFs de apoio, questões comentadas e simulados.",
    thumbnail: asset("capa-policia-federal.webp"), price: 497, comparePrice: 797, categoryName: "Polícia Federal", level: "all",
    type: "course", status: "published", isPublic: true, isFeatured: true, enrolledCount: 412, heroColor: "graphite", createdAgoMin: 60 * 24 * 140,
  },
  {
    id: "prd_gmf", slug: "guarda-municipal-de-fortaleza", courseId: "cmbx7gm4c0002lexr2h8s1v6",
    title: "Guarda Municipal de Fortaleza — GMF",
    shortDescription: "Do zero à aprovação na GMF: legislação municipal, Português, Raciocínio Lógico e Informática.",
    description: "Preparação completa para o concurso da Guarda Municipal de Fortaleza.",
    thumbnail: asset("capa-guarda-municipal.webp"), price: 297, comparePrice: 447, categoryName: "Guarda Municipal", level: "beginner",
    type: "course", status: "published", isPublic: true, isFeatured: false, enrolledCount: 531, heroColor: "navy", createdAgoMin: 60 * 24 * 260,
  },
  {
    id: "prd_pcce", slug: "policia-civil-do-ceara", courseId: "cmbx7pc3b0003lexm5t2q8z4",
    title: "Polícia Civil do Ceará — Inspetor e Escrivão",
    shortDescription: "Teoria e questões para Inspetor e Escrivão da PCCE, com Criminologia e Medicina Legal.",
    description: "Preparação completa para Inspetor e Escrivão da Polícia Civil do Ceará.",
    thumbnail: asset("capa-policia-civil.webp"), price: 397, comparePrice: 597, categoryName: "Polícia Civil", level: "intermediate",
    type: "course", status: "published", isPublic: true, isFeatured: false, enrolledCount: 268, heroColor: "navy", createdAgoMin: 60 * 24 * 190,
  },
  {
    id: "prd_pmce", slug: "pmce-soldado-bepi", courseId: "cmbx7pm5d0004lexk1w6n3y8",
    title: "PMCE — Soldado (rumo ao BEPI)",
    shortDescription: "Preparação para Soldado da Polícia Militar do Ceará, com Direito Penal Militar e Legislação da PMCE.",
    description: "Preparação completa para Soldado da PMCE.",
    thumbnail: asset("capa-bepi.webp"), price: 347, comparePrice: 497, categoryName: "Polícia Militar", level: "beginner",
    type: "course", status: "published", isPublic: true, isFeatured: false, enrolledCount: 189, heroColor: "emerald", createdAgoMin: 60 * 24 * 95,
  },
  {
    id: "prd_tjce", slug: "tjce-tecnico-judiciario", courseId: "cmbx7tj6e0005lexp4c9r2u5",
    title: "TJCE — Técnico Judiciário",
    shortDescription: "Português, Direito Constitucional, Administrativo e Processual Civil para o TJCE.",
    description: "Preparação para Técnico Judiciário do Tribunal de Justiça do Ceará.",
    thumbnail: "", price: 347, categoryName: "Tribunais", level: "intermediate",
    type: "course", status: "draft", isPublic: true, isFeatured: false, enrolledCount: 0, heroColor: "violet", createdAgoMin: 60 * 24 * 12,
  },
  {
    id: "prd_ppce", slug: "policia-penal-do-ceara", courseId: "cmbx7pp7f0006lexs8e1t6j3",
    title: "Polícia Penal do Ceará — PPCE",
    shortDescription: "Lei de Execução Penal, Direitos Humanos e as matérias básicas do edital da PPCE.",
    description: "Preparação para Policial Penal do Ceará.",
    thumbnail: "", price: 297, categoryName: "Polícia Penal", level: "beginner",
    type: "course", status: "draft", isPublic: true, isFeatured: false, enrolledCount: 0, heroColor: "crimson", createdAgoMin: 60 * 24 * 4,
  },
  {
    id: "prd_combo", slug: "combo-seguranca-publica", courseId: null,
    title: "Combo Segurança Pública (PF + PCCE)",
    shortDescription: "As duas preparações policiais com desconto.", description: "",
    thumbnail: "", price: 747, comparePrice: 894, categoryName: "Combos", level: "all",
    type: "bundle", status: "published", isPublic: false, isFeatured: false, enrolledCount: 37, heroColor: "navy", createdAgoMin: 60 * 24 * 60,
  },
  {
    id: "prd_assin", slug: "assinatura-lex-anual", courseId: null,
    title: "Assinatura LEX Anual",
    shortDescription: "Acesso a todas as preparações por 12 meses.", description: "",
    thumbnail: "", price: 997, categoryName: "Assinaturas", level: "all",
    type: "subscription", status: "published", isPublic: false, isFeatured: false, enrolledCount: 9, heroColor: "navy", createdAgoMin: 60 * 24 * 20,
  },
];

// ── Matérias: tópicos das aulas ────────────────────────────────────────────
const TOPICS: Record<string, string[]> = {
  "Boas-vindas": ["Boas-vindas à LEX", "Como usar a plataforma", "Edital comentado", "Cronograma de estudos", "Como revisar com os PDFs"],
  "Língua Portuguesa": ["Interpretação de textos", "Tipologia textual", "Ortografia oficial", "Acentuação gráfica", "Classes de palavras", "Concordância verbal e nominal", "Regência verbal e nominal", "Crase", "Pontuação", "Colocação pronominal", "Reescrita de frases", "Coesão e coerência", "Semântica"],
  "Direito Constitucional": ["Princípios fundamentais", "Direitos e garantias fundamentais", "Remédios constitucionais", "Direitos sociais", "Nacionalidade e direitos políticos", "Organização do Estado", "Administração Pública (arts. 37 a 41)", "Poder Executivo", "Poder Judiciário", "Segurança pública (art. 144)"],
  "Direito Administrativo": ["Princípios da Administração Pública", "Organização administrativa", "Atos administrativos", "Poderes administrativos", "Agentes públicos", "Lei 8.112/90", "Licitações (Lei 14.133/21)", "Responsabilidade civil do Estado", "Controle da Administração", "Improbidade administrativa"],
  "Direito Penal": ["Aplicação da lei penal", "Teoria do crime", "Tipicidade", "Ilicitude", "Culpabilidade", "Concurso de pessoas", "Crimes contra a pessoa", "Crimes contra o patrimônio", "Crimes contra a Administração Pública", "Teoria da pena"],
  "Direito Processual Penal": ["Inquérito policial", "Ação penal", "Teoria geral da prova", "Prisão em flagrante", "Prisão preventiva e temporária", "Medidas cautelares diversas", "Busca e apreensão", "Juiz das garantias", "Procedimentos"],
  "Legislação Penal Especial": ["Lei de Drogas", "Estatuto do Desarmamento", "Crimes hediondos", "Abuso de autoridade", "Lei Maria da Penha", "Organizações criminosas", "Lavagem de dinheiro", "Lei de Tortura", "Interceptação telefônica"],
  "Informática": ["Hardware e software", "Windows 10/11", "Pacote Office", "Redes de computadores", "Internet e intranet", "Navegadores e e-mail", "Segurança da informação", "Malwares", "Computação em nuvem", "Noções de banco de dados"],
  "Raciocínio Lógico": ["Proposições", "Conectivos lógicos", "Tabela-verdade", "Equivalências lógicas", "Negação de proposições", "Diagramas lógicos", "Análise combinatória", "Probabilidade", "Sequências lógicas"],
  "Estatística": ["Estatística descritiva", "Medidas de posição", "Medidas de dispersão", "Probabilidade aplicada", "Distribuições de probabilidade", "Inferência estatística", "Correlação e regressão"],
  "Contabilidade Geral": ["Patrimônio e equação patrimonial", "Contas e plano de contas", "Escrituração", "Balanço patrimonial", "DRE", "Operações com mercadorias"],
  "Atualidades": ["Segurança pública no Brasil", "Política nacional", "Economia brasileira", "Meio ambiente", "Tecnologia e sociedade", "Relações internacionais"],
  "Arquivologia": ["Conceitos fundamentais", "Gestão de documentos", "Classificação de documentos", "Tabela de temporalidade", "Preservação e conservação"],
  "Direitos Humanos": ["Teoria geral dos direitos humanos", "Declaração Universal (DUDH)", "Pacto de San José da Costa Rica", "Sistema interamericano", "Uso da força e de armas de fogo"],
  "Ética no Serviço Público": ["Decreto 1.171/94", "Código de conduta da Alta Administração", "Lei de Acesso à Informação", "Ética e moral"],
  "Questões Comentadas Cebraspe": ["Como a Cebraspe cobra", "Bateria 01 — Português", "Bateria 02 — Direito", "Bateria 03 — Informática", "Bateria 04 — Raciocínio Lógico", "Bateria 05 — Legislação"],
  "Simulados": ["Simulado 01", "Simulado 02", "Simulado 03", "Simulado 04 — reta final"],
  "Revisão Final": ["Revisão de Português", "Revisão de Constitucional", "Revisão de Penal", "Revisão de Informática", "Revisão de Legislação"],
  "Legislação Municipal": ["Lei Orgânica de Fortaleza", "Estatuto Geral das Guardas (Lei 13.022/14)", "Estatuto dos servidores de Fortaleza", "Código de Posturas", "Plano de cargos da GMF"],
  "História e Geografia do Ceará": ["Formação histórica do Ceará", "Abolição no Ceará", "Regiões e clima", "Economia cearense", "Fortaleza: história e bairros"],
  "Criminologia": ["Conceito e objeto", "Escolas criminológicas", "Vitimologia", "Prevenção do delito"],
  "Medicina Legal": ["Perícias e peritos", "Traumatologia forense", "Tanatologia", "Sexologia forense", "Documentos médico-legais"],
  "Legislação da PCCE": ["Estatuto da Polícia Civil do Ceará", "Lei Orgânica da PCCE", "Regime disciplinar"],
  "Direito Penal Militar": ["Aplicação da lei penal militar", "Crime militar", "Crimes contra a autoridade militar", "Deserção e abandono de posto"],
  "Legislação da PMCE": ["Estatuto dos militares estaduais", "Código Disciplinar da PM/CE", "Lei de organização básica"],
  "Direito Processual Civil": ["Normas fundamentais", "Jurisdição e competência", "Sujeitos do processo", "Atos processuais", "Tutela provisória"],
  "Execução Penal": ["Lei de Execução Penal", "Direitos e deveres do preso", "Regimes de cumprimento", "Faltas disciplinares"],
  "Redação Discursiva": ["Estrutura da dissertação", "Coesão na discursiva", "Temas prováveis"],
};

interface ModuleSpec {
  id: string;
  title: string;
  discipline: string;
  instructorId: string | null;
  kind?: "aula" | "pdf";
  lessons?: number;
  draftLessons?: number;
}

// Módulos do banco. Alguns são compartilhados entre cursos (o mesmo módulo, as mesmas aulas).
const MODULE_SPECS: ModuleSpec[] = [
  { id: "mod_bv_pf", title: "Boas-vindas e Edital", discipline: "Boas-vindas", instructorId: null, lessons: 4 },
  { id: "mod_lp", title: "Língua Portuguesa Aulas", discipline: "Língua Portuguesa", instructorId: "t_ricardo", lessons: 13 },
  { id: "mod_lp_pdf", title: "Língua Portuguesa PDFs", discipline: "Língua Portuguesa", instructorId: "t_ricardo", kind: "pdf", lessons: 9 },
  { id: "mod_dc", title: "Direito Constitucional Aulas", discipline: "Direito Constitucional", instructorId: "t_fernanda", lessons: 10 },
  { id: "mod_da", title: "Direito Administrativo Aulas", discipline: "Direito Administrativo", instructorId: "t_fernanda", lessons: 10 },
  { id: "mod_dp", title: "Direito Penal Aulas", discipline: "Direito Penal", instructorId: "t_marcos", lessons: 10 },
  { id: "mod_dp_pdf", title: "Direito Penal PDFs", discipline: "Direito Penal", instructorId: "t_marcos", kind: "pdf", lessons: 6 },
  { id: "mod_dpp", title: "Direito Processual Penal Aulas", discipline: "Direito Processual Penal", instructorId: "t_marcos", lessons: 9 },
  { id: "mod_lpe", title: "Legislação Penal Especial Aulas", discipline: "Legislação Penal Especial", instructorId: "t_camila", lessons: 9 },
  { id: "mod_inf", title: "Informática Aulas", discipline: "Informática", instructorId: "t_juliana", lessons: 10 },
  { id: "mod_inf_pdf", title: "Informática PDFs", discipline: "Informática", instructorId: "t_juliana", kind: "pdf", lessons: 5 },
  { id: "mod_rl", title: "Raciocínio Lógico Aulas", discipline: "Raciocínio Lógico", instructorId: "t_thiago", lessons: 9 },
  { id: "mod_est", title: "Estatística Aulas", discipline: "Estatística", instructorId: "t_thiago", lessons: 7, draftLessons: 2 },
  { id: "mod_cont", title: "Contabilidade Geral Aulas", discipline: "Contabilidade Geral", instructorId: "t_andre", lessons: 6 },
  { id: "mod_atu", title: "Atualidades Aulas", discipline: "Atualidades", instructorId: "t_patricia", lessons: 6 },
  { id: "mod_arq", title: "Arquivologia Aulas", discipline: "Arquivologia", instructorId: "t_andre", lessons: 5 },
  { id: "mod_dh", title: "Direitos Humanos Aulas", discipline: "Direitos Humanos", instructorId: "t_camila", lessons: 5 },
  { id: "mod_etica", title: "Ética no Serviço Público Aulas", discipline: "Ética no Serviço Público", instructorId: "t_patricia", lessons: 4 },
  { id: "mod_qc", title: "Questões Comentadas Cebraspe", discipline: "Questões Comentadas Cebraspe", instructorId: "t_thiago", lessons: 6 },
  { id: "mod_sim_pdf", title: "Simulados PDFs", discipline: "Simulados", instructorId: null, kind: "pdf", lessons: 4 },
  { id: "mod_rev", title: "Revisão Final Aulas", discipline: "Revisão Final", instructorId: "t_ricardo", lessons: 5, draftLessons: 5 },
  // Outros cursos
  { id: "mod_bv", title: "Boas-vindas", discipline: "Boas-vindas", instructorId: null, lessons: 3 },
  { id: "mod_lm", title: "Legislação Municipal Aulas", discipline: "Legislação Municipal", instructorId: "t_rafael", lessons: 5 },
  { id: "mod_lm_pdf", title: "Legislação Municipal PDFs", discipline: "Legislação Municipal", instructorId: "t_rafael", kind: "pdf", lessons: 4 },
  { id: "mod_hgce", title: "História e Geografia do Ceará Aulas", discipline: "História e Geografia do Ceará", instructorId: "t_rafael", lessons: 5 },
  { id: "mod_crim", title: "Criminologia Aulas", discipline: "Criminologia", instructorId: "t_larissa", lessons: 4 },
  { id: "mod_ml", title: "Medicina Legal Aulas", discipline: "Medicina Legal", instructorId: "t_larissa", lessons: 5 },
  { id: "mod_pcce", title: "Legislação da PCCE Aulas", discipline: "Legislação da PCCE", instructorId: "t_marcos", lessons: 3 },
  { id: "mod_dpm", title: "Direito Penal Militar Aulas", discipline: "Direito Penal Militar", instructorId: "t_marcos", lessons: 4 },
  { id: "mod_pmce", title: "Legislação da PMCE Aulas", discipline: "Legislação da PMCE", instructorId: "t_rafael", lessons: 3 },
  { id: "mod_dpc", title: "Direito Processual Civil Aulas", discipline: "Direito Processual Civil", instructorId: "t_fernanda", lessons: 5, draftLessons: 2 },
  { id: "mod_lep", title: "Execução Penal Aulas", discipline: "Execução Penal", instructorId: "t_camila", lessons: 4, draftLessons: 4 },
  // Guardados (não estão em nenhum curso): aparecem em "Usar módulo existente".
  { id: "mod_red", title: "Redação Discursiva Aulas", discipline: "Redação Discursiva", instructorId: "t_ricardo", lessons: 3 },
];

const pad = (n: number) => String(n).padStart(2, "0");

function makeLessons(spec: ModuleSpec, seed: number): LessonData[] {
  const r = rng(seed);
  const topics = TOPICS[spec.discipline] ?? ["Introdução"];
  const count = spec.lessons ?? topics.length;
  const pdf = spec.kind === "pdf";
  const drafts = spec.draftLessons ?? 0;
  return Array.from({ length: count }, (_, i) => {
    const topic = topics[i % topics.length] + (i >= topics.length ? " — parte 2" : "");
    const draft = i >= count - drafts;
    return {
      id: `${spec.id}_l${pad(i + 1)}`,
      title: pdf ? `PDF ${pad(i + 1)} – ${topic}` : `Aula ${pad(i + 1)} – ${topic}`,
      type: pdf ? "pdf" : "video",
      status: draft ? "draft" : "published",
      duration: pdf ? null : r.int(14, 58) * 60 + r.int(0, 59),
      videoUrl: pdf ? null : "demo",
      pdfUrl: pdf ? "demo.pdf" : null,
      description: null,
      isFree: false,
      isPreview: !pdf && i === 0,
      completionCriteria: "watch_80",
      materials: !pdf && r.chance(0.45) ? [{ id: `${spec.id}_m${i}`, title: `Resumo – ${topic}.pdf` }] : [],
    };
  });
}

export const MODULES: ModuleData[] = MODULE_SPECS.map((s, i) => ({
  id: s.id,
  title: s.title,
  instructorId: s.instructorId,
  coverImage: null,
  lessons: makeLessons(s, 500 + i * 31),
}));

const link = (ids: string[], drafts: string[] = []): CourseModuleLink[] => ids.map((moduleId) => ({ moduleId, isPublished: !drafts.includes(moduleId) }));

// Ordem dos módulos em cada curso (a publicação vale só no curso).
export const COURSE_MODULES: Record<string, CourseModuleLink[]> = {
  [SHOWCASE_COURSE_ID]: link(
    ["mod_bv_pf", "mod_lp", "mod_lp_pdf", "mod_dc", "mod_da", "mod_dp", "mod_dp_pdf", "mod_dpp", "mod_lpe", "mod_inf", "mod_inf_pdf", "mod_rl", "mod_est", "mod_cont", "mod_atu", "mod_arq", "mod_dh", "mod_etica", "mod_qc", "mod_sim_pdf", "mod_rev"],
    ["mod_rev"],
  ),
  cmbx7gm4c0002lexr2h8s1v6: link(["mod_bv", "mod_lp", "mod_lp_pdf", "mod_lm", "mod_lm_pdf", "mod_hgce", "mod_dc", "mod_inf", "mod_rl", "mod_dh", "mod_etica", "mod_atu"]),
  cmbx7pc3b0003lexm5t2q8z4: link(["mod_bv", "mod_lp", "mod_lp_pdf", "mod_dc", "mod_da", "mod_dp", "mod_dpp", "mod_lpe", "mod_crim", "mod_ml", "mod_pcce", "mod_inf", "mod_rl", "mod_dh"]),
  cmbx7pm5d0004lexk1w6n3y8: link(["mod_bv", "mod_lp", "mod_dc", "mod_dp", "mod_dpm", "mod_pmce", "mod_hgce", "mod_inf", "mod_rl", "mod_dh", "mod_atu"]),
  cmbx7tj6e0005lexp4c9r2u5: link(["mod_lp", "mod_dc", "mod_da", "mod_dpc", "mod_arq", "mod_etica"], ["mod_dpc", "mod_arq", "mod_etica"]),
  cmbx7pp7f0006lexs8e1t6j3: link(["mod_lp", "mod_lep", "mod_dh", "mod_inf"], ["mod_lep", "mod_dh", "mod_inf"]),
};
