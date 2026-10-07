'use client'

import { useState } from 'react'
import Link from '@/demos/dr-erico/lib/Link'
import { usePathname } from '@/demos/dr-erico/lib/pathname'
import { Menu, X, MessageCircle } from 'lucide-react'
import Logo from './Logo'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/dr-erico-diogenes', label: 'Dr. Érico Diógenes' },
  { to: '/#tratamentos', label: 'Tratamentos' },
  { to: '/holep', label: 'HoLEP' },
  { to: '/cirurgia-robotica', label: 'Cirurgia Robótica' },
  { to: '/blog', label: 'Blog' },
  // Notícias fica ao lado de Blog porque são vizinhas de papel: uma trata do
  // que não envelhece, a outra do que tem data. Juntas no menu, a diferença
  // fica visível; separadas, pareceriam seções sem relação.
  { to: '/noticias', label: 'Notícias' },
  { to: '/midias', label: 'Mídias' },
  { to: '/contato', label: 'Contato' },
]

/**
 * Substitui o NavLink do react-router-dom por Link do Next + usePathname para
 * detectar rota ativa. A regra "end" do react-router (match exato) é
 * reproduzida para o item raiz.
 */
function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-40">
      <div className="container-site flex items-center justify-between py-4">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo variant="light" />
        </Link>

        {/* Desktop nav */}
        {/*
          A barra horizontal passou a aparecer em xl (1280px), não em lg (1024).

          Em 1024 ela já estava quebrada ANTES de "Notícias" entrar, com os oito
          itens anteriores: "Início" subia por cima do logo, "Dr. Érico
          Diógenes" e "Cirurgia Robótica" quebravam em duas linhas e "Contato"
          ficava por baixo do botão de agendar. Conferido por captura de tela na
          versão publicada antes da mudança.

          Tentei primeiro apertar o espaçamento, de gap-7 para gap-4, e não
          bastou: o problema é a soma das larguras, não o respiro entre elas.

          Entre 1024 e 1280 o site passa a usar o menu sanduíche, que já existe
          e funciona. Menu sanduíche num notebook pequeno é escolha comum;
          barra com itens empilhados uns sobre os outros não é escolha nenhuma.
        */}
        <ul className="hidden xl:flex items-center gap-7">
          {navItems.map((item) => {
            const active = isActive(pathname, item.to)
            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                    active ? 'text-brand-gold' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <a
          href="https://wa.me/5585981781020"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex btn-whatsapp !py-2.5 !px-5 text-sm"
        >
          <MessageCircle size={18} />
          Agendar Consulta
        </a>

        {/* Mobile toggle */}
        <button
          className="xl:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden border-t border-white/10 bg-brand-navy">
          <ul className="container-site py-4 flex flex-col gap-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.to)
              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className={`block py-2 text-base font-medium ${
                      active ? 'text-brand-gold' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li>
              <a
                href="https://wa.me/5585981781020"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center mt-2"
              >
                <MessageCircle size={18} />
                Agendar Consulta
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
