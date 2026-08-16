import Image from "next/image";
import { githubUrl, linkedinUrl, whatsappBare } from "@/data/site";

const links = [
  { label: "GitHub", href: githubUrl },
  { label: "LinkedIn", href: linkedinUrl },
  { label: "WhatsApp", href: whatsappBare },
];

export default function Footer() {
  return (
    <footer className="container-page flex flex-wrap items-center justify-between gap-5 border-t border-lilac/10 py-10">
      {/* A logo já traz o wordmark e a tagline "Código · Solução · Impacto",
          então não repetimos esses textos aqui ao lado. */}
      <Image
        src="/logo-on-dark.png"
        alt="Fortes Dev. Código · Solução · Impacto"
        width={954}
        height={806}
        className="h-auto w-32 opacity-90 transition-opacity hover:opacity-100"
      />

      <div className="flex gap-5 text-[13px]">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-txt-muted transition-colors hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="text-xs text-txt-label">
        © {new Date().getFullYear()} Fortes Dev · Next.js &amp; Tailwind CSS
      </div>
    </footer>
  );
}
