import { projects } from "@/data/projects";
import ProjectGrid from "./ProjectGrid";

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
      <p className="relative mt-3.5 max-w-[560px] text-[14.5px] leading-[1.75] text-txt-muted">
        Cada tela é o sistema funcionando, não uma imagem. Toque na tela para
        ampliar e navegar como se estivesse no site.
      </p>

      <ProjectGrid projects={projects} />
    </section>
  );
}
