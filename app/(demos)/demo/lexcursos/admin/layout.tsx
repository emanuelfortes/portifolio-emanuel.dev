import { Suspense } from "react";
import { AdminShell } from "@/demos/lexcursos/components/admin/admin-shell";

// Renderizado a cada pedido: as telas leem filtros da URL (?status=, ?periodo=...).
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
