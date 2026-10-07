'use client'

import { useState, useEffect, useRef } from 'react'

const CITIES = [
  'Fortaleza',
  'Maracanaú',
  'Caucaia',
  'Maranguape',
  'Eusébio',
  'Aquiraz',
]

const STORAGE_KEY = 'siga_city_override'

/* O original descobre a cidade pelo IP do visitante (ipapi.co). A réplica não
   faz chamadas externas: a detecção automática responde a cidade principal. */
const AUTO_CITY = 'Fortaleza/CE'

export default function LocationBadge() {
  const [autoCity, setAutoCity] = useState<string | null>(null)
  const [override, setOverride] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const displayed = override ?? autoCity

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setOverride(saved)

    setAutoCity(AUTO_CITY)
    setLoading(false)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(city: string | null) {
    if (city) {
      localStorage.setItem(STORAGE_KEY, `${city}/CE`)
      setOverride(`${city}/CE`)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      setOverride(null)
    }
    setOpen(false)
  }

  if (loading) return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400 animate-pulse">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Localizando...
    </div>
  )

  if (!displayed) return null

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
        style={{
          background: open ? 'rgba(39,202,163,0.12)' : 'rgba(0,0,0,0.06)',
          color: '#374151',
          border: open ? '1px solid rgba(39,202,163,0.3)' : '1px solid transparent',
        }}
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#27CAA3' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {displayed}
        <svg className="w-3 h-3 flex-shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden z-50"
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          }}
        >
          <div className="px-3 pt-3 pb-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selecionar cidade</p>
          </div>

          {/* Auto-detect option */}
          <button
            onClick={() => select(null)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-50"
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: !override ? 'rgba(39,202,163,0.15)' : 'transparent' }}>
              <svg className="w-3 h-3" fill="none" stroke={!override ? '#27CAA3' : '#d1d5db'} strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-semibold" style={{ color: !override ? '#27CAA3' : '#374151' }}>
              Detectar automaticamente
            </span>
            {!override && (
              <svg className="w-3.5 h-3.5 ml-auto flex-shrink-0" fill="none" stroke="#27CAA3" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="mx-3 my-1 h-px bg-gray-100" />

          {/* City list */}
          {CITIES.map(city => {
            const val = `${city}/CE`
            const isSelected = override === val
            return (
              <button
                key={city}
                onClick={() => select(city)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-50"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: isSelected ? 'rgba(39,202,163,0.15)' : '#f3f4f6' }}>
                  <span className="text-[10px]">📍</span>
                </div>
                <span className="font-medium" style={{ color: isSelected ? '#27CAA3' : '#374151' }}>
                  {city}
                  {city === 'Fortaleza' && (
                    <span className="ml-1 text-[10px] text-gray-400">(principal)</span>
                  )}
                </span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 ml-auto flex-shrink-0" fill="none" stroke="#27CAA3" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}

          <div className="px-3 py-2.5">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              A localização ajuda a exibir planos disponíveis na sua região.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
