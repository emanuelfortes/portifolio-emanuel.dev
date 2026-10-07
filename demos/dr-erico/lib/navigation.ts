import { notFound, redirect as nextRedirect } from 'next/navigation'
import { demoHref } from './routes'

export { notFound }

/** redirect() com o destino dentro da demo. */
export function redirect(destino: string): never {
  return nextRedirect(demoHref(destino))
}
