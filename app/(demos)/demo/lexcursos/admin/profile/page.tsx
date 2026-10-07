import type { Metadata } from "next";
import { AdminProfilePage } from "@/demos/lexcursos/pages/admin/misc";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meu perfil" };

export default function Page() {
  return <AdminProfilePage />;
}
