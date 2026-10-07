'use client'

import { createContext, useContext, useEffect, useState } from 'react'

/* Chave própria: a réplica divide o localStorage com o portfólio e as outras demos. */
const THEME_KEY = 'siga-fibra-site:theme'

const ThemeContext = createContext({ isDark: false, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem(THEME_KEY, 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem(THEME_KEY, 'light')
      }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
