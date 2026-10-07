import type { Metadata } from "next";
import { LoginPage } from "@/demos/lexcursos/pages/login";

export const metadata: Metadata = { title: "Entrar" };

export default function Page() {
  return <LoginPage />;
}
