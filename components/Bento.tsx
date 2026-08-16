const cardBase =
  "rounded-card border border-lilac/[0.14] bg-surface p-7 transition-colors hover:border-lilac/40";

export default function Bento() {
  return (
    <section id="sobre" className="container-page relative py-[90px]">
      {/* Glow difuso no canto direito */}
      <div
        className="pointer-events-none absolute right-[-25%] top-[-10%] h-[55vw] w-[55vw] rounded-full blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.14), transparent 65%)",
        }}
      />

      <h2 className="relative text-[clamp(26px,3vw,38px)] font-semibold tracking-[-0.03em]">
        O que eu entrego
      </h2>

      <div className="relative mt-9 grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
        {/* 10+ Projetos entregues */}
        <div className={cardBase}>
          <div className="text-[34px] font-bold tracking-[-0.03em] text-lilac-light">
            10+
          </div>
          <div className="mt-3.5 text-[15px] font-semibold">
            Projetos entregues
          </div>
          <div className="mt-1.5 text-[13.5px] leading-[1.7] text-txt-muted">
            Sistemas reais em produção: CRMs, dashboards e plataformas de
            agendamento.
          </div>
        </div>

        {/* Solução completa */}
        <div className={cardBase}>
          <div className="flex flex-wrap gap-1.5">
            {["DB", "API", "UI"].map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-lilac/[0.18] bg-[rgba(124,92,255,0.12)] px-[11px] py-[5px] font-mono text-[10.5px] text-lilac-light"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-4 text-[15px] font-semibold">Solução completa</div>
          <div className="mt-1.5 text-[13.5px] leading-[1.7] text-txt-muted">
            Do banco de dados à interface final, sem depender de outras pessoas
            para entregar.
          </div>
        </div>

        {/* PO Visão de produto */}
        <div className={cardBase}>
          <div className="text-[34px] font-bold tracking-[-0.03em] text-lilac-light">
            PO
          </div>
          <div className="mt-3.5 text-[15px] font-semibold">
            Visão de produto
          </div>
          <div className="mt-1.5 text-[13.5px] leading-[1.7] text-txt-muted">
            Entendo regras de negócio, fluxos e UX antes de escrever a primeira
            linha.
          </div>
        </div>

        {/* Card largo */}
        <div className="col-span-2 rounded-card border border-lilac/[0.18] bg-grad-bento p-8 transition-colors hover:border-lilac/45 max-[640px]:col-span-1">
          <div className="text-[17px] font-semibold">
            Não apenas código: soluções completas.
          </div>
          <div className="mt-2.5 max-w-[620px] text-sm leading-[1.8] text-txt-secondary">
            Já trabalhei com sistemas estruturados como CRMs, onde a lógica de
            negócio é tão importante quanto a linha de código. Entendo fluxos,
            processos e usabilidade antes de abrir o editor — isso acelera
            decisões, reduz retrabalho e gera entregas que fazem sentido para
            quem usa.
          </div>
        </div>

        {/* Código que escala */}
        <div className={`${cardBase} flex flex-col justify-center`}>
          <div className="font-mono text-xs leading-[2] text-txt-muted">
            <span className="text-violet">while</span> (problema) {"{"}
            <br />
            &nbsp;&nbsp;<span className="text-lilac-lighter">resolver</span>();
            <br />
            {"}"}
          </div>
          <div className="mt-3.5 text-[15px] font-semibold">
            Código que escala
          </div>
        </div>
      </div>
    </section>
  );
}
