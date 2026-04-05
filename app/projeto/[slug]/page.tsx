import { notFound } from "next/navigation";
import Link from "next/link";
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
    title: `${project.title} | Portfolio`,
    description: project.shortDescription,
  };
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
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
          <span className="text-xs text-text-dim font-medium">{project.year}</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block text-xs font-semibold text-blue-primary uppercase tracking-widest mb-3">
            {project.tag}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-text-muted font-light leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-white/5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-blue-primary/8 border border-blue-primary/15 text-blue-glow text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Problem */}
          <div className="p-5 rounded-2xl bg-surface border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider">Problema</span>
            </div>
            <p className="text-text-muted text-sm font-light leading-relaxed">{project.problem}</p>
          </div>

          {/* Solution */}
          <div className="p-5 rounded-2xl bg-surface border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-blue-primary/10 border border-blue-primary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider">Solução</span>
            </div>
            <p className="text-text-muted text-sm font-light leading-relaxed">{project.solution}</p>
          </div>

          {/* Result */}
          <div className="p-5 rounded-2xl bg-surface border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider">Resultado</span>
            </div>
            <p className="text-text-muted text-sm font-light leading-relaxed">{project.result}</p>
          </div>
        </div>

        {/* Full description */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4 tracking-tight">Sobre o projeto</h2>
          <p className="text-text-muted font-light leading-relaxed text-[15px]">
            {project.fullDescription}
          </p>
        </div>

        {/* Highlights */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-5 tracking-tight">Funcionalidades</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-white/5"
              >
                <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-blue-primary/15 border border-blue-primary/25 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
                </span>
                <span className="text-sm text-text-muted font-light">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-16 pb-16 border-b border-white/5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-primary text-white text-sm font-semibold hover:bg-blue-glow transition-all duration-200 shadow-blue-sm"
            >
              Ver projeto ao vivo
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-white/10 text-text-muted text-sm font-medium hover:border-blue-primary/30 hover:text-text-primary transition-all duration-200"
            >
              Ver no GitHub
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          )}
        </div>

        {/* Next project */}
        <div>
          <p className="text-xs text-text-dim uppercase tracking-widest mb-4">Próximo projeto</p>
          <Link
            href={`/projeto/${nextProject.slug}`}
            className="group flex items-center justify-between p-5 rounded-2xl bg-surface border border-white/5 hover:border-blue-primary/25 transition-all duration-300"
          >
            <div>
              <span className="text-xs text-blue-primary font-semibold uppercase tracking-widest">
                {nextProject.tag}
              </span>
              <p className="font-bold text-text-primary text-lg mt-1 group-hover:text-blue-glow transition-colors duration-200">
                {nextProject.title}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-text-dim group-hover:text-blue-glow group-hover:translate-x-1 transition-all duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
