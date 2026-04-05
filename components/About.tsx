"use client";

const badges = [
  "Visão de Produto",
  "Full Stack",
  "CRM & Sistemas",
  "UX Minded",
  "Clean Code",
];

const differentials = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Solução completa",
    desc: "Do banco de dados à interface final, sem depender de outras pessoas para entregar.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: "Visão de produto",
    desc: "Entendo regras de negócio, fluxos e UX antes de escrever a primeira linha.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: "Código que escala",
    desc: "Arquitetura limpa, tipagem rigorosa e componentes reutilizáveis desde o início.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div data-aos="fade-right" data-aos-duration="700">
            <p className="text-xs font-semibold tracking-widest text-blue-primary uppercase mb-4">
              // sobre
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight tracking-tight mb-6">
              Não apenas código —{" "}
              <span className="text-gradient">soluções completas.</span>
            </h2>
            <div className="space-y-4 text-text-muted font-light leading-relaxed text-[15px]">
              <p>
                Sou desenvolvedor Full Stack com experiência na construção de
                sistemas completos: do banco de dados à interface do usuário. Já
                trabalhei com sistemas estruturados como CRMs, onde a lógica de
                negócio é tão importante quanto a linha de código.
              </p>
              <p>
                O que me diferencia é a visão de produto: entendo fluxos,
                processos e usabilidade antes de abrir o editor. Isso acelera
                decisões, reduz retrabalho e gera entregas que fazem sentido
                para quem usa.
              </p>
              <p>
                Não busco apenas escrever código que funciona — busco construir
                produtos que resolvem problemas reais.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-8">
              {badges.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1.5 rounded-lg bg-blue-primary/8 border border-blue-primary/15 text-blue-glow text-xs font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right — differentials */}
          <div
            className="flex flex-col gap-4"
            data-aos="fade-left"
            data-aos-duration="700"
            data-aos-delay="150"
          >
            {differentials.map((d) => (
              <div
                key={d.title}
                className="flex gap-4 p-5 rounded-2xl glass-card hover:border-blue-primary/25 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-primary/10 border border-blue-primary/15 flex items-center justify-center text-blue-glow group-hover:bg-blue-primary/15 transition-colors duration-200">
                  {d.icon}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-1">
                    {d.title}
                  </p>
                  <p className="text-text-muted text-sm font-light leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
