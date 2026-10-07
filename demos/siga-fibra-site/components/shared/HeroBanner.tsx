'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface BannerSlide {
  image: string
  imageMobile?: string
  imageAlt?: string
  onClick?: () => void
}

interface HeroBannerProps {
  slides: BannerSlide[]
  autoPlayInterval?: number  // ms, default 5000. 0 = desativado
  accentColor?: string       // cor dos dots ativos
  aspectRatio?: string       // ex: '3/1', '16/5'. default '3/1'
  aspectRatioMobile?: string // se omitido herda aspectRatio
  showArrows?: boolean
}

function SlideMedia({ slide, className, style, draggable }: {
  slide: BannerSlide
  className: string
  style?: CSSProperties
  draggable: boolean
}) {
  if (slide.imageMobile) {
    return (
      <picture className={className} style={style}>
        <source srcSet={slide.imageMobile} media="(max-width: 767px)" />
        <img src={slide.image} alt={slide.imageAlt ?? ''} className="w-full h-full object-cover select-none" draggable={draggable} />
      </picture>
    )
  }
  return (
    <img src={slide.image} alt={slide.imageAlt ?? ''} className={className} style={style} draggable={draggable} />
  )
}

export default function HeroBanner({
  slides,
  autoPlayInterval = 5000,
  accentColor = '#27CAA3',
  aspectRatio = '3/1',
  aspectRatioMobile,
  showArrows = true,
}: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [transitioning, setTransitioning] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isSnapping, setIsSnapping] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startX: 0, active: false, hasMoved: false })

  const go = useCallback((index: number) => {
    if (transitioning || index === current) return
    const n = slides.length
    const goForward = (index - current + n) % n < n / 2
    setDirection(goForward ? 'left' : 'right')
    setOutgoing(current)
    setCurrent(index)
    setTransitioning(true)
    setTimeout(() => {
      setOutgoing(null)
      setTransitioning(false)
    }, 500)
  }, [transitioning, current, slides.length])

  const next = useCallback(() => go((current + 1) % slides.length), [current, slides.length, go])
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, slides.length, go])

  useEffect(() => {
    if (!autoPlayInterval || slides.length <= 1 || dragRef.current.active) return
    timerRef.current = setTimeout(next, autoPlayInterval)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, autoPlayInterval, next, slides.length])

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (transitioning) return
    dragRef.current = { startX: e.clientX, active: true, hasMoved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    if (Math.abs(dx) > 5) dragRef.current.hasMoved = true
    setDragOffset(dx)
  }

  function handlePointerUp() {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    const hasMoved = dragRef.current.hasMoved
    dragRef.current.hasMoved = false

    if (!hasMoved) {
      const slide = slides[current]
      slide.onClick?.()
      return
    }

    const threshold = (containerRef.current?.offsetWidth ?? 300) * 0.2
    const dx = dragOffset

    if (Math.abs(dx) > threshold) {
      setDragOffset(0)
      if (dx < 0) next()
      else prev()
    } else {
      setIsSnapping(true)
      setDragOffset(0)
      setTimeout(() => setIsSnapping(false), 300)
    }
  }

  const isDragging = dragRef.current.active && Math.abs(dragOffset) > 5
  const adjacentIndex = dragOffset < 0
    ? (current + 1) % slides.length
    : (current - 1 + slides.length) % slides.length
  const containerWidth = containerRef.current?.offsetWidth ?? 0

  return (
    <section className="relative w-full overflow-hidden" style={{ background: '#000' }}>
      <style>{`
        @keyframes hb-slide-in-from-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes hb-slide-out-to-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes hb-slide-in-from-left {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes hb-slide-out-to-right {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }
        .hb-enter-left  { animation: hb-slide-in-from-right 0.5s ease forwards; }
        .hb-exit-left   { animation: hb-slide-out-to-left  0.5s ease forwards; }
        .hb-enter-right { animation: hb-slide-in-from-left  0.5s ease forwards; }
        .hb-exit-right  { animation: hb-slide-out-to-right 0.5s ease forwards; }
        .hb-arrow {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .hb-root:hover .hb-arrow { opacity: 1; }
        .hb-dot {
          transition: width 0.3s ease, background 0.3s ease;
          height: 8px;
          border-radius: 4px;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .hb-root { aspect-ratio: var(--hb-ar, 3/1); }
        @media (max-width: 767px) { .hb-root { aspect-ratio: var(--hb-ar-m, var(--hb-ar, 3/1)); } }
      `}</style>

      <div
        ref={containerRef}
        className="hb-root relative w-full"
        style={{
          '--hb-ar': aspectRatio,
          '--hb-ar-m': aspectRatioMobile ?? aspectRatio,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        } as CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Slide adjacente que aparece enquanto arrasta */}
        {isDragging && (
          <SlideMedia
            key={`adj-${adjacentIndex}`}
            slide={slides[adjacentIndex]}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `translateX(${dragOffset < 0
                ? containerWidth + dragOffset
                : -containerWidth + dragOffset}px)`,
            }}
            draggable={false}
          />
        )}

        {/* Slide saindo (animação CSS após botão/dot) */}
        {outgoing !== null && !isDragging && (
          <SlideMedia
            key={`out-${outgoing}`}
            slide={slides[outgoing]}
            className={`absolute inset-0 w-full h-full object-cover select-none ${direction === 'left' ? 'hb-exit-left' : 'hb-exit-right'}`}
            draggable={false}
          />
        )}

        {/* Slide atual */}
        <SlideMedia
          key={`in-${current}`}
          slide={slides[current]}
          className={[
            'absolute inset-0 w-full h-full object-cover select-none',
            !isDragging && transitioning
              ? direction === 'left' ? 'hb-enter-left' : 'hb-enter-right'
              : '',
          ].join(' ')}
          style={isDragging
            ? { transform: `translateX(${dragOffset}px)` }
            : isSnapping
              ? { transform: 'translateX(0)', transition: 'transform 0.3s ease' }
              : undefined}
          draggable={false}
        />

        {showArrows && slides.length > 1 && (
          <button
            onClick={prev}
            className="hb-arrow absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            aria-label="Anterior"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {showArrows && slides.length > 1 && (
          <button
            onClick={next}
            className="hb-arrow absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            aria-label="Próximo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="hb-dot"
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? '24px' : '8px',
                  background: i === current ? accentColor : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
