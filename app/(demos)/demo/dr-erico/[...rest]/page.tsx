import { notFound } from "next/navigation";

/* Endereço que não existe na réplica: mostra o 404 do próprio site
   (not-found.tsx deste segmento), dentro do cabeçalho e rodapé dele. */
export default function DrEricoNaoEncontrado() {
  notFound();
}
