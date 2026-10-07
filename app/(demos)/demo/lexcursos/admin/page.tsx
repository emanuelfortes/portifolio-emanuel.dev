import { redirect } from "next/navigation";
import { to } from "@/demos/lexcursos/lib/paths";

export default function Page() {
  redirect(to("/admin/dashboard"));
}
