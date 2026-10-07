'use client'

import { useState } from 'react'
import type { NavItem, NavChild } from './navConfig'

type Segment = 'pf' | 'empresa'

interface MobileMenuProps {
  open: boolean
  segment: Segment
  config: NavItem[]
  basePath: string
  onSegmentChange: (seg: Segment) => void
  onClose: () => void
  onNavigate: (path: string) => void
}

export default function MobileMenu({ open, segment, config, basePath, onSegmentChange, onClose, onNavigate }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden" style={{ top: '67px' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 left-0 right-0 bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 67px)' }}>
        <div className="px-4 py-4">

          <div className="flex items-center bg-gray-100 rounded-full p-1 mb-5">
            {(['pf', 'empresa'] as Segment[]).map(seg => (
              <button
                key={seg}
                onClick={() => onSegmentChange(seg)}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={segment === seg ? { background: '#27CAA3', color: '#fff' } : { color: '#555' }}
              >
                {seg === 'pf' ? 'Pessoa Física' : 'Empresa'}
              </button>
            ))}
          </div>

          {config.map((item) => {
            const isExpanded = expandedItem === item.id
            const children = item.children as NavChild[]

            // Direct link, no dropdown
            if (item.href) {
              const dest = item.absoluteHref ? item.href : basePath + item.href
              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => onNavigate(dest)}
                    className="w-full flex items-center px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-150"
                    style={{ color: '#333' }}
                  >
                    {item.label}
                  </button>
                </div>
              )
            }

            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-150"
                  style={isExpanded ? { background: '#f5f5f5', color: '#27CAA3' } : { color: '#333' }}
                >
                  {item.label}
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="mt-1 ml-2 pl-3 border-l-2 flex flex-col gap-0.5 pb-2" style={{ borderColor: '#27CAA3' }}>
                    {children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => {
                          if (child.external) { window.open(child.to, '_blank', 'noopener,noreferrer') }
                          else { onNavigate(basePath + child.to) }
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                        style={child.highlight ? { color: '#27CAA3', fontWeight: 600 } : { color: '#444' }}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={() => window.open(segment === 'empresa' ? 'https://wa.me/558531989555' : 'https://wa.me/558531989550', '_blank', 'noopener,noreferrer')}
              className="w-full font-bold py-4 rounded-2xl text-sm uppercase tracking-wide text-white"
              style={{ background: '#27CAA3' }}
            >
              Fale conosco
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
