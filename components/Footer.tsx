import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Logo completa */}
        <Image
          src="/logo-on-dark.png"
          alt="Fortes Dev — Código · Solução · Impacto"
          width={954}
          height={806}
          className="w-28 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
        />

        <div className="flex flex-col items-center sm:items-end gap-3">
          <div className="flex items-center gap-1.5">
            <span className="glow-dot" />
            <span className="text-text-dim text-xs">Disponível para projetos</span>
          </div>
          <p className="text-text-dim text-sm text-center sm:text-right">
            © {new Date().getFullYear()} Fortes Dev · Desenvolvido com{" "}
            <span className="text-brand-light">Next.js</span> &{" "}
            <span className="text-brand-light">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
