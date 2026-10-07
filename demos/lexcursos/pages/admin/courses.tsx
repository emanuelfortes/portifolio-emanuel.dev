"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Clock, BookOpen, Users, Trash2 } from "lucide-react";
import { Badge } from "@/demos/lexcursos/components/ui/badge";
import { Button } from "@/demos/lexcursos/components/ui/button";
import { Dialog, DialogFooter } from "@/demos/lexcursos/components/ui/dialog";
import { useToast } from "@/demos/lexcursos/components/ui/toast";
import { CreateCourseDialog } from "@/demos/lexcursos/components/course/create-course-dialog";
import { EditCourseDialog } from "@/demos/lexcursos/components/course/edit-course-dialog";
import { formatCurrency, formatDuration } from "@/demos/lexcursos/lib/cn";
import { courseTotals, deleteCourse, updateCourseStatus, useDemo } from "@/demos/lexcursos/lib/store";
import { to } from "@/demos/lexcursos/lib/paths";
import type { ProductLevel } from "@/demos/lexcursos/lib/types";

export interface CourseCardData {
  productId: string;
  courseId: string;
  title: string;
  thumbnail: string;
  status: string;
  price: number;
  comparePrice?: number;
  shortDescription: string;
  description: string;
  categoryName: string;
  level: ProductLevel;
  enrolledCount: number;
  totalLessons: number;
  totalDuration: number;
  heroColor?: string;
  moduleCount: number;
}

function CourseCard({ course }: { course: CourseCardData }) {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function togglePublish() {
    setLoading(true);
    const next = course.status === "published" ? "draft" : "published";
    updateCourseStatus(course.productId, next);
    success(next === "published" ? "Curso publicado." : "Curso voltou para rascunho.");
    setLoading(false);
  }

  function handleDelete() {
    const result = deleteCourse(course.productId);
    if (!result.success) { error(result.error); setConfirmOpen(false); return; }
    success("Curso excluído.");
    setConfirmOpen(false);
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <Link href={to(`/admin/courses/${course.courseId}`)} className="group flex min-w-0 flex-1 items-center gap-3 rounded-md text-left" title="Abrir módulos e aulas do curso">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <ChevronRight className="h-4 w-4" />
          </span>
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            {course.thumbnail && <Image src={course.thumbnail} alt={course.title} fill sizes="80px" className="object-cover" unoptimized={course.thumbnail.startsWith("blob:")} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{course.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.moduleCount} módulos · {course.totalLessons} aulas</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(course.totalDuration)}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.enrolledCount} alunos</span>
              <span>{formatCurrency(course.price)}</span>
            </div>
          </div>
        </Link>
        <div className="flex flex-wrap items-center gap-2 pl-9 sm:shrink-0 sm:pl-0">
          {course.price <= 0 && <Badge variant="destructive" className="shrink-0">Sem preço</Badge>}
          <Badge variant={course.status === "published" ? "success" : "secondary"} className="shrink-0">
            {course.status === "published" ? "Publicado" : "Rascunho"}
          </Badge>
          <EditCourseDialog
            initial={{
              productId: course.productId, title: course.title, shortDescription: course.shortDescription, description: course.description,
              price: course.price, comparePrice: course.comparePrice, categoryName: course.categoryName, level: course.level,
              thumbnail: course.thumbnail, heroColor: course.heroColor,
            }}
          />
          <Button size="sm" variant="outline" onClick={togglePublish} loading={loading} className="shrink-0">
            {course.status === "published" ? "Despublicar" : "Publicar"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} className="shrink-0" title="Excluir curso">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Excluir curso"
        description={`Tem certeza que deseja excluir "${course.title}"? Os módulos e aulas NÃO são apagados: ficam guardados para reaproveitar em outros cursos. A página de venda e o curso somem.`}
      >
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>Excluir definitivamente</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export function AdminCoursesPage() {
  const s = useDemo();
  const params = useSearchParams();
  const status = params.get("status");
  const q = params.get("q");

  const courses: CourseCardData[] = s.products
    .filter((p) => p.type === "course" && p.courseId)
    .filter((p) => (status === "published" || status === "draft" ? p.status === status : true))
    .filter((p) => (q?.trim() ? p.title.toLowerCase().includes(q.trim().toLowerCase()) : true))
    .sort((a, b) => a.createdAgoMin - b.createdAgoMin)
    .map((p) => {
      const t = courseTotals(s, p.courseId!);
      return {
        productId: p.id, courseId: p.courseId!, title: p.title, thumbnail: p.thumbnail, status: p.status, price: p.price, comparePrice: p.comparePrice,
        shortDescription: p.shortDescription, description: p.description, categoryName: p.categoryName, level: p.level, enrolledCount: p.enrolledCount,
        totalLessons: t.totalLessons, totalDuration: t.totalDuration, heroColor: p.heroColor, moduleCount: t.modules,
      };
    });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Cursos</h1>
          <p className="text-sm text-foreground-muted mt-0.5">{courses.length} curso{courses.length !== 1 ? "s" : ""}{q ? ` para "${q}"` : ""} · clique em um curso para organizar módulos e aulas</p>
        </div>
        <CreateCourseDialog openAfter="admin" />
      </div>

      <div className="space-y-3">
        {courses.map((course) => <CourseCard key={course.productId} course={course} />)}
        {courses.length === 0 && (
          <div className="py-16 text-center text-sm text-foreground-muted border border-dashed border-border rounded-lg">
            {status || q ? "Nenhum curso com esse filtro." : <>Nenhum curso ainda. Clique em &quot;Novo curso&quot; para criar o primeiro.</>}
          </div>
        )}
      </div>
    </div>
  );
}
