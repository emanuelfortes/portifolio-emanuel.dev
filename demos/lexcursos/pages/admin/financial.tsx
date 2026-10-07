"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { ActionButton } from "@/demos/lexcursos/components/admin/action-button";
import { DemoExportButton } from "@/demos/lexcursos/components/admin/export-button";
import { MetricCard, PageHeader, SectionCard, Pill, tableHeadClass } from "@/demos/lexcursos/components/admin/page-kit";
import { Dialog, DialogFooter } from "@/demos/lexcursos/components/ui/dialog";
import { Button } from "@/demos/lexcursos/components/ui/button";
import { Input } from "@/demos/lexcursos/components/ui/input";
import { Select } from "@/demos/lexcursos/components/ui/select";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { formatCurrency, formatDate, cn } from "@/demos/lexcursos/lib/cn";
import { createCoupon, deleteCoupon, processPayouts, toggleCoupon, useDemo, type DemoState } from "@/demos/lexcursos/lib/store";

// Financeiro (page.tsx + src/lib/financial.ts do original) sobre os pedidos em memória.

type FinancePeriod = "atual" | "anterior" | "ano";
const PERIODS: FinancePeriod[] = ["atual", "anterior", "ano"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const METHOD: Record<string, string> = { pix: "PIX", credit_card: "Cartão de crédito", debit_card: "Cartão de débito", boleto: "Boleto", paypal: "PayPal" };

function financeRange(period: FinancePeriod, now = new Date()) {
  const y = now.getFullYear(), m = now.getMonth();
  const ms = (yy: number, mm: number) => new Date(yy, mm, 1).getTime();
  if (period === "ano") return { start: ms(y, 0), end: now.getTime(), prevStart: ms(y - 1, 0), prevEnd: ms(y, 0), label: String(y), prevLabel: String(y - 1), byMonth: true };
  if (period === "anterior") return { start: ms(y, m - 1), end: ms(y, m), prevStart: ms(y, m - 2), prevEnd: ms(y, m - 1), label: `${MONTHS[(m + 11) % 12]} ${m === 0 ? y - 1 : y}`, prevLabel: MONTHS[(m + 10) % 12].slice(0, 3).toLowerCase(), byMonth: false };
  return { start: ms(y, m), end: now.getTime(), prevStart: ms(y, m - 1), prevEnd: ms(y, m), label: `${MONTHS[m]} ${y}`, prevLabel: MONTHS[(m + 11) % 12].slice(0, 3).toLowerCase(), byMonth: false };
}

function getFinanceData(s: DemoState, period: FinancePeriod) {
  const now = Date.now();
  const r = financeRange(period);
  const at = (ago: number) => now - ago * 60000;
  const paidAll = s.orders.filter((o) => o.status === "paid" && o.paidAgoMin !== null).map((o) => ({ ...o, t: at(o.paidAgoMin!) }));
  const paid = paidAll.filter((o) => o.t >= r.start && o.t < r.end);
  const prevPaid = paidAll.filter((o) => o.t >= r.prevStart && o.t < r.prevEnd);
  const refunded = s.orders.filter((o) => (o.status === "refunded" || o.status === "chargeback") && at(o.createdAgoMin) >= r.start && at(o.createdAgoMin) < r.end).reduce((t, o) => t + o.total, 0);
  const pending = s.orders.filter((o) => (o.status === "pending" || o.status === "processing") && at(o.createdAgoMin) >= r.start && at(o.createdAgoMin) < r.end);
  const gross = paid.reduce((t, o) => t + o.total, 0);
  const prevGross = prevPaid.reduce((t, o) => t + o.total, 0);
  const feePercent = s.settings.finance.gatewayFeePercent;
  const fees = Math.round(gross * feePercent) / 100;

  const byMethod = new Map<string, { label: string; total: number; count: number }>();
  for (const o of paid) {
    const k = o.paymentMethod ?? "outro";
    const cur = byMethod.get(k) ?? { label: METHOD[k] ?? "Outro", total: 0, count: 0 };
    cur.total += o.total; cur.count++;
    byMethod.set(k, cur);
  }

  const cumulative = (rows: { t: number; total: number }[], start: number, end: number) => {
    const sorted = [...rows].sort((a, b) => a.t - b.t);
    const points: { label: string; value: number }[] = [];
    let acc = 0, i = 0;
    if (r.byMonth) {
      const year = new Date(start).getFullYear();
      for (let m = 0; m < 12; m++) {
        if (new Date(year, m, 1).getTime() > end) break;
        const until = new Date(year, m + 1, 1).getTime();
        while (i < sorted.length && sorted[i].t < until) acc += sorted[i++].total;
        points.push({ label: MONTHS[m].slice(0, 3), value: acc });
      }
    } else {
      for (let d = start; d < end; d += 86_400_000) {
        while (i < sorted.length && sorted[i].t < d + 86_400_000) acc += sorted[i++].total;
        points.push({ label: String(new Date(d).getDate()), value: acc });
      }
    }
    return points;
  };
  const current = cumulative(paid, r.start, r.end);

  // Repasses: comissão% de cada venda, dividida entre os professores dos módulos do curso.
  const rate = s.settings.finance.teacherCommissionPercent / 100;
  const owed = new Map<string, number>();
  for (const o of paid) {
    const p = s.products.find((x) => x.id === o.productId);
    const mods = p?.courseId ? (s.courseModules[p.courseId] ?? []).map((l) => s.modules[l.moduleId]) : [];
    for (const m of mods) if (m?.instructorId) owed.set(m.instructorId, (owed.get(m.instructorId) ?? 0) + (o.total * rate) / mods.length);
  }
  const rows = Array.from(owed.entries()).map(([teacherId, value]) => {
    const t = s.users.find((u) => u.id === teacherId);
    const total = Math.round(value * 100) / 100;
    const alreadyPaid = period === "atual" ? s.payoutsPaid[teacherId] ?? 0 : total;
    return { teacherId, name: t?.name ?? "Professor", modules: Object.values(s.modules).filter((m) => m.instructorId === teacherId).length, total, paid: alreadyPaid, due: Math.max(0, Math.round((total - alreadyPaid) * 100) / 100) };
  }).sort((a, b) => b.due - a.due);

  return {
    label: r.label, prevLabel: r.prevLabel, gross, grossChange: prevGross > 0 ? Math.round(((gross - prevGross) / prevGross) * 100) : null,
    refunded, fees, feePercent, deductionsShare: gross > 0 ? Math.round(((refunded + fees) / gross) * 1000) / 10 : 0, net: gross - refunded - fees,
    pendingTotal: pending.reduce((t, o) => t + o.total, 0), pendingCount: pending.length, salesCount: paid.length,
    current, previous: cumulative(prevPaid, r.prevStart, r.prevEnd).slice(0, Math.max(current.length, 1)),
    methods: Array.from(byMethod.values()).sort((a, b) => b.total - a.total),
    payouts: { rows, totalDue: rows.reduce((t, x) => t + x.due, 0), rate: s.settings.finance.teacherCommissionPercent },
  };
}

// Linha de receita acumulada (atual) + período anterior tracejado.
function CumulativeChart({ current, previous }: { current: { label: string; value: number }[]; previous: { label: string; value: number }[] }) {
  const W = 600, H = 240, PAD = 8;
  const n = Math.max(current.length, previous.length, 2);
  const max = Math.max(1, ...current.map((p) => p.value), ...previous.map((p) => p.value));
  const x = (i: number) => PAD + (i / (n - 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const line = (pts: { value: number }[]) => pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = current.length > 1 ? `${line(current)} L${x(current.length - 1).toFixed(1)} ${H - PAD} L${x(0)} ${H - PAD} Z` : "";
  const ticks = [0, Math.floor((current.length - 1) / 3), Math.floor((2 * (current.length - 1)) / 3), current.length - 1].filter((v, i, a) => v >= 0 && a.indexOf(v) === i);
  return (
    <div className="px-[18px] pb-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[240px] w-full" preserveAspectRatio="none" role="img" aria-label="Receita acumulada no período">
        <defs>
          <linearGradient id="fin-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f26a1b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f26a1b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {previous.length > 1 && <path d={line(previous)} fill="none" stroke="currentColor" className="text-line-strong dark:text-white/25" strokeWidth="3" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />}
        {area && <path d={area} fill="url(#fin-area)" />}
        {current.length > 1 && <path d={line(current)} fill="none" stroke="#f26a1b" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-foreground-muted">
        {ticks.map((t, i) => <span key={t}>{i === ticks.length - 1 && t > 0 ? "hoje" : current[t]?.label}</span>)}
      </div>
    </div>
  );
}

const EMPTY = { code: "", type: "percentage" as "percentage" | "fixed", value: "", maxUses: "", expiresAt: "", minOrderValue: "" };
const num = (v: string) => Number(v.replace(/\./g, "").replace(",", "."));

function NewCouponDialog() {
  const { success, error } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  function save() {
    const res = createCoupon({ code: form.code, type: form.type, value: num(form.value), maxUses: form.maxUses ? Number(form.maxUses) : null, expiresAt: form.expiresAt || null });
    if (!res.success) { error(res.error); return; }
    success(`Cupom ${form.code.trim().toUpperCase()} criado.`);
    setForm(EMPTY);
    setOpen(false);
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>Novo cupom</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Novo cupom" description="O aluno digita o código no checkout e o desconto é aplicado na hora.">
        <div className="space-y-4">
          <Input label="Código" placeholder="LEX10" value={form.code} onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/\s/g, "") })} autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" value={form.type} onChange={(e) => set({ type: e.target.value as "percentage" | "fixed" })}
              options={[{ value: "percentage", label: "Percentual (%)" }, { value: "fixed", label: "Valor fixo (R$)" }]} />
            <Input label={form.type === "percentage" ? "Desconto (%)" : "Desconto (R$)"} inputMode="decimal" placeholder={form.type === "percentage" ? "10" : "50,00"}
              value={form.value} onChange={(e) => set({ value: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Limite de usos (opcional)" type="number" min="1" placeholder="sem limite" value={form.maxUses} onChange={(e) => set({ maxUses: e.target.value })} />
            <Input label="Válido até (opcional)" type="date" value={form.expiresAt} onChange={(e) => set({ expiresAt: e.target.value })} />
          </div>
          <Input label="Valor mínimo do pedido em R$ (opcional)" inputMode="decimal" placeholder="sem mínimo" value={form.minOrderValue} onChange={(e) => set({ minOrderValue: e.target.value })} />
          <p className="text-xs text-foreground-muted">Cupom de 100% libera o curso na hora, sem pagamento (útil para cortesias).</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={save} disabled={!form.code || !form.value}>Criar cupom</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function AdminFinancialPage() {
  const s = useDemo();
  const params = useSearchParams();
  const mes = params.get("mes"), visao = params.get("visao");
  const period: FinancePeriod = PERIODS.includes(mes as FinancePeriod) ? (mes as FinancePeriod) : "atual";
  const d = useMemo(() => getFinanceData(s, period), [s, period]);
  const payouts = d.payouts;
  const initials = (n: string) => n.split(/s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const coupons = visao === "cupons" ? s.coupons : [];

  const methodsCard = (
    <SectionCard title="Formas de pagamento">
      {d.methods.length === 0 ? (
        <p className="px-[18px] pb-8 pt-2 text-center text-sm text-foreground-muted">Nenhum pagamento no período.</p>
      ) : (
        <ul className="divide-y divide-line-soft px-[18px] pb-2 dark:divide-white/10">
          {d.methods.map((m) => {
            const share = d.gross > 0 ? Math.round((m.total / d.gross) * 100) : 0;
            return (
              <li key={m.label} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13.5px] font-semibold text-foreground">{m.label}</span>
                  <span className="text-[13.5px] font-bold text-foreground">{formatCurrency(m.total)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft dark:bg-white/10"><div className="h-full rounded-full bg-brand" style={{ width: `${share}%` }} /></div>
                  <span className="w-20 text-right text-[11px] text-foreground-muted">{share}% · {m.count} venda{m.count !== 1 ? "s" : ""}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {d.pendingCount > 0 && (
        <p className="border-t border-line-soft px-[18px] py-3 text-xs text-foreground-muted dark:border-white/10">
          + {formatCurrency(d.pendingTotal)} aguardando pagamento ({d.pendingCount} pedido{d.pendingCount !== 1 ? "s" : ""})
        </p>
      )}
    </SectionCard>
  );

  return (
    <div>
      <PageHeader title={d.label} subtitle="Receita bruta, taxas e líquido do período"
        actions={<DemoExportButton filename={`financeiro-${period}.csv`} rows={() => [["Forma de pagamento", "Total", "Vendas"], ...d.methods.map((m) => [m.label, m.total.toFixed(2), m.count]), ["Receita bruta", d.gross.toFixed(2), d.salesCount], ["Líquido", d.net.toFixed(2), ""]]}>Exportar relatório</DemoExportButton>} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <MetricCard label="Receita bruta" value={formatCurrency(d.gross)}
          hint={d.grossChange === null ? `${d.salesCount} venda${d.salesCount !== 1 ? "s" : ""}` : `${d.grossChange >= 0 ? "▲" : "▼"} ${Math.abs(d.grossChange)}% vs ${d.prevLabel}`}
          hintTone={d.grossChange !== null && d.grossChange < 0 ? "down" : d.grossChange === null ? "muted" : "up"} />
        <MetricCard label="Taxas + reembolsos" value={`− ${formatCurrency(d.fees + d.refunded)}`} valueTone={d.fees + d.refunded > 0 ? "danger" : undefined}
          hint={`${d.deductionsShare.toString().replace(".", ",")}% da receita · taxa estimada ${d.feePercent.toString().replace(".", ",")}%`} />
        <MetricCard label="Líquido" value={formatCurrency(d.net)} hint={payouts.totalDue > 0 ? `${formatCurrency(payouts.totalDue)} a repassar` : "sem repasses pendentes"} hintTone={payouts.totalDue > 0 ? "brand" : "muted"} />
      </div>

      {visao === "cupons" ? (
        <SectionCard title="Cupons" className="mt-4" action={<NewCouponDialog />}>
          <div className="overflow-x-auto"><div className="min-w-[760px]">
          <div className={cn("grid grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr_0.8fr_1.4fr] gap-3 border-y border-line-soft bg-[#faf8f5] px-[18px] py-2.5 dark:border-white/10 dark:bg-white/5", tableHeadClass)}>
            <span>Código</span><span>Tipo</span><span>Desconto</span><span>Usos</span><span>Expira</span><span>Status</span><span />
          </div>
          {coupons.map((c) => (
            <div key={c.id} className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr_0.8fr_1.4fr] items-center gap-3 border-b border-line-soft px-[18px] py-3 text-[13px] last:border-0 dark:border-white/10">
              <span className="font-mono font-semibold text-foreground">{c.code}</span>
              <span className="text-foreground-muted">{c.type === "percentage" ? "Percentual" : "Fixo"}</span>
              <span className="text-foreground">{c.type === "percentage" ? `${c.value}%` : formatCurrency(c.value)}</span>
              <span className="text-foreground-muted">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}</span>
              <span className="text-foreground-muted">{c.expiresAt ? formatDate(c.expiresAt) : "—"}</span>
              <span><Pill tone={c.isActive ? "ok" : "gray"}>{c.isActive ? "Ativo" : "Inativo"}</Pill></span>
              <span className="flex justify-end gap-2">
                <ActionButton variant="ghost" action={() => toggleCoupon(c.id)} className="h-8 px-3 text-xs">{c.isActive ? "Desativar" : "Ativar"}</ActionButton>
                {c.usedCount === 0 && <ActionButton variant="ghost" action={() => deleteCoupon(c.id)} confirmText={`Excluir o cupom ${c.code}?`} className="h-8 px-3 text-xs text-danger">Excluir</ActionButton>}
              </span>
            </div>
          ))}
          </div></div>
          {coupons.length === 0 && <p className="py-10 text-center text-sm text-foreground-muted">Nenhum cupom cadastrado. Clique em “Novo cupom”.</p>}
        </SectionCard>
      ) : visao === "pagamentos" ? (
        <div className="mt-4">{methodsCard}</div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <SectionCard title="Receita acumulada"
            action={<span className="flex items-center gap-3 text-[11px] text-foreground-muted">
              <span className="flex items-center gap-1"><span className="h-0.5 w-4 bg-brand" /> {d.label}</span>
              <span className="flex items-center gap-1"><span className="h-0.5 w-4 border-t-2 border-dashed border-line-strong dark:border-white/30" /> {d.prevLabel}</span>
            </span>}>
            {d.gross === 0 && d.previous.every((p) => p.value === 0) ? (
              <p className="px-[18px] pb-10 pt-6 text-center text-sm text-foreground-muted">Nenhuma venda no período.</p>
            ) : (
              <CumulativeChart current={d.current} previous={d.previous} />
            )}
          </SectionCard>
          <SectionCard title="Repasses pendentes" action={<span className="text-[11px] text-foreground-muted">comissão {payouts.rate}%</span>}>
            {payouts.rows.length === 0 ? (
              <p className="px-[18px] pb-8 pt-2 text-center text-sm text-foreground-muted">Nenhuma venda com módulo de professor no período.</p>
            ) : (
              <ul className="divide-y divide-line-soft px-[18px] dark:divide-white/10">
                {payouts.rows.map((t) => (
                  <li key={t.teacherId} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-extrabold text-brand">{initials(t.name)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-foreground">Prof. {t.name.split(" ")[0]}</span>
                      <span className="block text-[11px] text-foreground-muted">{t.modules} módulo{t.modules !== 1 ? "s" : ""}{t.paid > 0 ? ` · já pago ${formatCurrency(t.paid)}` : ""}</span>
                    </span>
                    <span className={cn("text-[13.5px] font-bold", t.due > 0 ? "text-foreground" : "text-foreground-muted")}>{formatCurrency(t.due)}</span>
                  </li>
                ))}
              </ul>
            )}
            {payouts.totalDue > 0 && (
              <div className="p-[18px] pt-2">
                <ActionButton action={() => processPayouts(payouts.rows)} okText="Repasses registrados como pagos." className="w-full"
                  confirmText={`Registrar ${formatCurrency(payouts.totalDue)} como pagos aos professores (${d.label})? Faça o PIX/transferência fora da plataforma.`}>
                  Processar repasses · {formatCurrency(payouts.totalDue)}
                </ActionButton>
              </div>
            )}
          </SectionCard>
        </div>
      )}
      {!visao && <div className="mt-4">{methodsCard}</div>}
    </div>
  );
}
