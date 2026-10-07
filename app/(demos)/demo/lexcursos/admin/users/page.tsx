import type { Metadata } from "next";
import { AdminUsersPage } from "@/demos/lexcursos/pages/admin/users";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Usuários" };

export default function Page() {
  return <AdminUsersPage />;
}
