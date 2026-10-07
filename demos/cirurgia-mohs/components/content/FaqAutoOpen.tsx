"use client";

import { useEffect } from "react";

/**
 * Abre a pergunta apontada pela âncora da URL (#id-da-pergunta) e rola até
 * ela. Sem isso, quem chega por um link direto encontra o acordeão fechado.
 *
 * A rolagem é instantânea (não disputa com a rolagem nativa da âncora) e
 * acontece duas vezes: depois da animação de abertura (.disclosure, 300 ms)
 * e de novo depois que o cabeçalho fixo compacta ao rolar (Masthead, 300 ms),
 * porque essa compactação encolhe a página e deslocaria a pergunta para
 * baixo do cabeçalho.
 */
export default function FaqAutoOpen() {
  useEffect(() => {
    const timers: number[] = [];
    const abrir = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!(el instanceof HTMLDetailsElement)) return;
      el.open = true;
      timers.forEach((t) => window.clearTimeout(t));
      timers.length = 0;
      for (const ms of [350, 900]) {
        timers.push(window.setTimeout(() => el.scrollIntoView({ block: "start", behavior: "auto" }), ms));
      }
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("hashchange", abrir);
    };
  }, []);
  return null;
}
