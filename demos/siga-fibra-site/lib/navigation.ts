'use client'

import { useMemo } from 'react'
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { demoHref, isExternal, stripBase } from './routes'

/** usePathname() sem o prefixo da demo, igual ao que o original veria. */
export function usePathname(): string {
  return stripBase(useNextPathname() ?? '/')
}

/**
 * useRouter() com push/replace dentro da demo. O original navega quase tudo
 * por router.push('/pessoa-fisica/...'); aqui o destino ganha o prefixo e,
 * quando no original a página só redireciona para o WhatsApp, o WhatsApp abre
 * numa nova aba.
 */
export function useRouter() {
  const router = useNextRouter()
  return useMemo(() => {
    const ir = (metodo: 'push' | 'replace') => (href: string) => {
      const destino = demoHref(href)
      if (isExternal(destino)) window.open(destino, '_blank', 'noopener,noreferrer')
      else router[metodo](destino)
    }
    return { ...router, push: ir('push'), replace: ir('replace') }
  }, [router])
}
