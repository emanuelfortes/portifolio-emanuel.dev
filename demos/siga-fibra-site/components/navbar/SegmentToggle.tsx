'use client'

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { useTheme } from '@/demos/siga-fibra-site/components/ThemeProvider'

type Segment = 'pf' | 'empresa'

interface SegmentToggleProps {
  active: Segment
  onChange: (seg: Segment) => void
}

export default function SegmentToggle({ active, onChange }: SegmentToggleProps) {
  const { isDark } = useTheme()
  const pfRef = useRef<HTMLButtonElement>(null)
  const empresaRef = useRef<HTMLButtonElement>(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })

  const syncPill = (seg: Segment) => {
    const btn = seg === 'pf' ? pfRef.current : empresaRef.current
    if (!btn) return
    const { offsetLeft: left, offsetWidth: width } = btn
    setPillStyle(prev => (prev.left === left && prev.width === width ? prev : { left, width }))
  }

  useLayoutEffect(() => { syncPill(active) }, [active])

  useEffect(() => {
    const handleResize = () => syncPill(active)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [active])

  return (
    <div
      className="relative flex items-center shrink-0 rounded-full p-0.5"
      style={{
        background: isDark ? '#0d1821' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
      }}
    >
      <div
        className="absolute top-0.5 bottom-0.5 rounded-full pointer-events-none"
        style={{
          left: pillStyle.left,
          width: pillStyle.width,
          background: active === 'empresa'
            ? '#03C2C3'
            : 'linear-gradient(135deg, #27CAA3, #3ddcbc)',
          boxShadow: active === 'empresa'
            ? '0 2px 8px rgba(3,194,195,0.45)'
            : '0 2px 8px rgba(39,202,163,0.45)',
          transition: 'left 0.32s cubic-bezier(0.4, 0, 0.2, 1), width 0.32s cubic-bezier(0.4, 0, 0.2, 1), background 0.32s ease',
        }}
      />
      <button
        ref={pfRef}
        onClick={() => onChange('pf')}
        className="relative z-10 px-5 py-2 rounded-full text-xs font-semibold transition-colors duration-200"
        style={{ color: active === 'pf' ? '#fff' : (isDark ? '#9ca3af' : '#555') }}
      >
        Residencial
      </button>
      <button
        ref={empresaRef}
        onClick={() => onChange('empresa')}
        className="relative z-10 px-5 py-2 rounded-full text-xs font-semibold transition-colors duration-200"
        style={{ color: active === 'empresa' ? '#fff' : (isDark ? '#9ca3af' : '#555') }}
      >
        Empresa
      </button>
    </div>
  )
}
