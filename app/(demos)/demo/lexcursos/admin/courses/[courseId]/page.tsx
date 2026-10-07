import type { Metadata } from "next";
import { AdminCourseBoardPage } from "@/demos/lexcursos/pages/admin/course-board";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Módulos do curso" };

export default function Page({ params }: { params: { courseId: string } }) {
  return <AdminCourseBoardPage courseId={params.courseId} />;
}
