"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MetricCard, PageHeader, SectionCard, Pill, tableHeadClass } from "@/demos/lexcursos/components/admin/page-kit";
import { DemoExportButton } from "@/demos/lexcursos/components/admin/export-button";
import { CdnImg } from "@/demos/lexcursos/components/ui/cdn-img";
import { formatCurrency, formatNumber, cn } from "@/demos/lexcursos/lib/cn";
import { courseTotals, editorModules, useDemo, type DemoState } from "@/demos/lexcursos/lib/store";
import { to } from "@/demos/lexcursos/lib/paths";
import { rng } from "@/demos/lexcursos/mock/rand";

const initials = (name: string | null, fallback: string) =>
  name ? name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() : fallback;

// Engajamento sintético por curso (o original agrega o progresso das aulas no banco).
function getCourseEngagement(s: DemoState, courseId: string, days: number) {
  const p = s.products.find((x) => x.courseId === courseId)!;
  const enrolled = s.enrollments.filter((e) => e.productId === p.id);
  const base = Math.max(enrolled.length, Math.round(p.enrolledCount * 0.6));
  const r = rng(courseId.length * 131 + days);
  const factor = days === 7 ? 0.42 : 1;
  const activeStudents = Math.round(base * (days === 7 ? 0.38 : 0.71));
  const modules = editorModules(s, courseId).map((m, i, all) => {
    const decay = 1 - (i / Math.max(1, all.length)) * 0.75;
    const students = Math.max(0, Math.round(base * decay * (0.85 + r.next() * 0.15)));
    const completion = m.lessons.length === 0 ? 0 : Math.max(3, Math.min(96, Math.round(decay * 78 - r.next() * 14)));
    return {
      id: m.id, title: m.title, instructor: m.instructorName, lessons: m.lessons.length, students, completion,
      avgMinutes: Math.round(12 + r.next() * 34), abandonment: Math.max(4, Math.min(62, Math.round((1 - decay) * 55 + r.next() * 12))),
    };
  });
  return {
    enrolled: base, activeStudents, baseShare: base ? Math.round((activeStudents / base) * 100) : 0,
    watchedHours: Math.round(activeStudents * 3.4 * factor), avgCompletion: enrolled.length ? Math.round(enrolled.reduce((t, e) => t + e.progress, 0) / enrolled.length) : 0,
    pdfDownloads: Math.round(activeStudents * 2.6 * factor), completedLessons: Math.round(activeStudents * 7.8 * factor), modules,
  };
}

// Analytics (modelo 5g). ?relatorio=geral|engajamento, ?curso=<courseId>, ?dias=7|30.
export function AdminAnalyticsPage() {
  const s = useDemo();
  const sp = useSearchParams();
  const days = sp.get("dias") === "7" ? 7 : 30;
  const courses = s.products.filter((p) => p.type === "course" && p.courseId).sort((a, b) => b.enrolledCount - a.enrolledCount);
  const view = sp.get("relatorio") === "geral" || courses.length === 0 ? "geral" : "engajamento";
  const selected = courses.find((c) => c.courseId === sp.get("curso")) ?? courses[0];
  const e = useMemo(() => (view === "engajamento" && selected ? getCourseEngagement(s, selected.courseId!, days) : null), [s, view, selected, days]);

  if (view === "geral" || !e || !selected) {
    const students = s.users.filter((u) => u.role === "student");
    const monthMin = (new Date().getDate() - 1) * 24 * 60 + new Date().getHours() * 60;
    const revenue = s.orders.filter((o) => o.status === "paid" && o.paidAgoMin !== null && o.paidAgoMin <= monthMin).reduce((t, o) => t + o.total, 0);
    const prev = s.orders.filter((o) => o.status === "paid" && o.paidAgoMin !== null && o.paidAgoMin > monthMin && o.paidAgoMin <= monthMin + 30 * 24 * 60).reduce((t, o) => t + o.total, 0);
    const revenueChange = prev === 0 ? (revenue > 0 ? 100 : 0) : Math.round(((revenue - prev) / prev) * 1000) / 10;
    const completionRate = s.enrollments.length ? s.enrollments.reduce((t, x) => t + x.progress, 0) / s.enrollments.length : 0;
    const list = courses.map((p) => {
      const en = s.enrollments.filter((x) => x.productId === p.id);
      return {
        productId: p.id, title: p.title, thumbnail: p.thumbnail, enrollments: en.length,
        completionRate: en.length ? en.reduce((t, x) => t + x.progress, 0) / en.length : 0,
        watchTimeHours: Math.round(courseTotals(s, p.courseId!).totalDuration / 3600 * en.length * 0.35),
        revenue: s.orders.filter((o) => o.status === "paid" && o.productId === p.id).reduce((t, o) => t + o.total, 0),
      };
    });
    return (
      <div>
        <PageHeader title="Visão geral" subtitle="Números da plataforma · mês atual" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <MetricCard label="Total de alunos" value={formatNumber(students.length)} hint={`+${students.filter((u) => u.createdAgoMin <= monthMin).length} este mês`} hintTone="up" />
          <MetricCard label="Cursos publicados" value={formatNumber(courses.filter((p) => p.status === "published").length)} hint="+0 este mês" />
          <MetricCard label="Receita do mês" value={formatCurrency(revenue)} hint={`${revenueChange >= 0 ? "▲" : "▼"} ${Math.abs(revenueChange)}% vs mês anterior`} hintTone={revenueChange < 0 ? "down" : "up"} />
          <MetricCard label="Conclusão média" value={`${completionRate.toFixed(0)}%`} hint="progresso médio das matrículas" />
        </div>
        <SectionCard title="Por curso" className="mt-4">
          <div className={cn("hidden grid-cols-[minmax(220px,2fr)_100px_110px_100px_120px] gap-3 border-y border-line-soft bg-[#faf8f5] px-[18px] py-2.5 md:grid dark:border-white/10 dark:bg-white/5", tableHeadClass)}>
            <span>Curso</span><span>Matrículas</span><span>Conclusão</span><span>Horas</span><span>Receita</span>
          </div>
          {list.map((c) => (
            <div key={c.productId} className="grid grid-cols-2 items-center gap-3 border-b border-line-soft px-[18px] py-3 text-[13px] last:border-0 md:grid-cols-[minmax(220px,2fr)_100px_110px_100px_120px] dark:border-white/10">
              <span className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                <CdnImg width={56} src={c.thumbnail} aspect="16:10" alt="" className="h-[30px] w-12 shrink-0 rounded-md bg-navy object-cover" />
                <span className="truncate font-semibold text-foreground">{c.title}</span>
              </span>
              <span className="text-foreground">{c.enrollments} <span className="text-foreground-muted md:hidden">matrículas</span></span>
              <span className="text-foreground">{c.completionRate.toFixed(0)}% <span className="text-foreground-muted md:hidden">conclusão</span></span>
              <span className="text-foreground-muted">{c.watchTimeHours}h</span>
              <span className="font-semibold text-foreground">{formatCurrency(c.revenue)}</span>
            </div>
          ))}
          {list.length === 0 && <p className="py-10 text-center text-sm text-foreground-muted">Nenhum curso ainda.</p>}
        </SectionCard>
      </div>
    );
  }

  const qs = (patch: Record<string, string>) => {
    const next = new URLSearchParams({ relatorio: "engajamento", curso: selected.courseId!, dias: String(days), ...patch });
    return to(`/admin/analytics?${next}`);
  };

  return (
    <div>
      <PageHeader title="Engajamento" subtitle={`${selected.title} · últimos ${days} dias`}
        actions={<DemoExportButton filename={`engajamento-${days}d.csv`} rows={() => [["Módulo", "Alunos", "Conclusão %", "Tempo médio (min)", "Abandono %"], ...e.modules.map((m) => [m.title, m.students, m.completion, m.avgMinutes, m.abandonment])]}>Exportar CSV</DemoExportButton>} />

      {courses.length > 1 && (
        <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
          {courses.map((c) => (
            <Link key={c.id} href={qs({ curso: c.courseId! })}
              className={cn("inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-semibold",
                c.id === selected.id ? "border-navy bg-navy text-white" : "border-line-strong bg-card text-ink-2 dark:border-white/10 dark:text-foreground-muted")}>
              {c.title}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <MetricCard label="Alunos ativos" value={formatNumber(e.activeStudents)} hint={e.enrolled ? `${e.baseShare}% da base (${e.enrolled})` : "sem matrículas"} />
        <MetricCard label="Horas assistidas" value={`${formatNumber(e.watchedHours)}h`} hint={`últimos ${days} dias`} />
        <MetricCard label="Conclusão média" value={`${e.avgCompletion}%`} hint="das matrículas do curso" />
        <MetricCard label="PDFs baixados" value={formatNumber(e.pdfDownloads)} hint={`${formatNumber(e.completedLessons)} aulas concluídas no período`} />
      </div>

      <SectionCard title="Por módulo" action={<span className="text-[11px] text-foreground-muted">desde o início · abandono = parado há 14+ dias</span>} className="mt-4">
        <div className={cn("hidden grid-cols-[minmax(220px,2fr)_80px_minmax(160px,1.4fr)_90px_90px] gap-3 border-y border-line-soft bg-[#faf8f5] px-[18px] py-2.5 md:grid dark:border-white/10 dark:bg-white/5", tableHeadClass)}>
          <span>Módulo</span><span>Alunos</span><span>Conclusão</span><span>Tempo médio</span><span>Abandono</span>
        </div>
        {e.modules.map((m, i) => (
          <div key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-b border-line-soft px-[18px] py-3 last:border-0 md:grid-cols-[minmax(220px,2fr)_80px_minmax(160px,1.4fr)_90px_90px] dark:border-white/10">
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-[30px] w-12 shrink-0 place-items-end justify-start rounded-md bg-navy px-1.5 pb-0.5 text-[10px] font-extrabold text-brand">{initials(m.instructor, String(i + 1).padStart(2, "0"))}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-bold text-foreground">{m.title}</span>
                <span className="block truncate text-[11px] text-foreground-muted">{m.instructor ? `Prof. ${m.instructor.split(" ")[0]}` : "sem professor"} · {m.lessons} aulas</span>
              </span>
            </span>
            <span className="text-right text-[13.5px] text-foreground md:text-left">{m.students}</span>
            <span className="col-span-2 flex items-center gap-2 md:col-span-1">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft dark:bg-white/10">
                <span className={cn("block h-full rounded-full", m.completion < 25 ? "bg-danger" : "bg-brand")} style={{ width: `${m.completion}%` }} />
              </span>
              <span className="w-9 text-right text-[12.5px] font-semibold text-foreground">{m.completion}%</span>
            </span>
            <span className="text-[13px] text-foreground-muted">{m.avgMinutes} min</span>
            <span><Pill tone={m.abandonment >= 40 ? "danger" : m.abandonment >= 20 ? "brand" : "ok"}>{m.abandonment}%</Pill></span>
          </div>
        ))}
        {e.modules.length === 0 && <p className="py-10 text-center text-sm text-foreground-muted">Este curso ainda não tem módulos.</p>}
      </SectionCard>
    </div>
  );
}
