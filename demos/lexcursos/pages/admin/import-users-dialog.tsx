"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/demos/lexcursos/components/ui/button";
import { Dialog, DialogFooter } from "@/demos/lexcursos/components/ui/dialog";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { importUsersCsv } from "@/demos/lexcursos/lib/store";

type Result = ReturnType<typeof importUsersCsv>;

// "Importar CSV" de usuários: nome, email, papel. Mostra o resultado e oferece as senhas temporárias.
export function ImportUsersDialog() {
  const { error, success } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleFile(file: File) {
    if (file.size > 1024 * 1024) { error("Arquivo muito grande (máx. 1 MB)."); return; }
    setBusy(true);
    const res = importUsersCsv(await file.text());
    setBusy(false);
    setResult(res);
    success(`${res.created} usuário${res.created !== 1 ? "s" : ""} criado${res.created !== 1 ? "s" : ""}.`);
  }

  function downloadPasswords() {
    if (!result) return;
    const rows = [["nome", "email", "senha temporária"], ...result.results.filter((r) => r.password).map((r) => [r.name, r.email, r.password!])];
    const csv = "﻿" + rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "senhas-temporarias.csv" });
    a.click();
    URL.revokeObjectURL(url);
  }

  function close() {
    setOpen(false);
    setResult(null);
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} leftIcon={<Upload className="h-4 w-4" />}>Importar CSV</Button>
      <Dialog open={open} onClose={close} title="Importar usuários" description="Uma linha por usuário: nome, e-mail e papel (aluno, professor ou admin).">
        {!result ? (
          <div className="space-y-3">
            <pre className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground">{`nome;email;papel
Maria Silva;maria@email.com;aluno
Riccardo Nunes;riccardo@email.com;professor`}</pre>
            <p className="text-xs text-foreground-muted">Aceita vírgula ou ponto e vírgula. E-mails já cadastrados são ignorados. Cada usuário recebe uma senha temporária.</p>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
            <Button className="w-full" loading={busy} onClick={() => fileRef.current?.click()} leftIcon={<Upload className="h-4 w-4" />}>Escolher arquivo CSV</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-foreground"><strong>{result.created}</strong> criado{result.created !== 1 ? "s" : ""} · {result.results.length - result.created} com erro</p>
            <div className="max-h-64 divide-y divide-border overflow-y-auto rounded-lg border border-border text-xs">
              {result.results.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="min-w-0 truncate text-foreground">{r.name || "—"} <span className="text-foreground-muted">{r.email}</span></span>
                  <span className={r.status === "criado" ? "shrink-0 text-ok-text dark:text-ok" : "shrink-0 text-danger"}>{r.status === "criado" ? "criado" : r.error}</span>
                </div>
              ))}
            </div>
            {result.created > 0 && <p className="text-xs text-foreground-muted">As senhas temporárias só aparecem agora — baixe e repasse a cada usuário.</p>}
          </div>
        )}
        <DialogFooter>
          {result && result.created > 0 && <Button variant="outline" onClick={downloadPasswords} leftIcon={<Download className="h-4 w-4" />}>Baixar senhas</Button>}
          <Button onClick={close}>{result ? "Concluir" : "Cancelar"}</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
