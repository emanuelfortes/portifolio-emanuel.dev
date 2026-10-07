"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreditCard, PlayCircle, Image as ImageIcon, Mail, Database, BarChart3, MessageCircle, AlertCircle, Plus, ChevronDown, Copy } from "lucide-react";
import { PageHeader, Pill, ButtonLink, tableHeadClass } from "@/demos/lexcursos/components/admin/page-kit";
import { ActionButton } from "@/demos/lexcursos/components/admin/action-button";
import { DemoExportButton } from "@/demos/lexcursos/components/admin/export-button";
import { CdnImg } from "@/demos/lexcursos/components/ui/cdn-img";
import { CreateCourseDialog } from "@/demos/lexcursos/components/course/create-course-dialog";
import { AccountProfileForm } from "@/demos/lexcursos/components/profile/account-profile-form";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { formatAgo, formatCurrency, cn } from "@/demos/lexcursos/lib/cn";
import { editorModules, useDemo } from "@/demos/lexcursos/lib/store";
import { ADMIN_ID } from "@/demos/lexcursos/mock/people";
import { to } from "@/demos/lexcursos/lib/paths";

// Integrações, Logs, Produtos e Meu perfil do admin original, sobre os dados em memória.

// ── Integrações ───────────────────────────────────────────────────────────
type Status = "ok" | "error" | "off";
const TESTABLE = new Set(["mp", "bunny", "cloudinary", "email", "db"]);
const STATUS_LABEL: Record<Status, string> = { ok: "Conectado", error: "Erro", off: "Não configurado" };
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AdminIntegrationsPage() {
  const s = useDemo();
  const params = useSearchParams();
  const status = params.get("status"), categoria = params.get("categoria");
  const lastFailure = s.logs.find((l) => l.action === "payment.webhook_failed");
  const lastPaid = s.orders.filter((o) => o.status === "paid" && o.paidAgoMin !== null).sort((a, b) => a.paidAgoMin! - b.paidAgoMin!)[0];
  const videos = Object.values(s.modules).flatMap((m) => m.lessons).filter((l) => l.videoUrl).length;
  const recentFailure = !!lastFailure && lastFailure.agoMin < 24 * 60 * 2;

  const services: { id: string; name: string; desc: string; category: string; icon: React.ReactNode; status: Status; detail: string; href?: string }[] = [
    {
      id: "mp", name: "Gateway de pagamento", desc: "Mercado Pago · Pix, boleto e cartão", category: "pagamentos", icon: <CreditCard className="h-4 w-4" />,
      status: recentFailure ? "error" : "ok",
      detail: recentFailure ? `Último erro: webhook · ${formatAgo(lastFailure!.agoMin)}` : lastPaid ? `Última venda: ${formatAgo(lastPaid.paidAgoMin!)}` : "Nenhuma venda ainda",
      href: recentFailure ? to("/admin/logs?nivel=erro&origem=pagamentos") : undefined,
    },
    { id: "bunny", name: "Hospedagem de vídeo", desc: "Bunny Stream · upload, HLS e player", category: "video", icon: <PlayCircle className="h-4 w-4" />, status: "ok", detail: `${videos} vídeos · links protegidos por token` },
    { id: "cloudinary", name: "Imagens e PDFs", desc: "Cloudinary · capas, avatares e materiais", category: "video", icon: <ImageIcon className="h-4 w-4" />, status: "ok", detail: "Uploads ativos" },
    { id: "email", name: "E-mail transacional", desc: "Resend · redefinição de senha", category: "email", icon: <Mail className="h-4 w-4" />, status: "ok", detail: "Envio ativo" },
    { id: "db", name: "Banco de dados", desc: "Neon Postgres", category: "infra", icon: <Database className="h-4 w-4" />, status: "ok", detail: "Conectado (esta página carregou do banco)" },
    { id: "ga", name: "Google Analytics", desc: "Visitas e conversões", category: "marketing", icon: <BarChart3 className="h-4 w-4" />, status: s.settings.integrations.googleAnalyticsId ? "ok" : "off", detail: s.settings.integrations.googleAnalyticsId || "Sem ID configurado", href: to("/admin/settings?secao=integracoes") },
    { id: "wa", name: "WhatsApp", desc: "Botão de suporte", category: "marketing", icon: <MessageCircle className="h-4 w-4" />, status: s.settings.integrations.whatsappNumber ? "ok" : "off", detail: s.settings.integrations.whatsappNumber || "Sem número configurado", href: to("/admin/settings?secao=integracoes") },
  ];

  const visible = services.filter((x) =>
    (!status || (status === "conectadas" && x.status === "ok") || (status === "erro" && x.status === "error") || (status === "pendentes" && x.status === "off"))
    && (!categoria || x.category === categoria),
  );
  const connected = services.filter((x) => x.status === "ok").length;
  const errors = services.filter((x) => x.status === "error").length;
  const test = async () => { await delay(700); return { success: true, message: "Conexão OK." }; };

  return (
    <div>
      <PageHeader title="Integrações" subtitle={`${connected} conectada${connected !== 1 ? "s" : ""}${errors ? ` · ${errors} com erro` : ""}`}
        actions={<ButtonLink href={to("/admin/settings?secao=integracoes")} variant="primary">+ Conectar serviço</ButtonLink>} />

      {recentFailure && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[14px] border border-danger/30 bg-danger-soft p-4 dark:bg-danger/10">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-danger text-white"><AlertCircle className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-foreground">Webhook de pagamento falhou {formatAgo(lastFailure!.agoMin)}</p>
            <p className="text-xs text-foreground-muted">O Mercado Pago reenvia sozinho; se um aluno pagou e não recebeu acesso, confira em Pedidos.</p>
          </div>
          <ButtonLink href={to("/admin/logs?nivel=erro&origem=pagamentos")}>Ver log</ButtonLink>
          <ActionButton action={async () => { await delay(900); return { success: true, message: "Nenhum pagamento pendente para reprocessar." }; }}>Reprocessar</ActionButton>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
        {visible.map((x) => (
          <div key={x.id} className={cn("flex flex-col rounded-[14px] border bg-card p-4", x.status === "error" ? "border-danger/40" : "border-border")}>
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-white">{x.icon}</span>
              <Pill tone={x.status === "ok" ? "ok" : x.status === "error" ? "danger" : "gray"}>{STATUS_LABEL[x.status]}</Pill>
            </div>
            <p className="mt-3 text-[15px] font-bold text-foreground">{x.name}</p>
            <p className="text-xs text-foreground-muted">{x.desc}</p>
            <p className="mt-3 flex-1 text-[11.5px] text-foreground-muted">{x.detail}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {x.href ? (
                <Link href={x.href} className="inline-flex h-9 items-center justify-center rounded-lg border border-line-strong text-[13px] font-semibold text-foreground hover:bg-background dark:border-white/10">
                  {x.status === "error" ? "Ver log" : "Configurar"}
                </Link>
              ) : <span />}
              {TESTABLE.has(x.id) && <ActionButton action={test} variant="ghost">Testar</ActionButton>}
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="col-span-full py-12 text-center text-sm text-foreground-muted">Nenhuma integração neste filtro.</p>}
      </div>
    </div>
  );
}

// ── Logs ──────────────────────────────────────────────────────────────────
type LogLevel = "erro" | "aviso" | "info";
type LogOrigin = "pagamentos" | "conteudo" | "usuarios" | "sistema";
function logLevel(action: string): LogLevel {
  if (action.includes("failed") || action.includes("error")) return "erro";
  if (action.includes("deleted") || action.includes("banned") || action.includes("refunded") || action.includes("reset")) return "aviso";
  return "info";
}
function logOrigin(action: string, resourceType: string): LogOrigin {
  const a = `${action} ${resourceType}`;
  if (/payment|order|refund|coupon/.test(a)) return "pagamentos";
  if (/product|course|module|lesson|material|quiz|achievement/.test(a)) return "conteudo";
  if (/user/.test(a)) return "usuarios";
  return "sistema";
}
const ORIGIN_LABEL: Record<LogOrigin, string> = { pagamentos: "pagamentos", conteudo: "conteúdo", usuarios: "usuários", sistema: "sistema" };
const LEVEL: Record<LogLevel, { label: string; tone: "danger" | "brand" | "gray" }> = {
  erro: { label: "ERRO", tone: "danger" }, aviso: { label: "AVISO", tone: "brand" }, info: { label: "INFO", tone: "gray" },
};

export function AdminLogsPage() {
  const s = useDemo();
  const params = useSearchParams();
  const { success } = useToast();
  const [open, setOpen] = useState<string | null>(null);
  const [live, setLive] = useState(true);
  const nivel = params.get("nivel"), origem = params.get("origem"), term = params.get("q")?.trim().toLowerCase();

  const logs = useMemo(() => s.logs.map((l) => {
    const actor = l.actorId ? s.users.find((u) => u.id === l.actorId) : null;
    return { ...l, actorName: actor?.name ?? "Sistema", actorEmail: actor?.email ?? null, metadataText: l.metadata ? JSON.stringify(l.metadata, null, 2) : null, level: logLevel(l.action), origin: logOrigin(l.action, l.resourceType) };
  })
    .filter((r) => (!nivel || r.level === nivel) && (!origem || r.origin === origem))
    .filter((r) => !term || [r.action, r.actorName, r.actorEmail ?? "", r.resourceId ?? "", r.metadataText ?? ""].some((v) => v.toLowerCase().includes(term))), [s, nivel, origem, term]);

  type Row = (typeof logs)[number];
  const message = (l: Row) => {
    const meta = l.metadata ?? {};
    const extra = ["title", "email", "role", "status", "error", "path"].map((k) => meta[k]).filter((v) => typeof v === "string" && v).slice(0, 2) as string[];
    return [l.action, l.actorName !== "Sistema" ? l.actorName : null, ...extra].filter(Boolean).join(" · ");
  };
  const when = (ago: number) => new Date(Date.now() - ago * 60000);
  const time = (ago: number) => when(ago).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Fortaleza" });
  const day = (ago: number) => when(ago).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Fortaleza" });

  return (
    <div>
      <PageHeader
        title="Logs"
        subtitle={`${logs.length} registro${logs.length !== 1 ? "s" : ""} · ${live ? "atualiza a cada 30 s" : "atualização pausada"}`}
        actions={<>
          <DemoExportButton filename="logs.csv" rows={() => [["Ação", "Origem", "Nível", "Por", "Recurso"], ...logs.map((l) => [l.action, l.origin, l.level, l.actorName, l.resourceId ?? ""])]}>Exportar</DemoExportButton>
          <button type="button" onClick={() => setLive((v) => !v)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong bg-card px-3 text-[13px] font-semibold text-foreground dark:border-white/10">
            <span className={cn("h-2 w-2 rounded-full", live ? "bg-ok" : "bg-line-strong")} /> {live ? "Ao vivo" : "Pausado"}
          </button>
        </>}
      />

      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        <div className={cn("hidden grid-cols-[90px_80px_110px_minmax(0,1fr)_24px] gap-3 border-b border-line-soft bg-[#faf8f5] px-[18px] py-2.5 md:grid dark:border-white/10 dark:bg-white/5", tableHeadClass)}>
          <span>Hora</span><span>Nível</span><span>Origem</span><span>Mensagem</span><span />
        </div>
        {logs.map((l) => {
          const expanded = open === l.id;
          return (
            <div key={l.id} className={cn("border-b border-line-soft last:border-0 dark:border-white/10", l.level === "erro" && "bg-danger-soft/50 dark:bg-danger/5")}>
              <button type="button" onClick={() => setOpen(expanded ? null : l.id)} aria-expanded={expanded}
                className="grid w-full grid-cols-[64px_minmax(0,1fr)_20px] items-center gap-3 px-[18px] py-2.5 text-left font-mono text-[12px] md:grid-cols-[90px_80px_110px_minmax(0,1fr)_24px]">
                <span className="text-foreground-muted" title={day(l.agoMin)} suppressHydrationWarning>{time(l.agoMin)}</span>
                <span className="hidden md:block"><Pill tone={LEVEL[l.level].tone} className="font-sans">{LEVEL[l.level].label}</Pill></span>
                <span className="hidden text-foreground md:block">{ORIGIN_LABEL[l.origin]}</span>
                <span className="min-w-0 truncate text-foreground">
                  <span className={cn("mr-1.5 md:hidden", l.level === "erro" ? "text-danger" : l.level === "aviso" ? "text-brand" : "text-foreground-muted")}>{LEVEL[l.level].label}</span>
                  {message(l)}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-foreground-muted transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="px-[18px] pb-3 md:pl-[300px]">
                  <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-[11.5px] leading-relaxed text-foreground">
{`${l.action}  ·  ${l.resourceType}${l.resourceId ? ` ${l.resourceId}` : ""}
por ${l.actorName}${l.actorEmail ? ` <${l.actorEmail}>` : ""}${l.ipAddress ? `  ·  IP ${l.ipAddress}` : ""}
${day(l.agoMin)} ${time(l.agoMin)}${l.metadataText && l.metadataText !== "{}" ? `\n${l.metadataText}` : ""}`}
                  </pre>
                  <button type="button" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(l, null, 2)).catch(() => {}); success("Registro copiado."); }} className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong bg-card px-3 text-xs font-semibold text-foreground dark:border-white/10">
                    <Copy className="h-3.5 w-3.5" /> Copiar JSON
                  </button>
                  {l.resourceType === "order" && l.resourceId && (
                    <Link href={to(`/admin/orders?q=${encodeURIComponent(l.resourceId)}`)} className="ml-2 mt-2 inline-flex h-8 items-center rounded-lg border border-line-strong bg-card px-3 text-xs font-semibold text-foreground dark:border-white/10">Ver pedido</Link>
                  )}
                  {l.action === "payment.webhook_failed" && (
                    <span className="ml-2 inline-block"><ActionButton action={async () => { await delay(900); return { success: true, message: "Evento reprocessado." }; }}>Reprocessar evento</ActionButton></span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {logs.length === 0 && <p className="py-12 text-center text-sm text-foreground-muted">Nenhum registro neste filtro.</p>}
      </div>
    </div>
  );
}

// ── Produtos ──────────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = { course: "Curso completo", bundle: "Pacote", subscription: "Assinatura", free: "Gratuito", hidden: "Oculto", presale: "Pré-venda" };
const productInitials = (title: string) => title.split(/\s+/).filter((w) => w.length > 2).map((w) => w[0]).slice(0, 3).join("").toUpperCase() || "LEX";

export function AdminProductsPage() {
  const s = useDemo();
  const params = useSearchParams();
  const status = params.get("status"), tipo = params.get("tipo"), q = params.get("q");
  const products = s.products
    .filter((p) => (status === "ativo" ? p.status === "published" : status === "inativo" ? p.status !== "published" : true))
    .filter((p) => (tipo ? p.type === tipo : true))
    .filter((p) => (q?.trim() ? p.title.toLowerCase().includes(q.trim().toLowerCase()) : true))
    .sort((a, b) => (a.status === b.status ? a.createdAgoMin - b.createdAgoMin : a.status === "draft" ? -1 : 1));
  const weekSales = s.orders.filter((o) => o.status === "paid" && o.paidAgoMin !== null && o.paidAgoMin <= 7 * 24 * 60).reduce((t, o) => t + o.total, 0);

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle={`${products.length} produto${products.length !== 1 ? "s" : ""}${status || tipo || q ? " com este filtro" : ""} · ${formatCurrency(weekSales)} vendidos nos últimos 7 dias`}
        actions={<CreateCourseDialog openAfter="admin" />}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
        {products.map((p) => {
          const active = p.status === "published";
          const href = p.courseId ? to(`/admin/courses/${p.courseId}`) : to("/admin/products");
          const sales = s.orders.filter((o) => o.status === "paid" && o.productId === p.id).length;
          const modules = p.courseId ? editorModules(s, p.courseId).length : 0;
          return (
            <Link key={p.id} href={href}
              className={cn("group overflow-hidden rounded-[14px] border border-border bg-card transition-shadow hover:shadow-[0_6px_20px_rgba(31,43,58,.10)] sm:block", "flex sm:flex-col")}>
              <div className={cn("relative aspect-[16/10] w-[40%] shrink-0 overflow-hidden sm:w-full", active ? "bg-navy" : "bg-[#8a8f98]")}>
                {p.thumbnail ? (
                  <CdnImg src={p.thumbnail} width={360} aspect="16:10" alt="" className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]", !active && "grayscale")} />
                ) : (
                  <span className={cn("absolute bottom-3 left-4 text-[28px] font-extrabold leading-none sm:text-[34px]", active ? "text-brand" : "text-white/60")}>{productInitials(p.title)}</span>
                )}
                <Pill tone={active ? "ok" : "gray"} className="absolute right-2.5 top-2.5 hidden sm:inline-flex">{active ? "Ativo" : "Inativo"}</Pill>
              </div>
              <div className="min-w-0 flex-1 p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("line-clamp-2 text-[14px] font-bold leading-snug", active ? "text-foreground" : "text-foreground-muted")}>{p.title}</p>
                  <Pill tone={active ? "ok" : "gray"} className="shrink-0 sm:hidden">{active ? "Ativo" : "Inativo"}</Pill>
                </div>
                <p className="mt-0.5 truncate text-xs text-foreground-muted">
                  {TYPE_LABEL[p.type] ?? p.type}{p.courseId ? ` · ${modules} módulo${modules !== 1 ? "s" : ""}` : ""}
                </p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className={cn("text-lg font-extrabold", active ? "text-foreground" : "text-foreground-muted")}>{p.price === 0 ? "Grátis" : formatCurrency(p.price)}</span>
                  <span className="text-[11px] text-foreground-muted">{sales} venda{sales !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </Link>
          );
        })}
        <Link href={to("/admin/products?novo=1")}
          className="hidden min-h-[240px] flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-line-strong text-sm font-medium text-foreground-muted transition-colors hover:border-brand hover:text-brand sm:flex dark:border-white/15">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-card dark:border-white/15"><Plus className="h-4 w-4 text-brand" /></span>
          Novo curso
        </Link>
        {products.length === 0 && (
          <div className="col-span-full rounded-[14px] border border-dashed border-border py-14 text-center text-sm text-foreground-muted">
            {status || tipo || q ? "Nenhum produto com este filtro." : "Nenhum produto ainda."}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Meu perfil ────────────────────────────────────────────────────────────
export function AdminProfilePage() {
  const s = useDemo();
  const u = s.users.find((x) => x.id === ADMIN_ID)!;
  return (
    <AccountProfileForm
      user={{ name: u.name, email: u.email, avatar: u.avatar, bio: u.bio ?? "", phone: u.phone ?? "", location: u.location ?? "", roleLabel: u.role === "admin" ? "Administrador" : "Moderador" }}
    />
  );
}
