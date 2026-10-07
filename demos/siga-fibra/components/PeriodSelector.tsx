'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, Check, ChevronDown } from 'lucide-react'
import { PRESETS, formatRange, resolvePreset, toISO } from '../utils/period'
import type { PresetId, Range } from '../utils/period'

interface Props {
  preset: PresetId
  range: Range
  onChange: (preset: PresetId, range: Range) => void
}

export function PeriodSelector({ preset, range, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [from, setFrom] = useState(range.from)
  const [to, setTo] = useState(range.to)
  const ref = useRef<HTMLDivElement>(null)

  const current = PRESETS.find(p => p.id === preset) ?? PRESETS[0]
  const today = toISO(new Date())

  useEffect(() => {
    setFrom(range.from)
    setTo(range.to)
  }, [range.from, range.to])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const applyCustom = () => {
    if (!from || !to) return
    const ordered = from <= to ? { from, to } : { from: to, to: from }
    onChange('custom', ordered)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 rounded-xl px-4 py-2 text-left"
        style={{ background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.25)' }}
      >
        <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#27CAA3' }} />
        <span>
          <span className="block text-sm font-semibold" style={{ color: '#374151' }}>{current.label}</span>
          <span className="block text-[11px]" style={{ color: '#9ca3af' }}>{formatRange(range)}</span>
        </span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: '#27CAA3', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 rounded-xl overflow-hidden z-40 w-64"
          style={{ background: '#ffffff', border: '1.5px solid rgba(39,202,163,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        >
          <div className="max-h-72 overflow-y-auto">
            {PRESETS.filter(p => p.id !== 'custom').map(p => (
              <button
                key={p.id}
                onClick={() => { onChange(p.id, resolvePreset(p.id)); setOpen(false) }}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm"
                style={{ background: p.id === preset ? 'rgba(39,202,163,0.1)' : 'transparent', color: p.id === preset ? '#27CAA3' : '#374151' }}
                onMouseEnter={e => { if (p.id !== preset) e.currentTarget.style.background = 'rgba(39,202,163,0.05)' }}
                onMouseLeave={e => { if (p.id !== preset) e.currentTarget.style.background = 'transparent' }}
              >
                <span className="font-medium">{p.label}</span>
                {p.id === preset && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            ))}
          </div>

          <div className="p-3 border-t" style={{ borderColor: 'rgba(39,202,163,0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: preset === 'custom' ? '#27CAA3' : '#9ca3af' }}>
              Personalizado
            </p>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="date" value={from} max={today} onChange={e => setFrom(e.target.value)}
                className="flex-1 min-w-0 text-xs rounded-lg px-2 py-1.5 outline-none"
                style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }}
              />
              <span className="text-xs" style={{ color: '#9ca3af' }}>até</span>
              <input
                type="date" value={to} max={today} onChange={e => setTo(e.target.value)}
                className="flex-1 min-w-0 text-xs rounded-lg px-2 py-1.5 outline-none"
                style={{ border: '1.5px solid rgba(39,202,163,0.2)', color: '#374151' }}
              />
            </div>
            <button
              onClick={applyCustom}
              disabled={!from || !to}
              className="w-full py-2 rounded-lg text-xs font-bold text-white disabled:opacity-40"
              style={{ background: '#27CAA3' }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
