"use client";

import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("seuemail@email.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    {
      label: "GitHub",
      href: "https://github.com/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contato" className="py-24 relative">
      {/* Glow bg */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div
          className="max-w-2xl mx-auto text-center"
          data-aos="fade-up"
          data-aos-duration="700"
        >
          <p className="text-xs font-semibold tracking-widest text-blue-primary uppercase mb-4">
            // contato
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
            Tem um projeto{" "}
            <span className="text-gradient">em mente?</span>
          </h2>
          <p className="text-text-muted font-light text-[15px] leading-relaxed max-w-md mx-auto mb-10">
            Se você precisa de um desenvolvedor que entende tanto de código
            quanto de negócio, vamos conversar. Respondo em até 24 horas.
          </p>

          {/* Email copy */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface border border-white/8">
              <span className="text-text-muted text-sm font-light">
                seuemail@email.com
              </span>
              <button
                onClick={handleCopy}
                className="text-blue-glow hover:text-blue-primary transition-colors duration-200"
                aria-label="Copiar email"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-white/8 text-text-muted text-sm font-medium hover:border-blue-primary/30 hover:text-blue-glow transition-all duration-200"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
            <a
              href="mailto:seuemail@email.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-primary text-white text-sm font-semibold hover:bg-blue-glow transition-all duration-200 shadow-blue-sm hover:shadow-blue-md"
            >
              Enviar mensagem
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
