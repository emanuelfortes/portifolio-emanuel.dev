import type { Metadata } from "next";
import { AdminProductsPage } from "@/demos/lexcursos/pages/admin/misc";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Produtos" };

export default function Page() {
  return <AdminProductsPage />;
}
