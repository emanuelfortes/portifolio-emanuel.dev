import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projetos" className="py-24 relative bg-aurora-projects">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          className="mb-14"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          <p className="text-xs font-semibold tracking-widest text-blue-primary uppercase mb-4">
            // projetos
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
                Soluções que entregam valor
              </h2>
              <p className="text-text-muted font-light text-[15px] max-w-xl leading-relaxed">
                Cada projeto aqui foi construído com um problema real em mente.
                Não apenas demonstrações técnicas — sistemas pensados para
                funcionar, escalar e gerar resultado.
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
