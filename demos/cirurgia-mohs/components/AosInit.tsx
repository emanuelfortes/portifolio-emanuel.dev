"use client";

import { useEffect } from "react";
import { usePathname } from "@/demos/cirurgia-mohs/lib/pathname";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Inicializa o AOS uma única vez e atualiza ao trocar de rota.
 *
 * O portal usa apenas TRÊS animações, cada uma com um papel fixo:
 *  - data-aos="fade-up"  → blocos de texto e seções entrando na tela
 *  - data-aos="fade-in"  → imagens ilustrativas e elementos de fundo
 *  - data-aos="zoom-in"  → cards clicáveis (artigos, estados, tipos de câncer)
 */
export default function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: () =>
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
