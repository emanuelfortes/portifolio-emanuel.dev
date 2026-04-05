"use client";

import { useEffect, useRef } from "react";

type SkillCategory = {
  label: string;
  tag: string;
  skills: { name: string; level: number }[];
};

const skillCategories: SkillCategory[] = [
  {
    label: "Frontend",
    tag: "01",
    skills: [
      { name: "HTML & CSS", level: 90 },
      { name: "JavaScript (ES6+)", level: 85 },
      { name: "React.js", level: 80 },
      { name: "Next.js", level: 75 },
      { name: "TypeScript", level: 72 },
      { name: "Tailwind CSS", level: 88 },
      { name: "UI / UX Principles", level: 78 },
    ],
  },
  {
    label: "Backend",
    tag: "02",
    skills: [
      { name: "Node.js", level: 80 },
      { name: "REST APIs", level: 85 },
      { name: "PostgreSQL", level: 75 },
      { name: "MySQL", level: 72 },
      { name: "Autenticação & JWT", level: 78 },
      { name: "Regras de Negócio", level: 82 },
      { name: "Prisma ORM", level: 70 },
    ],
  },
  {
    label: "Outros",
    tag: "03",
    skills: [
      { name: "Git & GitHub", level: 85 },
      { name: "Visão de Produto (PO)", level: 80 },
      { name: "Lógica de Programação", level: 90 },
      { name: "Metodologias Ágeis", level: 75 },
      { name: "Docker (básico)", level: 55 },
      { name: "Documentação técnica", level: 78 },
    ],
  },
];

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-text-muted font-light group-hover:text-text-primary transition-colors duration-200">
          {name}
        </span>
        <span className="text-xs text-text-dim font-medium">{level}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-dim to-blue-primary rounded-full transition-all duration-700"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

// Speed: very slow idle drift, faster on hover
const SPEED_IDLE = 0.0003;
const SPEED_HOVER = 0.004;

function GlassCard({
  cat,
  delay = 0,
  index,
}: {
  cat: SkillCategory;
  delay?: number;
  index: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const progressRef = useRef<number>(index * 0.33);
  const speedRef = useRef<number>(SPEED_IDLE);
  const hoveredRef = useRef<boolean>(false);
  const opacityRef = useRef<number>(0.18);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const PADDING = 8;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const w = rect.width + PADDING * 2;
      const h = rect.height + PADDING * 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const P = 8; // same as PADDING
      const radius = 16;
      const borderWidth = 1.8;
      const offset = borderWidth / 2;

      ctx.clearRect(0, 0, w, h);

      // Lerp speed and opacity
      const targetSpeed = hoveredRef.current ? SPEED_HOVER : SPEED_IDLE;
      speedRef.current += (targetSpeed - speedRef.current) * 0.06;

      const targetOpacity = hoveredRef.current ? 1 : 0.18;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.05;

      progressRef.current += speedRef.current;

      const progress = progressRef.current;
      const alpha = opacityRef.current;

      // Rounded-rect path offset by PADDING
      const x0 = P + offset;
      const y0 = P + offset;
      const x1 = w - P - offset;
      const y1 = h - P - offset;

      const path = new Path2D();
      path.moveTo(x0 + radius, y0);
      path.lineTo(x1 - radius, y0);
      path.arcTo(x1, y0, x1, y0 + radius, radius);
      path.lineTo(x1, y1 - radius);
      path.arcTo(x1, y1, x1 - radius, y1, radius);
      path.lineTo(x0 + radius, y1);
      path.arcTo(x0, y1, x0, y1 - radius, radius);
      path.lineTo(x0, y0 + radius);
      path.arcTo(x0, y0, x0 + radius, y0, radius);

      const cardW = w - P * 2;
      const cardH = h - P * 2;
      const perimeter = 2 * (cardW + cardH) - 8 * (4 - Math.PI) * radius;

      // Rainbow gradient travelling along the border
      const hueBase = (progress * 360) % 360;
      const grad = ctx.createLinearGradient(P, P, w - P, h - P);
      grad.addColorStop(0,    `hsla(${hueBase},       100%, 68%, 0)`);
      grad.addColorStop(0.08, `hsla(${hueBase},       100%, 68%, ${0.15 * alpha})`);
      grad.addColorStop(0.2,  `hsla(${hueBase + 40},  100%, 70%, ${alpha})`);
      grad.addColorStop(0.35, `hsla(${hueBase + 100}, 100%, 68%, ${alpha})`);
      grad.addColorStop(0.5,  `hsla(${hueBase + 160}, 100%, 72%, ${alpha})`);
      grad.addColorStop(0.65, `hsla(${hueBase + 220}, 100%, 68%, ${alpha})`);
      grad.addColorStop(0.8,  `hsla(${hueBase + 280}, 100%, 70%, ${alpha})`);
      grad.addColorStop(0.92, `hsla(${hueBase + 340}, 100%, 68%, ${0.15 * alpha})`);
      grad.addColorStop(1,    `hsla(${hueBase + 360}, 100%, 68%, 0)`);

      // Travelling arc segment
      const segmentLength = perimeter * 0.42;
      const dashStart = (progress % 1) * perimeter;

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = borderWidth;
      ctx.setLineDash([segmentLength, perimeter - segmentLength]);
      ctx.lineDashOffset = -dashStart + segmentLength;
      ctx.shadowColor = `hsla(${hueBase + 160}, 100%, 72%, ${0.7 * alpha})`;
      ctx.shadowBlur = hoveredRef.current ? 12 : 6;
      ctx.stroke(path);
      ctx.restore();

      // Static dim base border
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke(path);
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="relative rounded-2xl cursor-default h-full"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-delay={delay}
      style={{ isolation: "isolate" }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      {/* Canvas rainbow border — slightly larger than card to give glow room */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none rounded-2xl"
        style={{
          zIndex: 2,
          top: "-8px",
          left: "-8px",
          width: "calc(100% + 16px)",
          height: "calc(100% + 16px)",
        }}
      />

      {/* Glass body */}
      <div
        className="relative p-6 rounded-2xl h-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          zIndex: 1,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold text-blue-dim font-mono">
            {cat.tag}
          </span>
          <h3 className="font-semibold text-text-primary text-sm tracking-wide uppercase">
            {cat.label}
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          {cat.skills.map((s) => (
            <SkillBar key={s.name} name={s.name} level={s.level} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Deep dark base */}
      <div className="absolute inset-0" style={{ background: "#080d14" }} />

      {/* Aurora blob — left-center, blue/indigo */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "60%",
          height: "70%",
          bottom: "-10%",
          left: "-5%",
          background:
            "radial-gradient(ellipse at center, rgba(56, 80, 200, 0.45) 0%, rgba(80, 40, 180, 0.2) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Aurora blob — right-center, purple */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "45%",
          height: "60%",
          bottom: "-5%",
          right: "5%",
          background:
            "radial-gradient(ellipse at center, rgba(110, 50, 220, 0.35) 0%, rgba(60, 30, 160, 0.15) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Grain noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.55,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-14"
          data-aos="fade-up"
          data-aos-duration="600"
        >
          <p className="text-xs font-semibold tracking-widest text-blue-primary uppercase mb-4">
            // habilidades
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Stack técnico
          </h2>
          <p className="text-text-muted font-light mt-3 max-w-md mx-auto text-[15px]">
            Ferramentas que uso para construir sistemas completos — do banco de
            dados à interface final.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {skillCategories.map((cat, i) => (
            <GlassCard
              key={cat.label}
              cat={cat}
              delay={i * 120}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}