"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Skills", href: "#skills" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-bold text-lg tracking-tight text-text-primary hover:text-blue-glow transition-colors duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          emanuelfortes<span className="text-blue-primary">.dev</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-primary group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA Desktop */}
        <a
          href="#contato"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#contato");
          }}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-primary/10 border border-blue-primary/20 text-blue-glow text-sm font-medium hover:bg-blue-primary/20 hover:border-blue-primary/40 transition-all duration-200"
        >
          Falar comigo
        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 bg-text-primary transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-text-primary transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-text-primary transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-surface/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-text-muted hover:text-text-primary text-left transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contato")}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-primary text-white text-sm font-medium text-center"
          >
            Falar comigo
          </button>
        </div>
      </div>
    </header>
  );
}
