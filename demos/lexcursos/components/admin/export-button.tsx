"use client";
import { cn } from "@/demos/lexcursos/lib/cn";

// Réplica: no original "Exportar" baixa um CSV de /api/admin/export. Aqui o CSV é
// montado no navegador com os dados da tela (mesmo visual do ButtonLink do page-kit).
export function DemoExportButton({ filename, rows, children, className }: { filename: string; rows: () => (string | number)[][]; children: React.ReactNode; className?: string }) {
  function download() {
    const csv = "﻿" + rows().map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button type="button" onClick={download}
      className={cn("inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line-strong bg-card px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-background dark:border-white/10", className)}>
      {children}
    </button>
  );
}
