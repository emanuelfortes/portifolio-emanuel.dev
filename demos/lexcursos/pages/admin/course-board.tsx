"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, ExternalLink, MonitorPlay } from "lucide-react";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import type { DropdownItem } from "@/demos/lexcursos/components/ui/dropdown";
import { ModuleBoard } from "@/demos/lexcursos/components/course/module-board/module-board";
import { EditCourseDialog } from "@/demos/lexcursos/components/course/edit-course-dialog";
import { editorModules, productByCourse, updateCourseStatus, useDemo } from "@/demos/lexcursos/lib/store";
import { to } from "@/demos/lexcursos/lib/paths";

// Área de módulos do curso (admin) — page.tsx + course-board-client.tsx do original.
export function AdminCourseBoardPage({ courseId }: { courseId: string }) {
  const s = useDemo();
  const router = useRouter();
  const { success } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const p = productByCourse(s, courseId);
  const modules = useMemo(() => editorModules(s, courseId), [s, courseId]);
  const teachers = useMemo(
    () => s.users.filter((u) => ["teacher", "moderator", "admin"].includes(u.role) && u.status === "active").map((u) => ({ id: u.id, name: u.name })).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [s.users],
  );

  if (!p) {
    return (
      <div className="rounded-[14px] border border-dashed border-border py-16 text-center text-sm text-foreground-muted">
        Curso não encontrado. <button type="button" className="font-semibold text-brand" onClick={() => router.push(to("/admin/courses"))}>Voltar para Cursos</button>
      </div>
    );
  }

  const published = p.status === "published";
  const courseMenu: DropdownItem[] = [
    { label: "Editar dados do curso", icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => setEditOpen(true) },
    {
      label: published ? "Despublicar curso" : "Publicar curso",
      icon: published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />,
      onClick: () => {
        updateCourseStatus(p.id, published ? "draft" : "published");
        success(published ? "Curso voltou para rascunho." : "Curso publicado.");
      },
    },
    // Réplica: a área do aluno (/preview) e a página de venda não foram portadas.
    { label: "Assistir como aluno", icon: <MonitorPlay className="h-3.5 w-3.5" />, href: to(`/admin/courses/${courseId}?modulo=${modules[0]?.id ?? ""}`) },
    ...(published ? [{ label: "Ver página de venda", icon: <ExternalLink className="h-3.5 w-3.5" />, href: to("/#preparacoes") }] : []),
  ];

  return (
    <>
      <ModuleBoard
        header={{ courseId, productId: p.id, title: p.title, thumbnail: p.thumbnail, status: p.status, price: p.price, enrolledCount: p.enrolledCount }}
        modules={modules}
        teachers={teachers}
        backHref={to("/admin/courses")}
        courseMenu={courseMenu}
      />
      <EditCourseDialog
        key={editOpen ? "open" : "closed"}
        initial={{ productId: p.id, title: p.title, shortDescription: p.shortDescription, description: p.description, price: p.price, comparePrice: p.comparePrice, categoryName: p.categoryName, level: p.level, thumbnail: p.thumbnail, heroColor: p.heroColor }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
