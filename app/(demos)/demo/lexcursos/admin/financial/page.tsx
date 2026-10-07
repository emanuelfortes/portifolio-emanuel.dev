import type { Metadata } from "next";
import { AdminFinancialPage } from "@/demos/lexcursos/pages/admin/financial";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Financeiro" };

export default function Page() {
  return <AdminFinancialPage />;
}
