"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { asset, to } from "@/demos/lexcursos/lib/paths";

// Layout (auth) + página Entrar do original, numa tela só.
// Réplica: qualquer e-mail e senha entram, sempre no painel do admin.

const FEATURES = [
  "Videoaulas com professores especialistas em concursos",
  "Suporte e comunidade de estudos ativa",
  "Acesso por 1 ano ao conteúdo que você comprar",
  "Estude no seu ritmo, de onde e quando quiser",
];
const inputCls = "h-12 w-full rounded-xl border border-border bg-card px-4 text-[15px] text-foreground outline-none placeholder:text-foreground-muted focus:border-brand focus:ring-2 focus:ring-brand/20";

function LoginForm() {
  const { success } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [callback, setCallback] = useState<string | null>(null);

  useEffect(() => {
    setCallback(new URLSearchParams(window.location.search).get("callbackUrl"));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      success("Bem-vindo de volta, Lucas!");
      router.push(to("/admin/dashboard"));
    }, 600);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center lg:hidden">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-navy"><Image src={asset("logo.png")} alt="LEX Concursos" width={48} height={41} className="object-contain" priority /></span>
      </div>

      <div>
        <h1 className="text-[28px] font-extrabold tracking-tight text-foreground">Entrar</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {callback?.startsWith("/checkout") ? "Entre para finalizar sua compra." : <>Ainda não tem conta? <Link href={to("/#preparacoes")} className="font-semibold text-brand">Veja os cursos</Link></>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-foreground">E-mail</span>
          <input className={inputCls} type="email" placeholder="voce@email.com" autoComplete="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-foreground">
            Senha
            <Link href={to("/login")} className="text-[13px] font-semibold text-brand">Esqueci a senha</Link>
          </span>
          <span className="relative block">
            <input className={`${inputCls} pr-20`} type={showPwd ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground-muted hover:text-foreground">
              {showPwd ? "ocultar" : "mostrar"}
            </button>
          </span>
        </label>
        <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-bold text-white shadow-[0_6px_16px_rgba(242,106,27,.3)] hover:bg-brand-dark disabled:opacity-70">
          {loading && <Loader2 className="h-5 w-5 animate-spin" />} Entrar
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-foreground-muted"><span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" /></div>

      <Link href={to("/#preparacoes")} className="flex h-12 w-full items-center justify-center rounded-xl border border-line-strong bg-card text-[15px] font-bold text-foreground hover:bg-background dark:border-white/10">
        Criar conta grátis
      </Link>
      <p className="text-center text-xs text-foreground-muted">Demonstração: use qualquer e-mail e senha.</p>
    </div>
  );
}

export function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — branding (painel escuro, gradiente animado da marca) */}
      <div className="brand-gradient relative hidden lg:flex lg:w-1/2 xl:w-[45%] flex-col justify-between overflow-hidden p-10 xl:p-12 text-white">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent,rgba(0,0,0,0.35))]" />

        <div className="relative z-10">
          <Link href={to("/")} className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg">
            <Image src={asset("logo.png")} alt="LEX Concursos" width={80} height={68} className="object-contain" priority />
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h2 className="font-sans text-4xl xl:text-5xl font-extrabold leading-[1.05] tracking-tight">
              Sua aprovação<br /><span className="text-primary">começa aqui.</span>
            </h2>
            <p className="max-w-md text-base leading-relaxed text-white/70">
              Preparação completa para concursos públicos, com aulas objetivas e material atualizado.
            </p>
          </div>

          <ul className="space-y-3.5">
            {FEATURES.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Check className="h-4 w-4 text-primary" />
                </span>
                <span className="text-sm leading-snug text-white/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} LEX Concursos. Todos os direitos reservados.</p>
        </div>
      </div>

      <main className="flex flex-1 items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-[420px]"><LoginForm /></div>
      </main>
    </div>
  );
}
