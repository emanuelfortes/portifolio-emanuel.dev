import { redirect } from "next/navigation";
import { to } from "@/demos/lexcursos/lib/paths";

// Telas do admin que não existem na réplica voltam para o Dashboard (nunca 404).
export default function Page() {
  redirect(to("/admin/dashboard"));
}
