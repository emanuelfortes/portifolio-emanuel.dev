'use client'

import { useEffect } from 'react'
import { usePathname } from '@/demos/dr-erico/lib/pathname'

/**
 * Substitui o componente ScrollToTop original que usava useLocation do
 * react-router-dom. No Next.js usamos usePathname do next/navigation.
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
