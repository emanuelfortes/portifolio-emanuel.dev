"use client";
import { useMemo } from "react";
import { NavShell, type PanelData } from "@/demos/lexcursos/components/layout/nav-shell/nav-shell";
import { classifyUser, editorModules, useDemo, type DemoState } from "@/demos/lexcursos/lib/store";
import { ADMIN_ID } from "@/demos/lexcursos/mock/people";
import { to } from "@/demos/lexcursos/lib/paths";
import type { UserKind } from "@/demos/lexcursos/lib/types";

const ROLE_LABEL: Record<string, string> = { admin: "Administrador", moderator: "Moderador" };

// Equivale a loadPanelData() do layout do admin original: contadores dos filtros e cursos recentes.
function loadPanelData(s: DemoState): { panel: PanelData; pendingOrders: number } {
  const courses = s.products.filter((p) => p.type === "course");
  const count = <T,>(rows: T[], pick: (r: T) => boolean) => rows.filter(pick).length;
  const kinds: Record<UserKind, number> = { cadastrado: 0, aluno: 0, assinante: 0, encerrado: 0, professor: 0, equipe: 0 };
  for (const u of s.users.filter((x) => x.role === "student")) kinds[classifyUser(s, u).kind]++;
  const pendingOrders = count(s.orders, (o) => o.status === "pending" || o.status === "processing");
  const recents = [...courses].filter((p) => p.courseId).sort((a, b) => a.createdAgoMin - b.createdAgoMin).slice(0, 3);

  return {
    pendingOrders,
    panel: {
      dashboard: { footer: { label: "Armazenamento de vídeo", value: "184,6 GB usados no Bunny" } },
      courses: {
        counts: { all: courses.length, published: count(courses, (p) => p.status === "published"), draft: count(courses, (p) => p.status === "draft") },
        recents: recents.map((p) => ({
          href: to(`/admin/courses/${p.courseId}`),
          title: p.title,
          subtitle: `${editorModules(s, p.courseId!).length} módulos · ${p.status === "published" ? "Publicado" : "Rascunho"}`,
          mark: "LEX",
        })),
      },
      products: {
        counts: {
          all: s.products.length,
          active: count(s.products, (p) => p.status === "published"),
          inactive: count(s.products, (p) => p.status !== "published"),
          course: courses.length,
          bundle: count(s.products, (p) => p.type === "bundle"),
          subscription: count(s.products, (p) => p.type === "subscription"),
        },
      },
      users: {
        counts: {
          all: s.users.length,
          ...kinds,
          professor: count(s.users, (u) => u.role === "teacher"),
          equipe: count(s.users, (u) => u.role === "admin" || u.role === "moderator"),
          active: count(s.users, (u) => u.status === "active"),
          inactive: count(s.users, (u) => u.status === "inactive"),
          banned: count(s.users, (u) => u.status === "banned"),
        },
      },
      orders: {
        counts: {
          all: s.orders.length,
          pending: pendingOrders,
          paid: count(s.orders, (o) => o.status === "paid"),
          cancelled: count(s.orders, (o) => o.status === "cancelled" || o.status === "failed"),
          refunded: count(s.orders, (o) => o.status === "refunded" || o.status === "chargeback"),
        },
      },
    },
  };
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const s = useDemo();
  const { panel, pendingOrders } = useMemo(() => loadPanelData(s), [s]);
  const me = s.users.find((u) => u.id === ADMIN_ID)!;
  return (
    <NavShell area="admin" user={{ name: me.name, roleLabel: ROLE_LABEL[me.role] ?? "Equipe" }} pendingOrders={pendingOrders} panelData={panel}>
      {children}
    </NavShell>
  );
}
