'use client'

/**
 * `next/link` e `next/navigation` com o prefixo da réplica.
 *
 * As telas foram copiadas do original com os caminhos de lá ("/eu",
 * "/demandas/123"). Em vez de reescrever cada link, elas importam daqui: o
 * `Link` e o `router` acrescentam `/demo/kanban-cev`, e o `usePathname` tira,
 * para a barra lateral continuar comparando com "/eu".
 */
import NextLink from 'next/link'
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation'
import { forwardRef, useMemo, type ComponentProps } from 'react'
import { BASE, to } from './paths'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { href: string }

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, ...props }, ref) {
  return <NextLink ref={ref} href={to(href)} {...props} />
})

export default Link

export function useRouter() {
  const r = useNextRouter()
  return useMemo(
    () => ({
      ...r,
      push: (href: string, opts?: Parameters<typeof r.push>[1]) => r.push(to(href), opts),
      replace: (href: string, opts?: Parameters<typeof r.replace>[1]) => r.replace(to(href), opts),
    }),
    [r],
  )
}

/** O caminho como o original o enxerga: a raiz da réplica é a Home, `/inicio`. */
export function usePathname() {
  const p = useNextPathname() ?? ''
  const resto = p.startsWith(BASE) ? p.slice(BASE.length) : p
  return resto === '' || resto === '/' ? '/inicio' : resto
}

export const useSearchParams = useNextSearchParams
