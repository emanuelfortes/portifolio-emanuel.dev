import { redirect } from "next/navigation";
import { demoHref } from "@/demos/siga-fibra-site/lib/routes";

/* Endereço do site original que não foi portado (ou que lá só redireciona):
   leva para a página portada mais próxima, como os links internos fazem. */
export default function SigaFibraSiteRest({
  params,
}: {
  params: { rest: string[] };
}) {
  redirect(demoHref("/" + params.rest.map(decodeURIComponent).join("/")));
}
