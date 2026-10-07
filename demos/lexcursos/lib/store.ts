import { useSyncExternalStore } from "react";
import type {
  AuditLog, Coupon, CourseModuleLink, Enrollment, LessonData, ModuleData, Order, PlatformSettingsData, Product, ProductLevel, User, UserKind, UserRole, UserStatus,
} from "./types";
import { MODULES, COURSE_MODULES, PRODUCTS } from "@/demos/lexcursos/mock/catalog";
import { STAFF, TEACHERS, ADMIN_ID, NO_LOGIN, makeStudents } from "@/demos/lexcursos/mock/people";
import { makeCommerce, makeLogs, DEFAULT_SETTINGS } from "@/demos/lexcursos/mock/commerce";
import type { EditorLesson, EditorModule } from "@/demos/lexcursos/components/course/module-board/types";
import { slugify } from "./cn";

// Banco em memória da réplica. Substitui o Prisma + server actions do original:
// as telas leem daqui e as ações alteram este estado (só no navegador, sem rede).
// Recarregar a página volta aos dados de exemplo.

export interface DemoState {
  products: Product[];
  modules: Record<string, ModuleData>;
  courseModules: Record<string, CourseModuleLink[]>;
  users: User[];
  enrollments: Enrollment[];
  orders: Order[];
  coupons: Coupon[];
  logs: AuditLog[];
  settings: PlatformSettingsData;
  payoutsPaid: Record<string, number>; // professor → valor já repassado no período corrente
  theme: "light" | "dark";
}

function createInitialState(): DemoState {
  const students = makeStudents(220);
  const { enrollments, orders, coupons } = makeCommerce(students, PRODUCTS);
  return {
    products: PRODUCTS,
    modules: Object.fromEntries(MODULES.map((m) => [m.id, m])),
    courseModules: COURSE_MODULES,
    users: [...STAFF, ...TEACHERS, ...students],
    enrollments,
    orders,
    coupons,
    logs: makeLogs(orders, students),
    settings: DEFAULT_SETTINGS,
    payoutsPaid: {},
    theme: "light",
  };
}

const initialState = createInitialState();
let state = initialState;
const listeners = new Set<() => void>();
let seq = 0;
const newId = (prefix: string) => `${prefix}_${Date.now().toString(36)}${(seq++).toString(36)}`;

function setState(update: (s: DemoState) => DemoState) {
  state = update(state);
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Estado inteiro (referência estável até a próxima alteração). */
export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, () => state, () => initialState);
}

type Result = { success: true } | { success: false; error: string };
const ok: Result = { success: true };

function log(action: string, resourceType: string, resourceId: string | null, metadata: Record<string, unknown> = {}) {
  setState((s) => ({ ...s, logs: [{ id: newId("log"), actorId: ADMIN_ID, action, resourceType, resourceId, metadata, ipAddress: "127.0.0.1", agoMin: 0 }, ...s.logs] }));
}

// ── Leituras derivadas ────────────────────────────────────────────────────
export const productByCourse = (s: DemoState, courseId: string) => s.products.find((p) => p.courseId === courseId);
export const userName = (s: DemoState, id: string | null) => (id ? s.users.find((u) => u.id === id)?.name ?? null : null);

function toEditorLesson(l: LessonData): EditorLesson {
  return {
    id: l.id, title: l.title, type: l.type, status: l.status, order: 0, duration: l.duration,
    videoUrl: l.videoUrl, previewUrl: l.videoUrl ? "demo" : null, thumbUrl: null, videoPublicId: l.videoUrl ? `vid_${l.id}` : null,
    pdfUrl: l.pdfUrl, description: l.description, isFree: l.isFree, isPreview: l.isPreview, completionCriteria: l.completionCriteria, materials: l.materials,
  };
}

/** Módulos de um curso no formato que a área de módulos recebe (src/lib/editor-modules.ts). */
export function editorModules(s: DemoState, courseId: string): EditorModule[] {
  return (s.courseModules[courseId] ?? []).map((link, order) => {
    const m = s.modules[link.moduleId];
    const usedIn = Object.entries(s.courseModules)
      .filter(([cid, links]) => cid !== courseId && links.some((l) => l.moduleId === m.id))
      .map(([cid]) => productByCourse(s, cid)?.title ?? "Curso");
    return {
      id: m.id, title: m.title, order, isPublished: link.isPublished,
      instructorId: m.instructorId, instructorName: userName(s, m.instructorId), instructorAvatar: null,
      coverImage: m.coverImage, canEdit: true, usedIn,
      lessons: m.lessons.map((l, i) => ({ ...toEditorLesson(l), order: i })),
    };
  });
}

export function courseTotals(s: DemoState, courseId: string) {
  const mods = (s.courseModules[courseId] ?? []).map((l) => s.modules[l.moduleId]);
  const lessons = mods.flatMap((m) => m.lessons);
  return { modules: mods.length, totalLessons: lessons.length, totalDuration: lessons.reduce((t, l) => t + (l.duration ?? 0), 0) };
}

export function classifyUser(s: DemoState, u: User): { kind: UserKind; active: Enrollment[]; all: Enrollment[] } {
  if (u.role === "admin" || u.role === "moderator") return { kind: "equipe", active: [], all: [] };
  if (u.role === "teacher") return { kind: "professor", active: [], all: [] };
  const all = s.enrollments.filter((e) => e.userId === u.id);
  const active = all.filter((e) => e.status === "active" || e.status === "completed");
  const product = (e: Enrollment) => s.products.find((p) => p.id === e.productId);
  if (active.some((e) => product(e)?.type === "subscription")) return { kind: "assinante", active, all };
  if (active.length > 0) return { kind: "aluno", active, all };
  return { kind: all.length > 0 ? "encerrado" : "cadastrado", active, all };
}

// ── Cursos ────────────────────────────────────────────────────────────────
export interface CourseInput {
  title: string; shortDescription: string; description: string; price: number; comparePrice?: number;
  categoryName: string; level: ProductLevel; thumbnail: string; heroColor: string;
}

const patchProduct = (id: string, patch: Partial<Product>) =>
  setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));

export function updateCourseStatus(productId: string, status: "published" | "draft"): Result {
  patchProduct(productId, { status });
  log(status === "published" ? "product.published" : "product.unpublished", "product", productId);
  return ok;
}

export function updateCourseDetails(productId: string, input: CourseInput): Result {
  if (!Number.isFinite(input.price) || input.price < 0) return { success: false, error: "Preço inválido." };
  patchProduct(productId, { ...input });
  log("product.updated", "product", productId, { title: input.title });
  return ok;
}

export function createCourse(input: CourseInput): { success: true; courseId: string } | { success: false; error: string } {
  if (!Number.isFinite(input.price) || input.price < 0) return { success: false, error: "Preço inválido." };
  const courseId = newId("course");
  const product: Product = {
    ...input, id: newId("prd"), slug: slugify(input.title), courseId, type: "course", status: "draft", isPublic: true, isFeatured: false,
    enrolledCount: 0, createdAgoMin: 0,
  };
  setState((s) => ({ ...s, products: [product, ...s.products], courseModules: { ...s.courseModules, [courseId]: [] } }));
  log("product.created", "product", product.id, { title: input.title });
  return { success: true, courseId };
}

export function deleteCourse(productId: string): Result {
  const p = state.products.find((x) => x.id === productId);
  if (p && p.enrolledCount > 0) return { success: false, error: "Este curso tem alunos matriculados. Despublique em vez de excluir." };
  setState((s) => {
    const cm = { ...s.courseModules };
    if (p?.courseId) delete cm[p.courseId];
    return { ...s, products: s.products.filter((x) => x.id !== productId), courseModules: cm };
  });
  log("product.deleted", "product", productId, { title: p?.title });
  return ok;
}

// ── Módulos ───────────────────────────────────────────────────────────────
const setLinks = (courseId: string, fn: (links: CourseModuleLink[]) => CourseModuleLink[]) =>
  setState((s) => ({ ...s, courseModules: { ...s.courseModules, [courseId]: fn(s.courseModules[courseId] ?? []) } }));
const patchModule = (moduleId: string, fn: (m: ModuleData) => ModuleData) =>
  setState((s) => ({ ...s, modules: { ...s.modules, [moduleId]: fn(s.modules[moduleId]) } }));

export function createModule(courseId: string, title: string, instructorId: string | null, cover: string | null): Result {
  const id = newId("mod");
  setState((s) => ({ ...s, modules: { ...s.modules, [id]: { id, title: title.trim(), instructorId, coverImage: cover, lessons: [] } } }));
  setLinks(courseId, (l) => [...l, { moduleId: id, isPublished: false }]);
  log("module.created", "module", id, { title });
  return ok;
}

export function renameModule(moduleId: string, title: string, instructorId: string | null | undefined, cover: string | null): Result {
  patchModule(moduleId, (m) => ({ ...m, title: title.trim(), instructorId: instructorId === undefined ? m.instructorId : instructorId, coverImage: cover }));
  log("module.updated", "module", moduleId, { title });
  return ok;
}

export function setModuleCover(moduleId: string, url: string | null): Result {
  patchModule(moduleId, (m) => ({ ...m, coverImage: url }));
  return ok;
}

export function deleteModule(moduleId: string): Result {
  setState((s) => {
    const modules = { ...s.modules };
    delete modules[moduleId];
    return { ...s, modules };
  });
  log("module.deleted", "module", moduleId);
  return ok;
}

export function moveModule(courseId: string, moduleId: string, dir: "up" | "down"): Result {
  setLinks(courseId, (links) => {
    const i = links.findIndex((l) => l.moduleId === moduleId);
    const j = dir === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= links.length) return links;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  return ok;
}

export function reorderModules(courseId: string, ids: string[]): Result {
  setLinks(courseId, (links) => ids.map((id) => links.find((l) => l.moduleId === id)!).filter(Boolean));
  return ok;
}

export function setModulePublished(courseId: string, moduleId: string, published: boolean): Result {
  setLinks(courseId, (links) => links.map((l) => (l.moduleId === moduleId ? { ...l, isPublished: published } : l)));
  return ok;
}

export function detachModule(courseId: string, moduleId: string): { success: true; orphan: boolean; canDelete: boolean } {
  setLinks(courseId, (links) => links.filter((l) => l.moduleId !== moduleId));
  const orphan = !Object.values(state.courseModules).some((links) => links.some((l) => l.moduleId === moduleId));
  return { success: true, orphan, canDelete: true };
}

export function attachModule(courseId: string, moduleId: string): Result {
  if ((state.courseModules[courseId] ?? []).some((l) => l.moduleId === moduleId)) return { success: false, error: "Este módulo já está no curso." };
  setLinks(courseId, (l) => [...l, { moduleId, isPublished: true }]);
  return ok;
}

export function listAttachableModules(courseId: string, search: string) {
  const s = state;
  const inCourse = new Set((s.courseModules[courseId] ?? []).map((l) => l.moduleId));
  const q = search.trim().toLowerCase();
  return Object.values(s.modules)
    .filter((m) => !inCourse.has(m.id) && (!q || m.title.toLowerCase().includes(q)))
    .map((m) => ({
      id: m.id, title: m.title, lessonCount: m.lessons.length, instructorName: userName(s, m.instructorId),
      usedIn: Object.entries(s.courseModules).filter(([, links]) => links.some((l) => l.moduleId === m.id)).map(([cid]) => productByCourse(s, cid)?.title ?? "Curso"),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

export function publishAllLessons(moduleId: string): Result {
  patchModule(moduleId, (m) => ({ ...m, lessons: m.lessons.map((l) => ({ ...l, status: "published" })) }));
  return ok;
}

// ── Aulas ─────────────────────────────────────────────────────────────────
const findLessonModule = (lessonId: string) => Object.values(state.modules).find((m) => m.lessons.some((l) => l.id === lessonId));
const patchLesson = (lessonId: string, fn: (l: LessonData) => LessonData) => {
  const m = findLessonModule(lessonId);
  if (m) patchModule(m.id, (mod) => ({ ...mod, lessons: mod.lessons.map((l) => (l.id === lessonId ? fn(l) : l)) }));
};

export type LessonInput = Omit<LessonData, "id" | "status" | "materials"> & { materials?: { id: string; title: string }[] };

export function createLesson(moduleId: string, input: LessonInput): Result {
  const lesson: LessonData = { ...input, id: newId("lesson"), status: "published", materials: input.materials ?? [] };
  patchModule(moduleId, (m) => ({ ...m, lessons: [...m.lessons, lesson] }));
  log("lesson.created", "lesson", lesson.id, { title: input.title });
  return ok;
}

export function updateLesson(lessonId: string, input: LessonInput): Result {
  patchLesson(lessonId, (l) => ({ ...l, ...input, materials: input.materials ?? l.materials }));
  log("lesson.updated", "lesson", lessonId, { title: input.title });
  return ok;
}

export function updateLessonStatus(lessonId: string, status: "published" | "draft"): Result {
  patchLesson(lessonId, (l) => ({ ...l, status }));
  return ok;
}

export function deleteLesson(lessonId: string): Result {
  const m = findLessonModule(lessonId);
  if (m) patchModule(m.id, (mod) => ({ ...mod, lessons: mod.lessons.filter((l) => l.id !== lessonId) }));
  log("lesson.deleted", "lesson", lessonId);
  return ok;
}

export function moveLesson(moduleId: string, lessonId: string, dir: "up" | "down"): Result {
  patchModule(moduleId, (m) => {
    const i = m.lessons.findIndex((l) => l.id === lessonId);
    const j = dir === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= m.lessons.length) return m;
    const lessons = [...m.lessons];
    [lessons[i], lessons[j]] = [lessons[j], lessons[i]];
    return { ...m, lessons };
  });
  return ok;
}

// ── Usuários ──────────────────────────────────────────────────────────────
const patchUser = (id: string, patch: Partial<User>) => setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
const tempPassword = () => `Lex-${Math.random().toString(36).slice(2, 8)}`;

export function createUserByAdmin(input: { name: string; email: string; role: UserRole }): { success: true; tempPassword: string } | { success: false; error: string } {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "E-mail inválido." };
  if (state.users.some((u) => u.email === email)) return { success: false, error: "Já existe um usuário com este e-mail." };
  const user: User = { id: newId("usr"), name: input.name.trim(), email, role: input.role, status: "active", createdAgoMin: 0 };
  setState((s) => ({ ...s, users: [user, ...s.users] }));
  log("user.created", "user", user.id, { email, role: input.role });
  return { success: true, tempPassword: tempPassword() };
}

export function updateUserRole(id: string, role: UserRole): Result {
  if (id === ADMIN_ID && role !== "admin") return { success: false, error: "Você não pode remover o seu próprio acesso de admin." };
  patchUser(id, { role });
  log("user.updated", "user", id, { role });
  return ok;
}

export function updateUserStatus(id: string, status: UserStatus): Result {
  if (id === ADMIN_ID) return { success: false, error: "Você não pode bloquear a sua própria conta." };
  patchUser(id, { status });
  log(status === "banned" ? "user.banned" : "user.updated", "user", id, { status });
  return ok;
}

export function updateUserEmail(id: string, email: string): Result {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { success: false, error: "E-mail inválido." };
  if (state.users.some((u) => u.email === e && u.id !== id)) return { success: false, error: "Este e-mail já está em uso." };
  patchUser(id, { email: e });
  return ok;
}

export function saveTeacher(input: { id?: string; name: string; bio: string; avatar: string }): Result {
  if (input.name.trim().length < 2) return { success: false, error: "Informe o nome." };
  if (input.id) patchUser(input.id, { name: input.name.trim(), bio: input.bio, avatar: input.avatar || undefined });
  else {
    const id = newId("t");
    setState((s) => ({ ...s, users: [{ id, name: input.name.trim(), bio: input.bio, avatar: input.avatar || undefined, email: `${slugify(input.name)}${NO_LOGIN}`, role: "teacher", status: "active", createdAgoMin: 0 }, ...s.users] }));
  }
  return ok;
}

export function importUsersCsv(text: string) {
  const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results: { name: string; email: string; status: "criado" | "erro"; error?: string; password?: string }[] = [];
  for (const row of rows) {
    const [name = "", email = "", papel = "aluno"] = row.split(/[;,]/).map((c) => c.trim());
    if (/^nome$/i.test(name)) continue;
    const role: UserRole = /prof/i.test(papel) ? "teacher" : /admin/i.test(papel) ? "admin" : "student";
    const res = createUserByAdmin({ name, email, role });
    results.push(res.success ? { name, email, status: "criado", password: res.tempPassword } : { name, email, status: "erro", error: res.error });
  }
  return { success: true as const, created: results.filter((r) => r.status === "criado").length, results };
}

export function updateProfile(input: { name: string; bio: string; phone: string; location: string }): Result {
  if (input.name.trim().length < 2) return { success: false, error: "Informe o nome." };
  patchUser(ADMIN_ID, input);
  return ok;
}

export function updateAvatar(url: string): Result {
  patchUser(ADMIN_ID, { avatar: url || undefined });
  return ok;
}

// ── Pedidos ───────────────────────────────────────────────────────────────
const patchOrder = (id: string, patch: Partial<Order>) => setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));

export function refundOrder(id: string): Result {
  patchOrder(id, { status: "refunded", mpStatusDetail: "refunded" });
  log("order.refunded", "order", id, { status: "refunded" });
  return ok;
}

export function releaseOrderAccess(id: string): Result {
  patchOrder(id, { status: "paid", paidAgoMin: 0, mpStatusDetail: "liberado manualmente" });
  log("order.manual_release", "order", id, { status: "paid" });
  return ok;
}

export function cancelOrder(id: string): Result {
  patchOrder(id, { status: "cancelled", mpStatusDetail: "cancelado pelo admin" });
  log("order.cancelled", "order", id, { status: "cancelled" });
  return ok;
}

// ── Financeiro ────────────────────────────────────────────────────────────
export function createCoupon(input: { code: string; type: "percentage" | "fixed"; value: number; maxUses: number | null; expiresAt: string | null }): Result {
  const code = input.code.trim().toUpperCase();
  if (code.length < 3) return { success: false, error: "O código precisa ter pelo menos 3 caracteres." };
  if (!Number.isFinite(input.value) || input.value <= 0) return { success: false, error: "Informe o desconto." };
  if (input.type === "percentage" && input.value > 100) return { success: false, error: "Percentual máximo: 100%." };
  if (state.coupons.some((c) => c.code === code)) return { success: false, error: "Já existe um cupom com este código." };
  setState((s) => ({ ...s, coupons: [{ id: newId("cp"), code, type: input.type, value: input.value, usedCount: 0, maxUses: input.maxUses, expiresAt: input.expiresAt ? new Date(input.expiresAt).toISOString() : null, isActive: true }, ...s.coupons] }));
  return ok;
}

export function toggleCoupon(id: string): Result & { message?: string } {
  const c = state.coupons.find((x) => x.id === id);
  setState((s) => ({ ...s, coupons: s.coupons.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x)) }));
  return { success: true, message: c?.isActive ? "Cupom desativado." : "Cupom ativado." };
}

export function deleteCoupon(id: string): Result & { message?: string } {
  setState((s) => ({ ...s, coupons: s.coupons.filter((x) => x.id !== id) }));
  return { success: true, message: "Cupom excluído." };
}

export function processPayouts(rows: { teacherId: string; due: number }[]): Result {
  setState((s) => {
    const paid = { ...s.payoutsPaid };
    for (const r of rows) paid[r.teacherId] = (paid[r.teacherId] ?? 0) + r.due;
    return { ...s, payoutsPaid: paid };
  });
  log("payout.processed", "payout", null);
  return ok;
}

export function savePlatformSettings(settings: PlatformSettingsData): Result {
  setState((s) => ({ ...s, settings }));
  log("settings.updated", "settings", null);
  return ok;
}

export function setTheme(theme: "light" | "dark") {
  setState((s) => ({ ...s, theme }));
}
