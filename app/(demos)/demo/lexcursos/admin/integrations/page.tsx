import type { Metadata } from "next";
import { AdminIntegrationsPage } from "@/demos/lexcursos/pages/admin/misc";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Integrações" };

export default function Page() {
  return <AdminIntegrationsPage />;
}
