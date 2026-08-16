import Link from "next/link";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section
      id="projetos"
      className="container-page relative pb-[90px] pt-[70px]"
    >
      {/* Glows suaves da seção */}
      <div
        className="pointer-events-none absolute bottom-[-15%] right-[-20%] h-[50vw] w-[50vw] rounded-full blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.1), transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-[10%] top-[-5%] h-[35vw] w-[35vw] rounded-full blur-[50px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.1), transparent 65%)",
        }}
      />

      <h2 className="relative text-[clamp(26px,3vw,38px)] font-semibold tracking-[-0.03em]">
        Veja em ação
      </h2>
      <p className="relative mt-3.5 max-w-[520px] text-[14.5px] leading-[1.75] text-txt-muted">
        Cada projeto foi construído com um problema real em mente — sistemas
        pensados para funcionar, escalar e gerar resultado.
      </p>

      <div className="relative mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projeto/${project.slug}`}
            className="group flex flex-col overflow-hidden rounded-card border border-lilac/[0.14] bg-surface text-inherit transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-lilac/50"
          >
            <div
              className="flex h-[150px] items-center justify-center border-b border-lilac/[0.12]"
              style={{ background: project.thumb }}
            >
              <span className="font-mono text-[26px] font-medium tracking-[-0.02em] text-lilac-lighter/85">
                {project.glyph}
              </span>
            </div>

            <div className="flex flex-1 flex-col px-6 pb-6 pt-[22px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-lilac">
                  {project.tag}
                </span>
                <span className="font-mono text-[10px] text-txt-label">
                  {project.year}
                </span>
              </div>
              <div className="mt-3 text-lg font-semibold tracking-[-0.02em] text-txt">
                {project.title}
              </div>
              <div className="mt-2 flex-1 text-[13.5px] leading-[1.7] text-txt-muted">
                {project.shortDescription}
              </div>
              <div className="mt-[18px] text-[13px] font-semibold text-lilac-light">
                Ver projeto →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
