import type { Metadata } from "next";
import { AdminDashboardPage } from "@/demos/lexcursos/pages/admin/dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <AdminDashboardPage />;
}
