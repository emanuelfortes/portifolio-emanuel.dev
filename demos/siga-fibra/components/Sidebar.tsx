'use client'

import { LayoutDashboard, MousePointerClick, TrendingUp, Server, LogOut, X, Zap, ShieldAlert, Gift } from 'lucide-react'
import { SiteSelector } from './SiteSelector'

interface SidebarProps {
  active: string
  onChange: (page: string) => void
  onLogout: () => void
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  { id: 'overview', label: 'Visão Geral',    icon: LayoutDashboard },
  { id: 'campanha', label: 'Campanha do Mês', icon: Gift },
  { id: 'server',   label: 'Servidor',       icon: Server },
  { id: 'traffic',  label: 'Tráfego',        icon: TrendingUp },
  { id: 'clicks',   label: 'Cliques',        icon: MousePointerClick },
  { id: 'edge',        label: 'Edge Requests', icon: Zap },
  { id: 'ip-analysis', label: 'Análise de IPs', icon: ShieldAlert },
]

export function Sidebar({ active, onChange, onLogout, isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile — slide de cima pra baixo */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 transition-transform duration-300"
        style={{
          background: '#060d0f',
          borderBottom: '1px solid rgba(39,202,163,0.15)',
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
          <img src="/demos/siga-fibra/logosiga.png" alt="Siga Fibra" className="h-8 w-auto object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: 'rgba(39,202,163,0.7)', border: '1px solid rgba(39,202,163,0.2)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pt-4">
          <SiteSelector />
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                active === id
                  ? { background: 'linear-gradient(135deg, #27CAA3, #03C2C3)', color: '#fff' }
                  : { color: '#9ca3af' }
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ color: '#ef4444' }}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Desktop — sidebar fixa à esquerda */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-30"
        style={{ background: '#060d0f' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
          <div className="flex flex-col items-center gap-2">
            <img
              src="/demos/siga-fibra/logosiga.png"
              alt="Siga Fibra"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.removeAttribute('style')
              }}
            />
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ display: 'none', background: 'linear-gradient(135deg, #27CAA3, #03C2C3)' }}
            >
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(39,202,163,0.7)' }}>
              Painel de Controle
            </p>
          </div>
        </div>

        <div className="px-4 pt-4">
          <SiteSelector />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === id ? 'text-white' : 'text-gray-500 hover:text-white'
              }`}
              style={
                active === id
                  ? { background: 'linear-gradient(135deg, #27CAA3, #03C2C3)', boxShadow: '0 4px 16px rgba(39,202,163,0.25)' }
                  : {}
              }
              onMouseEnter={(e) => { if (active !== id) e.currentTarget.style.background = 'rgba(39,202,163,0.08)' }}
              onMouseLeave={(e) => { if (active !== id) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 transition-all duration-200 hover:text-red-400"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
