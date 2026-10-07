import type { Metadata } from "next";
import { AdminCoursesPage } from "@/demos/lexcursos/pages/admin/courses";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cursos" };

export default function Page() {
  return <AdminCoursesPage />;
}
