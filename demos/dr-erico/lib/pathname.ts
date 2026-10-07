'use client'

import { usePathname as useNextPathname } from 'next/navigation'
import { stripBase } from './routes'

/** usePathname() sem o prefixo /demo/dr-erico, igual ao que o original veria. */
export function usePathname(): string {
  return stripBase(useNextPathname() ?? '/')
}
