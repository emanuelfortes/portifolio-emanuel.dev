import type { ComponentType } from "react";
import SigaFibra from "./SigaFibra";
import LexCursos from "./LexCursos";
import DrErico from "./DrErico";

/**
 * Réplicas das interfaces, por slug de projeto.
 *
 * Cada réplica é uma reconstrução em DOM real da tela do sistema, escrita aqui
 * do zero a partir do que a interface mostra. Não é o código do cliente: o
 * repositório é público e código de terceiros não entra nele. O que entra é
 * markup próprio com dados de exemplo.
 *
 * A regra de divisão entre DOM e imagem: texto, estrutura e interação viram
 * DOM, porque precisam continuar nítidos em qualquer escala. Fotografia segue
 * sendo imagem, porque foto é raster por natureza.
 *
 * Projeto sem réplica cai no caminho da captura, declarado em data/projects.ts.
 */
export const REPLICAS: Record<
  string,
  { Component: ComponentType; width: number; hint: string }
> = {
  "siga-fibra": {
    Component: SigaFibra,
    width: 1280,
    hint: "Reconstruída em HTML. Role dentro da janela e passe o mouse nas barras do gráfico.",
  },
  lexcursos: {
    Component: LexCursos,
    width: 1280,
    hint: "Reconstruída em HTML. Role dentro da janela e clique num módulo para abrir as aulas.",
  },
  "dr-erico-diogenes": {
    Component: DrErico,
    width: 1280,
    hint: "Reconstruída em HTML. Role dentro da janela e abra as perguntas do FAQ.",
  },
};
