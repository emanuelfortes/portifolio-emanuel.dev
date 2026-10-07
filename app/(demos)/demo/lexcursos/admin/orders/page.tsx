import type { Metadata } from "next";
import { AdminOrdersPage } from "@/demos/lexcursos/pages/admin/orders";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pedidos" };

export default function Page() {
  return <AdminOrdersPage />;
}
