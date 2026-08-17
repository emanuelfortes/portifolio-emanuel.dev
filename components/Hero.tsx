import CodeWindow from "./CodeWindow";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-[110px] pt-[150px]">
      {/* Aurora de fundo: três elipses borradas em movimento lento */}
      <div className="pointer-events-none absolute inset-y-[-20%] inset-x-[-10%]">
        <div
          className="absolute left-[-10%] top-0 h-[70%] w-[120%] animate-aurora-slow blur-[60px]"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 40% 35%, rgba(139,92,246,0.55), transparent 70%)",
          }}
        />
        <div
          className="absolute left-0 top-[8%] h-[50%] w-full animate-aurora-slower blur-[50px]"
          style={{
            background:
              "radial-gradient(ellipse 40% 30% at 65% 40%, rgba(196,181,253,0.35), transparent 70%)",
          }}
        />
        <div
          className="absolute left-0 top-[30%] h-[60%] w-full blur-[70px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(59,20,110,0.6), transparent 75%)",
          }}
        />
      </div>

      <div className="container-page relative grid grid-cols-[minmax(300px,1.15fr)_minmax(280px,1fr)] items-center gap-14 max-[900px]:grid-cols-1">
        <div>
          {/* Badges */}
          <div className="flex animate-rise-in gap-2">
            <span className="rounded-full bg-grad-pill px-3.5 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink-deep">
              Disponível
            </span>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-lilac/30 bg-surface-ghost px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-lilac-light">
              <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-lilac" />
              Novos projetos
            </span>
          </div>

          <h1 className="mt-7 animate-rise-in rise-delay-1 text-[clamp(38px,4.6vw,64px)] font-semibold leading-[1.06] tracking-[-0.035em]">
            Desenvolvo sistemas para{" "}
            <span className="text-lilac-light">quem precisa de resultado</span>
          </h1>

          <p className="mt-[22px] max-w-[440px] animate-rise-in rise-delay-2 text-[15.5px] leading-[1.75] text-txt-secondary">
            Emanuel Fortes — Full Stack Developer com visão de produto. Da
            interface ao backend, soluções que funcionam de ponta a ponta.
          </p>

          <div className="mt-[34px] flex animate-rise-in rise-delay-3 gap-3">
            <a
              href="#projetos"
              className="inline-flex items-center gap-2 rounded-btn bg-violet px-[26px] py-[13px] text-sm font-semibold text-white shadow-violet-btn transition-colors hover:bg-violet-hover"
            >
              Ver projetos →
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-btn border border-lilac/30 bg-surface-ghost px-[26px] py-[13px] text-sm font-medium text-txt transition-colors hover:border-lilac hover:text-white"
            >
              Entrar em contato
            </a>
          </div>

          <div className="mt-[30px] animate-rise-in rise-delay-4 font-mono text-[11px] uppercase tracking-[0.12em] text-txt-label">
            10+ projetos · 100% full stack · visão de produto
          </div>
        </div>

        <CodeWindow />
      </div>
    </section>
  );
}
