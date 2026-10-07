import { redirect } from "next/navigation";
import { BASE } from "@/demos/lexcursos/lib/paths";

// Páginas do site original que não foram portadas voltam para a vitrine (nunca 404).
export default function Page() {
  redirect(BASE);
}
