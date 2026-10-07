"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";

/**
 * Grade de projetos: duas linhas de três e o resto atrás de "Ver mais".
 *
 * Os projetos escondidos não são só ocultos com CSS, eles não são montados.
 * Cada card carrega um app inteiro no monitor, então quem não pediu para ver
 * mais não paga o carregamento deles.
 */

/** Duas linhas completas na grade de três colunas. */
const VISIBLE = 6;

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = projects.length - VISIBLE;
  const shown = expanded ? projects : projects.slice(0, VISIBLE);

  return (
    <>
      <div className="relative mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {hidden > 0 && (
        <div className="relative mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="rounded-btn border border-lilac/30 bg-surface-ghost px-6 py-3 text-[13.5px] font-medium text-txt transition-colors hover:border-lilac hover:text-white"
          >
            {expanded ? "Mostrar menos" : `Ver mais projetos (${hidden})`}
          </button>
        </div>
      )}
    </>
  );
}
