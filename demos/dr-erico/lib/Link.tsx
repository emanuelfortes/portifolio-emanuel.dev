import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { demoHref } from './routes'

/**
 * next/link com os hrefs internos reescritos para /demo/dr-erico/...
 * Os componentes copiados do site original importam este Link no lugar do
 * next/link, e assim continuam escrevendo href="/holep" como no original.
 */
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const destino = typeof href === 'string' ? demoHref(href) : href
  return <NextLink href={destino} {...rest} />
}
