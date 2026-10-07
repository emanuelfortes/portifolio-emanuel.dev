import type { User } from "@/demos/lexcursos/lib/types";
import { rng, cuid } from "./rand";

// Pessoas fictícias (nenhum dado real de alunos, professores ou equipe).

export const ADMIN_ID = "usr_admin";
export const NO_LOGIN = "@sem-acesso.lexcursos.site";

export const TEACHERS: User[] = [
  { id: "t_ricardo", name: "Ricardo Albuquerque", bio: "Professor de Língua Portuguesa para concursos há 12 anos." },
  { id: "t_fernanda", name: "Fernanda Lins", bio: "Analista judiciária, professora de Direito Constitucional e Administrativo." },
  { id: "t_marcos", name: "Marcos Teixeira", bio: "Delegado de polícia, professor de Direito Penal e Processo Penal." },
  { id: "t_juliana", name: "Juliana Prado", bio: "Perita em informática, professora de Informática e Segurança da Informação." },
  { id: "t_thiago", name: "Thiago Nogueira", bio: "Professor de Raciocínio Lógico e Estatística." },
  { id: "t_camila", name: "Camila Rocha", bio: "Professora de Legislação Especial e Direitos Humanos." },
  { id: "t_andre", name: "André Siqueira", bio: "Contador, professor de Contabilidade e Arquivologia." },
  { id: "t_patricia", name: "Patrícia Moura", bio: "Jornalista, professora de Atualidades e Ética." },
  { id: "t_rafael", name: "Rafael Bezerra", bio: "Professor de Legislação Municipal e História do Ceará." },
  { id: "t_larissa", name: "Larissa Campos", bio: "Médica legista, professora de Medicina Legal e Criminologia." },
].map((t, i) => ({
  ...t,
  email: `${t.id.slice(2)}.${i + 1}${NO_LOGIN}`,
  role: "teacher" as const,
  status: "active" as const,
  createdAgoMin: 60 * 24 * (200 - i * 9),
}));

export const STAFF: User[] = [
  { id: ADMIN_ID, name: "Lucas Andrade", email: "admin@lexconcursos.demo", role: "admin", status: "active", phone: "(85) 90000-0000", location: "Fortaleza, CE", bio: "", createdAgoMin: 60 * 24 * 320, lastLoginAgoMin: 0 },
  { id: "usr_mod", name: "Beatriz Lima", email: "beatriz@lexconcursos.demo", role: "moderator", status: "active", createdAgoMin: 60 * 24 * 180, lastLoginAgoMin: 60 * 26 },
  { id: "usr_admin2", name: "Henrique Duarte", email: "financeiro@lexconcursos.demo", role: "admin", status: "active", createdAgoMin: 60 * 24 * 150, lastLoginAgoMin: 60 * 24 * 3 },
];

const FIRST = ["Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe", "Gabriela", "Heitor", "Isabela", "João", "Karina", "Leonardo", "Mariana", "Nicolas", "Olívia", "Pedro", "Queila", "Rodrigo", "Sabrina", "Tiago", "Vanessa", "Wesley", "Yasmin", "Caio", "Letícia", "Matheus", "Natália", "Otávio", "Paula", "Renan", "Sara", "Vitor", "Alice", "Davi", "Elisa", "Gustavo", "Helena", "Igor", "Jéssica", "Kauã"];
const LAST = ["Silva", "Souza", "Oliveira", "Pereira", "Lima", "Carvalho", "Ferreira", "Rodrigues", "Almeida", "Costa", "Gomes", "Martins", "Araújo", "Barbosa", "Ribeiro", "Cavalcante", "Freitas", "Holanda", "Macedo", "Pinheiro", "Sampaio", "Teles", "Vasconcelos", "Moreira", "Brito", "Castro"];

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Alunos fictícios: nomes combinados e e-mails em domínio de exemplo. */
export function makeStudents(count: number): User[] {
  const r = rng(42);
  const used = new Set<string>();
  const out: User[] = [];
  for (let i = 0; out.length < count; i++) {
    const name = `${r.pick(FIRST)} ${r.pick(LAST)}${r.chance(0.45) ? ` ${r.pick(LAST)}` : ""}`;
    if (used.has(name)) continue;
    used.add(name);
    const parts = name.split(" ");
    const email = `${strip(parts[0])}.${strip(parts[parts.length - 1])}${r.int(1, 99)}@email.com`;
    // Contas mais novas primeiro (o original ordena por criação).
    const created = Math.round(60 * 24 * (0.15 + out.length * 0.55 + r.next() * 0.5));
    const neverLogged = r.chance(0.08);
    out.push({
      id: cuid(1000 + i),
      name,
      email,
      role: "student",
      status: r.chance(0.04) ? "banned" : r.chance(0.05) ? "inactive" : "active",
      createdAgoMin: created,
      lastLoginAgoMin: neverLogged ? undefined : Math.min(created, Math.round(r.next() ** 2 * 60 * 24 * 20)),
    });
  }
  return out;
}
