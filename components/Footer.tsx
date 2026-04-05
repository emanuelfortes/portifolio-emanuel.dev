export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-dim text-sm">
          © {new Date().getFullYear()} · Desenvolvido com{" "}
          <span className="text-blue-primary">Next.js</span> &{" "}
          <span className="text-blue-primary">Tailwind CSS</span>
        </p>
        <div className="flex items-center gap-1.5">
          <span className="glow-dot" />
          <span className="text-text-dim text-xs">Disponível para projetos</span>
        </div>
      </div>
    </footer>
  );
}
