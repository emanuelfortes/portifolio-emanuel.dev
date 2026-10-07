'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { SITES, useSite } from '../context/SiteContext'

export function SiteSelector() {
  const { site, setSite } = useSite()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = SITES.find(s => s.id === site) ?? SITES[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
        style={{ background: 'rgba(39,202,163,0.08)', border: '1px solid rgba(39,202,163,0.2)' }}
      >
        <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#27CAA3' }} />
        <span className="flex-1 min-w-0">
          <span className="block text-xs font-semibold text-white truncate">{current.label}</span>
          <span className="block text-[10px] truncate" style={{ color: 'rgba(156,163,175,0.8)' }}>{current.hint}</span>
        </span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: 'rgba(39,202,163,0.7)', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-40"
          style={{ background: '#0d1719', border: '1px solid rgba(39,202,163,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
        >
          {SITES.map(s => (
            <button
              key={s.id}
              onClick={() => { setSite(s.id); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors"
              style={{ background: s.id === site ? 'rgba(39,202,163,0.12)' : 'transparent' }}
              onMouseEnter={e => { if (s.id !== site) e.currentTarget.style.background = 'rgba(39,202,163,0.06)' }}
              onMouseLeave={e => { if (s.id !== site) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-semibold truncate" style={{ color: s.id === site ? '#27CAA3' : '#e5e7eb' }}>
                  {s.label}
                </span>
                <span className="block text-[10px] truncate" style={{ color: 'rgba(156,163,175,0.7)' }}>{s.hint}</span>
              </span>
              {s.id === site && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#27CAA3' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
