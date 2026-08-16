"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { githubUrl } from "@/data/site";

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Skills", href: "#skills" },
  { label: "Projetos", href: "#projetos" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <header
        className={[
          "pointer-events-auto box-border flex items-center justify-between",
          "transition-all duration-[450ms] ease-smooth",
          scrolled
            ? "mt-3 w-[min(1000px,94vw)] rounded-full border border-lilac/[0.18] bg-surface-nav py-2.5 pl-6 pr-3 shadow-nav backdrop-blur-[20px]"
            : "mt-0 w-full rounded-none border border-transparent bg-transparent px-[5vw] py-4 backdrop-blur-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-6">
          <a href="#" aria-label="Fortes Dev, ir para o topo" className="flex items-center">
            <Image
              src="/logo-horizontal.png"
              alt="Fortes Dev"
              width={1600}
              height={427}
              priority
              className="h-7 w-auto"
            />
          </a>

          <nav className="flex gap-5 font-mono text-[11px] uppercase tracking-[0.1em] max-[900px]:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-txt-muted transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="#contato"
            className="rounded-full bg-grad-pill px-5 py-[9px] text-[12.5px] font-semibold text-ink-deep transition-[filter] hover:brightness-[1.15]"
          >
            Falar comigo
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-lilac/25 bg-white/[0.02] px-[18px] py-[9px] text-[12.5px] font-medium text-[#d6d1ea] transition-colors hover:border-lilac hover:text-white"
          >
            GitHub
          </a>
        </div>
      </header>
    </div>
  );
}
