'use client'

import React from 'react'
import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'
import type { NavItem, NavChild } from './navConfig'
import { useTheme } from '@/demos/siga-fibra-site/components/ThemeProvider'

interface NavMenuProps {
  item: NavItem
  basePath: string
  isOpen: boolean
  onToggle: (id: string) => void
  onClose: () => void
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function NavMenu({ item, basePath, isOpen, onToggle, onClose }: NavMenuProps) {
  const router = useRouter()
  const { isDark } = useTheme()
  const children = item.children as NavChild[]

  const hoverBg = isDark ? 'rgba(255,255,255,0.07)' : '#f5f5f5'
  const textColor = isDark ? '#e5e7eb' : '#333'
  const dropdownBg = isDark ? '#0d1821' : '#ffffff'
  const dropdownBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e5e5'

  // Direct link, no dropdown
  if (item.href) {
    const dest = item.absoluteHref ? item.href : basePath + item.href
    return (
      <button
        onClick={() => router.push(dest)}
        className="flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{ color: textColor }}
        onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {item.label}
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => onToggle(item.id)}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
        style={isOpen ? { color: '#27CAA3', background: hoverBg } : { color: textColor }}
        onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = hoverBg }}
        onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
      >
        {item.label}
        <ChevronDown open={isOpen} />
      </button>

      {isOpen && (
        <div
          className="absolute top-[calc(100%+10px)] left-0 rounded-2xl z-50 flex flex-col gap-0.5 p-3 min-w-[220px]"
          style={{
            background: dropdownBg,
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.10)',
            border: `1px solid ${dropdownBorder}`,
            animation: 'dropIn 0.16s cubic-bezier(0.16,1,0.3,1)'
          }}
        >
          <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #27CAA3, #03C2C3)' }} />

          {children.map((child) => (
            <button
              key={child.label}
              onClick={() => {
                if (child.external) { window.open(child.to, '_blank', 'noopener,noreferrer') }
                else { router.push(basePath + child.to) }
                onClose()
              }}
              className="w-full text-left px-4 py-2.5 text-sm rounded-xl transition-colors duration-150"
              style={child.highlight ? { color: '#27CAA3', fontWeight: 600 } : { color: textColor }}
              onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
