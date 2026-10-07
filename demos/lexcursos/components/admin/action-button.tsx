"use client";
import { useState } from "react";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { cn } from "@/demos/lexcursos/lib/cn";

// Botão que chama uma ação (na réplica, do banco em memória) e mostra o resultado.
export function ActionButton({ action, confirmText, okText, children, variant = "dark", className }: {
  action: () => Promise<{ success: boolean; error?: string; message?: string }> | { success: boolean; error?: string; message?: string };
  confirmText?: string;
  okText?: string; // padrão: a mensagem que a action devolver
  children: React.ReactNode;
  variant?: "dark" | "primary" | "ghost";
  className?: string;
}) {
  const { success, error } = useToast();
  const [busy, setBusy] = useState(false);
  const styles = { dark: "bg-navy text-white hover:bg-navy-deep", primary: "bg-brand text-white hover:bg-brand-dark", ghost: "border border-line-strong bg-card text-foreground hover:bg-background dark:border-white/10" }[variant];
  return (
    <button type="button" disabled={busy}
      onClick={async () => {
        if (confirmText && !confirm(confirmText)) return;
        setBusy(true);
        const result = await action();
        setBusy(false);
        if (!result.success) { error(result.error ?? "Não foi possível concluir."); return; }
        success(result.message ?? okText ?? "Feito.");
      }}
      className={cn("inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-colors disabled:opacity-60", styles, className)}>
      {busy ? "Processando…" : children}
    </button>
  );
}
