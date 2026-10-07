'use client'

import { createContext, useContext, useState } from 'react'

export type SiteId = 'all' | 'workspace' | 'lp'

export const SITES: { id: SiteId; label: string; hint: string }[] = [
  { id: 'all',       label: 'Todos os sites', hint: 'Soma de tudo' },
  { id: 'workspace', label: 'Site Principal', hint: 'sigafibra.com' },
  { id: 'lp',        label: 'Landing Page',   hint: 'LP de campanha' },
]

interface SiteContextValue {
  site: SiteId
  setSite: (s: SiteId) => void
}

const SiteContext = createContext<SiteContextValue>({ site: 'all', setSite: () => {} })

function readStored(): SiteId {
  try {
    const saved = sessionStorage.getItem('sf_site')
    if (saved === 'all' || saved === 'workspace' || saved === 'lp') return saved
  } catch {}
  return 'all'
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSiteState] = useState<SiteId>(readStored)

  const setSite = (s: SiteId) => {
    setSiteState(s)
    try {
      sessionStorage.setItem('sf_site', s)
    } catch {}
  }

  return <SiteContext.Provider value={{ site, setSite }}>{children}</SiteContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSite() {
  return useContext(SiteContext)
}
