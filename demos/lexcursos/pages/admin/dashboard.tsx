"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DollarSign, UserPlus, AlertTriangle, Plus } from "lucide-react";
import { MetricCard, PageHeader, SectionCard, ButtonLink } from "@/demos/lexcursos/components/admin/page-kit";
import { DemoExportButton } from "@/demos/lexcursos/components/admin/export-button";
import { formatCurrency, formatAgo, cn } from "@/demos/lexcursos/lib/cn";
import { useDemo, type DemoState } from "@/demos/lexcursos/lib/store";
import { ADMIN_ID } from "@/demos/lexcursos/mock/people";
import { to } from "@/demos/lexcursos/lib/paths";

type DashboardPeriod = "hoje" | "7d" | "30d" | "ano";
const PERIOD_LABEL: Record<DashboardPeriod, string> = { hoje: "hoje", "7d": "últimos 7 dias", "30d": "últimos 30 dias", ano: "este ano" };
const PERIODS: DashboardPeriod[] = ["hoje", "7d", "30d", "ano"];
const DAY = 60 * 24;
const DOW = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MON = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Fortaleza" }).format(new Date()));
  return hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
}

const change = (v: number | null, suffix: string) => (v === null ? undefined : `${v >= 0 ? "▲" : "▼"} ${Math.abs(v)}%${suffix}`);
const pct = (curr: number, prev: number) => (prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null);

const ACTIVITY_ICON = {
  paid: { icon: <DollarSign className="h-3.5 w-3.5" />, cls: "bg-ok-soft text-ok-text dark:bg-ok/15 dark:text-ok" },
  student: { icon: <UserPlus className="h-3.5 w-3.5" />, cls: "bg-brand-soft text-brand-dark dark:bg-brand/15 dark:text-brand" },
  error: { icon: <AlertTriangle className="h-3.5 w-3.5" />, cls: "bg-danger-soft text-danger dark:bg-danger/15" },
} as const;

// Mesmo cálculo de src/lib/dashboard.ts, sobre os dados em memória.
function getDashboardData(s: DemoState, period: DashboardPeriod) {
  const now = new Date();
  const minutesToday = now.getHours() * 60 + now.getMinutes();
  const minutesYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 60000);
  const span = period === "hoje" ? minutesToday : period === "7d" ? 6 * DAY + minutesToday : period === "30d" ? 29 * DAY + minutesToday : minutesYear;
  const inRange = (ago: number | null, from = 0, len = span) => ago !== null && ago >= from && ago <= from + len;

  const paid = s.orders.filter((o) => o.status === "paid");
  const revenue = paid.filter((o) => inRange(o.paidAgoMin)).reduce((t, o) => t + o.total, 0);
  const prevRevenue = paid.filter((o) => inRange(o.paidAgoMin, span)).reduce((t, o) => t + o.total, 0);
  const periodOrders = s.orders.filter((o) => inRange(o.createdAgoMin));
  const waiting = periodOrders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const students = s.users.filter((u) => u.role === "student");
  const newStudents = students.filter((u) => inRange(u.createdAgoMin)).length;
  const prevNewStudents = students.filter((u) => inRange(u.createdAgoMin, span)).length;
  const watchedHours = Math.round({ hoje: 41, "7d": 386, "30d": 1612, ano: 14870 }[period]);
  const topCourse = s.products.find((p) => p.id === "prd_pf")?.title ?? null;

  const buckets: { label: string; paid: number; pending: number }[] = [];
  if (period === "ano") {
    for (let m = 0; m <= now.getMonth(); m++) buckets.push({ label: MON[m], paid: 0, pending: 0 });
  } else {
    const days = period === "hoje" ? 1 : period === "7d" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * DAY * 60000);
      buckets.push({ label: days <= 7 ? DOW[d.getDay()] : String(d.getDate()), paid: 0, pending: 0 });
    }
  }
  for (const o of periodOrders) {
    if (o.status !== "paid" && o.status !== "pending" && o.status !== "processing") continue;
    const d = new Date(now.getTime() - o.createdAgoMin * 60000);
    const idx = period === "ano" ? d.getMonth() : buckets.length - 1 - Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / (DAY * 60000));
    const b = buckets[idx];
    if (!b) continue;
    if (o.status === "paid") b.paid += o.total; else b.pending += o.total;
  }

  const name = (id: string) => s.users.find((u) => u.id === id)?.name ?? "Aluno";
  const title = (id: string) => s.products.find((p) => p.id === id)?.title ?? "Produto";
  const activity = [
    ...paid.filter((o) => o.paidAgoMin !== null).sort((a, b) => a.paidAgoMin! - b.paidAgoMin!).slice(0, 4).map((o) => ({ kind: "paid" as const, ago: o.paidAgoMin!, title: `Pedido #${o.id.slice(-6).toUpperCase()} pago`, detail: `${name(o.userId).split(" ")[0]} · ${title(o.productId)}`, href: to(`/admin/orders?q=${o.id}`) })),
    ...students.slice(0, 3).map((u) => ({ kind: "student" as const, ago: u.createdAgoMin, title: "Nova conta cadastrada", detail: u.name, href: to("/admin/users") })),
    ...s.logs.filter((l) => l.action === "payment.webhook_failed" || l.action === "system.server_error").slice(0, 2).map((l) => ({ kind: "error" as const, ago: l.agoMin, title: l.action === "system.server_error" ? "Erro no sistema" : "Webhook de pagamento falhou", detail: l.action === "system.server_error" ? "Logs" : "Integrações", href: to("/admin/logs?nivel=erro") })),
  ].sort((a, b) => a.ago - b.ago).slice(0, 6);

  return {
    revenue, revenueChange: pct(revenue, prevRevenue), orders: periodOrders.length, waiting,
    newStudents, newStudentsChange: pct(newStudents, prevNewStudents), watchedHours, topCourse, series: buckets, activity,
  };
}

export function AdminDashboardPage() {
  const s = useDemo();
  const periodo = useSearchParams().get("periodo");
  const period: DashboardPeriod = PERIODS.includes(periodo as DashboardPeriod) ? (periodo as DashboardPeriod) : "7d";
  const d = useMemo(() => getDashboardData(s, period), [s, period]);

  const today = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Fortaleza" }).format(new Date());
  const firstName = (s.users.find((u) => u.id === ADMIN_ID)?.name ?? "").split(" ")[0] || "Admin";
  const max = Math.max(1, ...d.series.map((b) => b.paid + b.pending));
  const prevLabel = period === "hoje" ? " vs ontem" : period === "ano" ? " vs ano anterior" : " vs período anterior";

  return (
    <div>
      <PageHeader
        title={<span suppressHydrationWarning>{`${greeting()}, ${firstName}`}</span>}
        subtitle={<><span className="capitalize" suppressHydrationWarning>{today}</span> · {PERIOD_LABEL[period]}</>}
        actions={<>
          <DemoExportButton filename={`dashboard-${period}.csv`} rows={() => [["Dia", "Pagos", "Pendentes"], ...d.series.map((b) => [b.label, b.paid.toFixed(2), b.pending.toFixed(2)])]}>Exportar</DemoExportButton>
          <ButtonLink href={to("/admin/courses?novo=1")} variant="primary"><Plus className="h-4 w-4" /> Novo curso</ButtonLink>
        </>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <MetricCard label="Receita" value={formatCurrency(d.revenue)} hint={change(d.revenueChange, prevLabel)} hintTone={d.revenueChange !== null && d.revenueChange < 0 ? "down" : "up"} />
        <MetricCard label="Pedidos" value={d.orders} hint={d.waiting > 0 ? `${d.waiting} aguardando pagamento` : "nenhum pendente"} hintTone={d.waiting > 0 ? "brand" : "muted"} />
        <MetricCard label="Novos alunos" value={d.newStudents} hint={change(d.newStudentsChange, "")} hintTone={d.newStudentsChange !== null && d.newStudentsChange < 0 ? "down" : "up"} />
        <MetricCard dark label="Horas assistidas" value={`${d.watchedHours.toLocaleString("pt-BR")}h`} hint={d.topCourse ? `Mais visto: ${d.topCourse}` : "sem aulas assistidas no período"} hintTone="brand" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <SectionCard
          title={period === "ano" ? "Vendas por mês" : "Vendas por dia"}
          action={
            <span className="flex items-center gap-3 text-[11px] text-foreground-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-brand" /> Pagos</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-line-strong dark:bg-white/20" /> Pendentes</span>
            </span>
          }
        >
          {d.series.every((b) => b.paid + b.pending === 0) ? (
            <p className="px-[18px] pb-10 pt-6 text-center text-sm text-foreground-muted">Nenhuma venda no período.</p>
          ) : (
            <div className="flex h-[260px] items-end gap-1.5 px-[18px] pb-3 pt-4 sm:gap-2.5">
              {d.series.map((b, i) => {
                const total = b.paid + b.pending;
                const last = i === d.series.length - 1;
                return (
                  <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5" title={`${b.label}: ${formatCurrency(b.paid)} pagos · ${formatCurrency(b.pending)} pendentes`}>
                    <div className="flex w-full flex-col justify-end overflow-hidden rounded-t-md" style={{ height: `${Math.max(2, (total / max) * 100)}%` }}>
                      {b.pending > 0 && <div className="w-full bg-line-strong dark:bg-white/20" style={{ height: `${(b.pending / total) * 100}%` }} />}
                      {b.paid > 0 && <div className="w-full bg-brand" style={{ height: `${(b.paid / total) * 100}%` }} />}
                    </div>
                    <span className={cn("truncate text-[10px]", last ? "font-bold text-foreground" : "text-foreground-muted")}>{b.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Atividade recente">
          {d.activity.length === 0 ? (
            <p className="px-[18px] pb-8 pt-4 text-center text-sm text-foreground-muted">Nada por aqui ainda.</p>
          ) : (
            <ul className="divide-y divide-line-soft px-[18px] pb-2 dark:divide-white/10">
              {d.activity.map((a, i) => (
                <li key={i}>
                  <Link href={a.href} className="flex items-start gap-3 py-3 hover:opacity-80">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", ACTIVITY_ICON[a.kind].cls)}>{ACTIVITY_ICON[a.kind].icon}</span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-semibold text-foreground">{a.title}</span>
                      <span className="block truncate text-[11.5px] text-foreground-muted">
                        {a.detail} · {formatAgo(a.ago)}
                        {a.kind === "error" && <span className="text-brand"> · ver log</span>}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
