"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "@/demos/cirurgia-mohs/lib/Link";
import Image from "next/image";
import { usePathname } from "@/demos/cirurgia-mohs/lib/pathname";
import { mainNav, siteConfig } from "@/demos/cirurgia-mohs/config/site";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";

/**
 * Cabeçalho editorial (docs/HANDOFF.md §2.1): logotipo centralizado,
 * regra fina, navegação centralizada e regra dupla.
 *
 * Acompanha a rolagem. Passado o topo da página ele compacta: no computador a
 * linha do logotipo se recolhe e um logotipo menor entra à esquerda da
 * navegação, encurtando o cabeçalho de ~140px para ~50px. No celular a linha
 * continua, porque é onde fica o botão do menu, só que
 * mais baixa. Os dois limites diferentes evitam o cabeçalho piscar entre os
 * estados quando a rolagem para bem em cima do limite.
 *
 * No celular a navegação abre pelo botão de menu como lista vertical, um item
 * por linha, com os subitens recuados abaixo do item-mãe.
 */
const COMPACTA_ACIMA_DE = 140;
const EXPANDE_ABAIXO_DE = 60;

export default function Masthead() {
  const [open, setOpen] = useState(false);
  const [compacto, setCompacto] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  /* Item com submenu acende também quando a página é um dos filhos (ex.: Fortaleza em "Onde fazer") */
  const isActiveItem = (i: (typeof mainNav)[number]) =>
    isActive(i.href) || Boolean(i.children?.some((c) => isActive(c.href)));
  /* Celular: lista vertical, um item por linha, ativo em dourado.
     Computador: linha horizontal, ativo com sublinhado dourado. */
  const item =
    "block py-3.5 text-[13px] tracking-[0.5px] transition-colors md:inline-block md:border-b-2 md:py-4 md:text-[11px] md:tracking-[1px]";
  const state = (active: boolean) =>
    active ? "text-gold md:border-gold md:text-navy" : "md:border-transparent md:hover:border-navy-200";

  useEffect(() => {
    const aoRolar = () =>
      setCompacto((era) => (era ? window.scrollY > EXPANDE_ABAIXO_DE : window.scrollY > COMPACTA_ACIMA_DE));
    aoRolar(); // a página pode abrir já rolada: link com âncora, voltar do histórico
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-shadow duration-300 motion-reduce:transition-none ${
        compacto ? "shadow-[0_2px_14px_-6px_rgba(22,28,43,0.45)]" : ""
      }`}
    >
      {/* Linha do logotipo: recolhe no computador ao rolar; no celular só encolhe. */}
      <div
        className={`grid grid-rows-[1fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          compacto ? "md:grid-rows-[0fr]" : "md:grid-rows-[1fr]"
        }`}
      >
        {/* invisible tira o logotipo grande da ordem de tabulação quando recolhido */}
        <div className={`min-h-0 ${compacto ? "md:invisible" : ""}`}>
          <Container>
            <div
              className={`flex items-center justify-between transition-[padding] duration-300 motion-reduce:transition-none md:justify-center ${
                compacto ? "py-2" : "py-3 md:py-5"
              }`}
            >
              <button
                type="button"
                className="-ml-1.5 inline-flex h-12 w-12 items-center justify-center text-navy md:hidden"
                aria-expanded={open}
                aria-controls="menu-principal"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8" aria-hidden="true">
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
              <Link href="/" className="flex items-center" aria-label={`${siteConfig.marca}: página inicial`}>
                <Image
                  src="/demos/cirurgia-mohs/brand/logo-azul.webp"
                  alt={`${siteConfig.marca}. ${siteConfig.tagline}`}
                  width={925}
                  height={283}
                  priority
                  className={`w-auto transition-[height] duration-300 motion-reduce:transition-none md:h-16 ${
                    compacto ? "h-8" : "h-10"
                  }`}
                />
              </Link>
              {/* Espaçador da largura do botão de menu: mantém o logotipo centralizado no celular */}
              <span className="w-12 md:hidden" aria-hidden="true" />
            </div>
          </Container>
        </div>
      </div>

      <nav
        id="menu-principal"
        aria-label="Navegação principal"
        className={`${open ? "block" : "hidden"} border-t border-navy max-md:max-h-[70vh] max-md:overflow-y-auto md:block`}
      >
        <Container className="flex items-center gap-x-6">
          {/* Logotipo pequeno: entra à esquerda quando o cabeçalho compacta. */}
          <Link
            href="/"
            aria-label={`${siteConfig.marca}: página inicial`}
            className={`hidden shrink-0 overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none md:block ${
              compacto ? "max-w-[128px] opacity-100" : "invisible max-w-0 opacity-0"
            }`}
          >
            <Image src="/demos/cirurgia-mohs/brand/logo-azul.webp" alt="" width={925} height={283} className="h-7 w-auto" />
          </Link>
          <ul
            className={`flex flex-1 flex-col py-1 font-bold uppercase text-navy md:flex-row md:flex-wrap md:gap-x-8 md:py-0 ${
              compacto ? "md:justify-start" : "md:justify-center"
            }`}
          >
            {mainNav.map((i) => (
              <Fragment key={i.href}>
                <li className="group relative max-md:border-b max-md:border-line">
                  <Link
                    href={i.href}
                    aria-current={isActiveItem(i) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`${item} ${state(isActiveItem(i))}`}
                  >
                    {i.label}
                    {i.children && (
                      <svg viewBox="0 0 20 20" fill="none" className="ml-1 inline h-3 w-3 opacity-60 max-md:hidden" aria-hidden="true">
                        <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </Link>
                  {/* Desktop: submenu ao passar o mouse ou ao focar */}
                  {i.children && (
                    <ul className="absolute left-1/2 top-full z-50 hidden w-64 -translate-x-1/2 border border-navy bg-paper py-2 md:group-hover:block md:group-focus-within:block">
                      {i.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            aria-current={isActive(c.href) ? "page" : undefined}
                            className={`block px-4 py-2 text-[12px] font-semibold normal-case tracking-normal hover:bg-navy-50 hover:text-navy ${
                              isActive(c.href) ? "text-navy" : "text-navy-700"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                {/* Celular: os subitens entram recuados, logo abaixo do item-mãe */}
                {i.children?.map((c) => (
                  <li key={c.href} className="border-b border-line md:hidden">
                    <Link
                      href={c.href}
                      aria-current={isActive(c.href) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`block py-3 pl-5 text-[13px] font-semibold normal-case tracking-normal ${
                        isActive(c.href) ? "text-gold" : "text-navy-700"
                      }`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
        </Container>
      </nav>
      <div className="border-t-[3px] border-double border-navy" aria-hidden="true" />
    </header>
  );
}
