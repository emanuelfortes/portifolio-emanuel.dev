import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { demoHref, isExternal } from './routes'

type Props = ComponentProps<typeof NextLink>

/**
 * next/link com os hrefs internos reescritos para /demo/siga-fibra-site/...
 * Os componentes copiados do original importam este Link no lugar do
 * next/link e continuam escrevendo href="/pessoa-fisica/..." como no original.
 * Destinos que no original redirecionam para o WhatsApp abrem numa nova aba.
 */
export default function Link({ href, ...rest }: Props) {
  const destino = typeof href === 'string' ? demoHref(href) : href
  if (typeof destino === 'string' && isExternal(destino)) {
    const { className, style, children, onClick, onMouseEnter, onMouseLeave } = rest
    return (
      <a
        href={destino}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    )
  }
  return <NextLink href={destino} {...rest} />
}
