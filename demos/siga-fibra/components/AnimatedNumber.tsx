'use client'

import { useEffect, useRef, useState } from 'react'
import { DURACAO, prefereMenosMovimento } from '../utils/motion'

interface Props {
  value: number
  decimals?: number
  suffix?: string
  duration?: number
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Número que transita até o novo valor em vez de trocar de golpe.
 *
 * Quando um clique entra e o total vai de 8 para 9, o painel sobe o número
 * suavemente — sem estado de carregando, sem piscar.
 */
export function AnimatedNumber({ value, decimals = 0, suffix = '', duration = DURACAO }: Props) {
  const [display, setDisplay] = useState(value)
  const atual = useRef(value)

  useEffect(() => { atual.current = display }, [display])

  useEffect(() => {
    const de = atual.current
    if (de === value) return

    if (prefereMenosMovimento()) {
      setDisplay(value)
      return
    }

    let raf = 0
    const inicio = performance.now()

    const passo = (agora: number) => {
      const t = Math.min((agora - inicio) / duration, 1)
      setDisplay(de + (value - de) * easeOutCubic(t))
      if (t < 1) raf = requestAnimationFrame(passo)
    }

    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  const texto = display.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return <>{texto}{suffix}</>
}
