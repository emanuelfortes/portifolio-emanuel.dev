import type { AuditLog, Coupon, Enrollment, Order, OrderStatus, PaymentMethod, PlatformSettingsData, Product, User } from "@/demos/lexcursos/lib/types";
import { ADMIN_ID } from "./people";
import { rng, cuid } from "./rand";

// Matrículas, pedidos, cupons e logs fictícios, derivados dos alunos de exemplo.

const DAY = 60 * 24;

export function makeCommerce(students: User[], products: Product[]) {
  const r = rng(7);
  const sellable = products.filter((p) => p.status === "published" && p.type === "course");
  const combo = products.find((p) => p.type === "bundle")!;
  const subscription = products.find((p) => p.type === "subscription")!;
  // Peso de venda de cada curso (proporcional aos matriculados).
  const weighted = sellable.flatMap((p) => Array(Math.max(1, Math.round(p.enrolledCount / 60))).fill(p) as Product[]);

  const enrollments: Enrollment[] = [];
  const orders: Order[] = [];
  let seq = 0;
  const method = (): PaymentMethod => { const x = r.next(); return x < 0.58 ? "pix" : x < 0.9 ? "credit_card" : "boleto"; };
  const order = (u: User, p: Product, status: OrderStatus, createdAgoMin: number, paid: boolean): Order => {
    const m = method();
    const coupon = r.chance(0.18) ? (r.chance(0.6) ? "LEX10" : "APROVA15") : null;
    const discount = coupon ? Math.round(p.price * (coupon === "LEX10" ? 0.1 : 0.15) * 100) / 100 : 0;
    return {
      id: cuid(5000 + seq++), userId: u.id, productId: p.id, paymentMethod: status === "failed" ? "credit_card" : m,
      total: Math.round((p.price - discount) * 100) / 100, discount, couponCode: coupon, status, createdAgoMin,
      paidAgoMin: paid ? Math.max(0, createdAgoMin - (m === "pix" ? r.int(1, 20) : m === "boleto" ? r.int(DAY, 2 * DAY) : r.int(0, 3))) : null,
      mpOrderId: `ORD01J${String(80000000 + seq * 7919).slice(0, 8)}`,
      mpStatusDetail: status === "paid" ? "accredited" : status === "pending" ? (m === "boleto" ? "pending_waiting_payment" : "pending_waiting_transfer") : status === "failed" ? "cc_rejected_insufficient_amount" : status === "refunded" ? "refunded" : status === "cancelled" ? "expired" : null,
    };
  };

  for (const u of students) {
    const roll = r.next();
    const placedAgo = Math.max(30, u.createdAgoMin - r.int(0, 60 * 6));
    if (roll < 0.62) {
      // Aluno com acesso válido (às vezes dois cursos ou combo).
      const p = r.chance(0.06) ? combo : r.chance(0.05) ? subscription : r.pick(weighted);
      orders.push(order(u, p, "paid", placedAgo, true));
      const owned = p.id === combo.id ? sellable.filter((x) => x.id === "prd_pf" || x.id === "prd_pcce") : [p];
      for (const x of owned) {
        const progress = Math.min(100, Math.round(r.next() ** 1.3 * 105));
        enrollments.push({ userId: u.id, productId: x.id, progress, status: progress >= 100 ? "completed" : "active" });
      }
      if (r.chance(0.12) && p.type === "course") {
        const second = r.pick(sellable.filter((x) => x.id !== p.id));
        const ago = Math.max(10, placedAgo - r.int(DAY, 20 * DAY));
        orders.push(order(u, second, "paid", ago, true));
        enrollments.push({ userId: u.id, productId: second.id, progress: r.int(0, 40), status: "active" });
      }
    } else if (roll < 0.72) {
      // Acesso encerrado (reembolso ou acesso vencido).
      const p = r.pick(weighted);
      const refunded = r.chance(0.5);
      orders.push(order(u, p, refunded ? "refunded" : "paid", placedAgo, true));
      enrollments.push({ userId: u.id, productId: p.id, progress: r.int(5, 60), status: refunded ? "cancelled" : "expired" });
    } else if (roll < 0.84) {
      // Cadastrado com pedido em aberto, cancelado ou recusado.
      const p = r.pick(weighted);
      const s: OrderStatus = placedAgo < 3 * DAY ? (r.chance(0.8) ? "pending" : "processing") : r.chance(0.7) ? "cancelled" : "failed";
      orders.push(order(u, p, s, placedAgo, false));
    }
    // Restante: só cadastro, sem compra.
  }

  orders.sort((a, b) => a.createdAgoMin - b.createdAgoMin);

  const coupons: Coupon[] = [
    { id: "cp1", code: "LEX10", type: "percentage", value: 10, usedCount: orders.filter((o) => o.couponCode === "LEX10").length, maxUses: null, expiresAt: null, isActive: true },
    { id: "cp2", code: "APROVA15", type: "percentage", value: 15, usedCount: orders.filter((o) => o.couponCode === "APROVA15").length, maxUses: 200, expiresAt: "2026-12-31T00:00:00.000Z", isActive: true },
    { id: "cp3", code: "BLACKLEX", type: "fixed", value: 100, usedCount: 0, maxUses: 50, expiresAt: "2025-11-30T00:00:00.000Z", isActive: false },
    { id: "cp4", code: "CORTESIA100", type: "percentage", value: 100, usedCount: 0, maxUses: 5, expiresAt: null, isActive: true },
  ];

  return { enrollments, orders, coupons };
}

export function makeLogs(orders: Order[], students: User[]): AuditLog[] {
  const r = rng(99);
  const logs: AuditLog[] = [];
  let n = 0;
  const push = (l: Omit<AuditLog, "id">) => logs.push({ id: cuid(9000 + n++), ...l });
  const ip = () => `177.${r.int(10, 250)}.${r.int(0, 255)}.${r.int(1, 254)}`;
  for (const o of orders.slice(0, 40)) {
    if (o.status === "paid") push({ actorId: null, action: "payment.approved", resourceType: "order", resourceId: o.id, metadata: { status: "approved", method: o.paymentMethod }, ipAddress: null, agoMin: o.paidAgoMin ?? o.createdAgoMin });
    else if (o.status === "refunded") push({ actorId: ADMIN_ID, action: "order.refunded", resourceType: "order", resourceId: o.id, metadata: { status: "refunded" }, ipAddress: ip(), agoMin: Math.max(1, o.createdAgoMin - DAY) });
    else if (o.status === "failed") push({ actorId: null, action: "payment.failed", resourceType: "order", resourceId: o.id, metadata: { status: "rejected", error: "cc_rejected_insufficient_amount" }, ipAddress: null, agoMin: o.createdAgoMin });
    push({ actorId: o.userId, action: "order.created", resourceType: "order", resourceId: o.id, metadata: { method: o.paymentMethod }, ipAddress: ip(), agoMin: o.createdAgoMin + 1 });
  }
  for (const u of students.slice(0, 12)) push({ actorId: u.id, action: "user.registered", resourceType: "user", resourceId: u.id, metadata: { email: u.email }, ipAddress: ip(), agoMin: u.createdAgoMin });
  push({ actorId: null, action: "payment.webhook_failed", resourceType: "webhook", resourceId: "evt_83721", metadata: { error: "timeout ao consultar pagamento", path: "/api/mercadopago/webhook" }, ipAddress: null, agoMin: 60 * 30 });
  push({ actorId: null, action: "system.server_error", resourceType: "system", resourceId: null, metadata: { error: "Tempo esgotado ao gerar link do vídeo", path: "/student/player" }, ipAddress: null, agoMin: 60 * 52 });
  push({ actorId: ADMIN_ID, action: "lesson.created", resourceType: "lesson", resourceId: "mod_est_l07", metadata: { title: "Aula 07 – Correlação e regressão" }, ipAddress: ip(), agoMin: 60 * 5 });
  push({ actorId: ADMIN_ID, action: "module.updated", resourceType: "module", resourceId: "mod_rev", metadata: { title: "Revisão Final Aulas" }, ipAddress: ip(), agoMin: 60 * 7 });
  push({ actorId: ADMIN_ID, action: "product.updated", resourceType: "product", resourceId: "prd_pf", metadata: { title: "Polícia Federal — Agente e Escrivão" }, ipAddress: ip(), agoMin: 60 * 20 });
  push({ actorId: ADMIN_ID, action: "settings.updated", resourceType: "settings", resourceId: null, metadata: {}, ipAddress: ip(), agoMin: DAY * 3 });
  push({ actorId: "usr_mod", action: "user.updated", resourceType: "user", resourceId: students[3]?.id ?? null, metadata: { role: "student", status: "active" }, ipAddress: ip(), agoMin: DAY * 2 });
  push({ actorId: ADMIN_ID, action: "user.banned", resourceType: "user", resourceId: students[9]?.id ?? null, metadata: { status: "banned" }, ipAddress: ip(), agoMin: DAY * 4 });
  push({ actorId: ADMIN_ID, action: "payout.processed", resourceType: "payout", resourceId: null, metadata: { title: "Repasses de setembro" }, ipAddress: ip(), agoMin: DAY * 6 });
  push({ actorId: ADMIN_ID, action: "order.manual_release", resourceType: "order", resourceId: orders[30]?.id ?? null, metadata: { status: "paid" }, ipAddress: ip(), agoMin: DAY * 5 });
  push({ actorId: "usr_admin2", action: "user.password_reset", resourceType: "user", resourceId: students[14]?.id ?? null, metadata: { email: students[14]?.email ?? "" }, ipAddress: ip(), agoMin: DAY + 300 });
  return logs.sort((a, b) => a.agoMin - b.agoMin);
}

export const DEFAULT_SETTINGS: PlatformSettingsData = {
  general: { name: "LEX Concursos", tagline: "Sua aprovação começa aqui", supportEmail: "suporte@lexconcursos.com", currency: "BRL" },
  gamification: { xpEnabled: true, achievementsEnabled: true, rankingEnabled: true, streakEnabled: true, xpPerLesson: 50, xpPerCourse: 1000 },
  integrations: { googleAnalyticsId: "G-DEMO12345", metaPixelId: "", whatsappNumber: "+55 85 90000-0000" },
  company: { legalName: "LEX Concursos (exemplo)", cnpj: "00.000.000/0001-00", address: "Endereço de exemplo", city: "Fortaleza/CE", contactEmail: "contato@lexconcursos.demo", dpoName: "", dpoEmail: "" },
  finance: { gatewayFeePercent: 4.99, teacherCommissionPercent: 30 },
};
