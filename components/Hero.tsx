"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle animated grid/particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; r: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      dots.forEach((dot) => {
        dot.y -= dot.speed * 0.4;
        if (dot.y < -5) {
          dot.y = canvas.height + 5;
          dot.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${dot.alpha + Math.sin(t + dot.x) * 0.05})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleContact = () => {
    document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleProjects = () => {
    document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-aurora pointer-events-none" />

      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full bg-blue-primary/8 border border-blue-primary/20 text-sm text-blue-glow font-medium"
            data-aos="fade-down"
            data-aos-duration="600"
          >
            <span className="glow-dot" />
            Disponível para novos projetos
          </div>

          {/* Headline */}
          <h1
            className="text-gradient text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="100"
          >
            Emanuel Fortes
          </h1>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="100"
          >
            Desenvolvo sistemas.
            <br />
            <span className="text-gradient">Da interface ao backend.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl text-text-muted font-light max-w-xl leading-relaxed mb-3"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="200"
          >
            Full Stack Developer com visão de produto — construo soluções que
            funcionam de ponta a ponta, com foco em resultado.
          </p>

          {/* Support text */}
          <p
            className="text-sm text-text-dim max-w-md leading-relaxed mb-10"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="280"
          >
            Código limpo, arquitetura pensada e entrega que faz sentido para o
            negócio.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="360"
          >
            <button
              onClick={handleProjects}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-primary text-white font-semibold text-sm hover:bg-blue-glow transition-all duration-200 shadow-blue-sm hover:shadow-blue-md"
            >
              Ver projetos
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <button
              onClick={handleContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/10 text-text-muted font-medium text-sm hover:border-blue-primary/30 hover:text-text-primary transition-all duration-200"
            >
              Entrar em contato
            </button>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-8 mt-16 pt-10 border-t border-white/5"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="440"
          >
            {[
              { value: "10+", label: "Projetos entregues" },
              { value: "100%", label: "Full Stack" },
              { value: "PO", label: "Visão de produto" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-dim mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  );
}
