import type { Metadata } from "next";
import { AdminSettingsPage } from "@/demos/lexcursos/pages/admin/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Configurações" };

export default function Page() {
  return <AdminSettingsPage />;
}
