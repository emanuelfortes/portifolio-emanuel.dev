import Link from "next/link";
import type { Project } from "@/data/projects";
import DemoMonitor from "./DemoMonitor";

/**
 * Card de projeto: o sistema rodando num monitor, e o resumo logo abaixo.
 *
 * Sem `transform` nem `backdrop-filter` no card de propósito. Os dois criam um
 * novo bloco de contenção para elementos `fixed`, e a tela do monitor vira
 * `fixed` ao ampliar: com qualquer um deles aqui, ela ficaria presa ao card.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const extra = project.stack.length - 4;

  return (
    <article className="flex flex-col rounded-card-lg border border-lilac/[0.14] bg-surface p-4 transition-colors duration-300 hover:border-lilac/35 sm:p-5">
      <DemoMonitor project={project} />

      <div className="mt-6 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-lilac">
          {project.tag}
        </span>
        <span className="font-mono text-[10px] text-txt-label">{project.year}</span>
      </div>

      <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.03em] text-txt">
        {project.title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.7] text-txt-muted">
        {project.shortDescription}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <li
            key={tech}
            className="rounded-md border border-lilac/[0.16] bg-[rgba(124,92,255,0.1)] px-2 py-1 font-mono text-[10px] text-lilac-light"
          >
            {tech}
          </li>
        ))}
        {extra > 0 && (
          <li className="rounded-md border border-lilac/[0.1] px-2 py-1 font-mono text-[10px] text-txt-label">
            +{extra}
          </li>
        )}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link
          href={`/projeto/${project.slug}`}
          className="rounded-btn bg-violet px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-violet-btn transition-colors hover:bg-violet-hover"
        >
          Ver o caso →
        </Link>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-btn border border-lilac/25 bg-surface-ghost px-4 py-2.5 text-[12.5px] font-medium text-txt transition-colors hover:border-lilac hover:text-white"
          >
            Site real ↗
          </a>
        )}
      </div>
    </article>
  );
}
