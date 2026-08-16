import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: `${project.title} | Fortes Dev`,
    description: project.shortDescription,
  };
}

const infoCard =
  "rounded-card border border-lilac/[0.14] bg-surface p-6";

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="min-h-screen">
      {/* Barra superior */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-lilac/10 bg-[rgba(8,6,13,0.85)] backdrop-blur-[20px]">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-txt-muted transition-colors hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Voltar ao portfólio
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-txt-label">
              {project.year}
            </span>
            <Image
              src="/mark.png"
              alt="Fortes Dev"
              width={693}
              height={693}
              className="h-6 w-6 opacity-80"
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-28">
        {/* Cabeçalho */}
        <div className="mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-lilac">
            {project.tag}
          </span>
          <h1 className="mt-3 text-[clamp(30px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-[1.75] text-txt-secondary">
            {project.shortDescription}
          </p>
        </div>

        {/* Stack */}
        <div className="mb-12 flex flex-wrap gap-2 border-b border-lilac/10 pb-12">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-lilac/[0.18] bg-[rgba(124,92,255,0.12)] px-3 py-1.5 font-mono text-[10.5px] text-lilac-light"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Problema · Solução · Resultado */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {[
            { label: "Problema", text: project.problem },
            { label: "Solução", text: project.solution },
            { label: "Resultado", text: project.result },
          ].map((block) => (
            <div key={block.label} className={infoCard}>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-txt-label">
                {block.label}
              </span>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-txt-muted">
                {block.text}
              </p>
            </div>
          ))}
        </div>

        {/* Descrição completa */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">
            Sobre o projeto
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.8] text-txt-secondary">
            {project.fullDescription}
          </p>
        </div>

        {/* Funcionalidades */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">
            Funcionalidades
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 rounded-btn border border-lilac/[0.14] bg-surface p-4"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lilac" />
                <span className="text-[13.5px] leading-[1.7] text-txt-muted">
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ações */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="mb-16 flex flex-wrap gap-3 border-b border-lilac/10 pb-16">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn bg-violet px-6 py-3 text-sm font-semibold text-white shadow-violet-btn transition-colors hover:bg-violet-hover"
              >
                Ver projeto ao vivo →
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn border border-lilac/30 bg-surface-ghost px-6 py-3 text-sm font-medium text-txt transition-colors hover:border-lilac hover:text-white"
              >
                Ver no GitHub
              </a>
            )}
          </div>
        )}

        {/* Próximo projeto */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-txt-label">
            Próximo projeto
          </p>
          <Link
            href={`/projeto/${nextProject.slug}`}
            className="group mt-4 flex items-center justify-between rounded-card border border-lilac/[0.14] bg-surface p-6 transition-colors hover:border-lilac/50"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-lilac">
                {nextProject.tag}
              </span>
              <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em]">
                {nextProject.title}
              </p>
            </div>
            <span className="text-lilac-light transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
