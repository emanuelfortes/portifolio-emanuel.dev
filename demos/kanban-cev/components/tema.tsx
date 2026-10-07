'use client'

import { useLayoutEffect } from 'react'
import { aplicarFavicon } from '@/demos/kanban-cev/lib/favicon'

/**
 * Aplica o tema guardado antes da primeira pintura das telas.
 *
 * No original isto é um script síncrono no <head>, que escreve `data-theme`
 * no <html>. Aqui o <html> é do layout comum das réplicas, e um atributo
 * escrito antes da hidratação geraria aviso de divergência — então o mesmo
 * trabalho é feito no primeiro efeito de layout, que roda antes de qualquer
 * efeito das telas (o botão de tema lê o atributo num `useEffect`).
 */
export function Tema() {
  useLayoutEffect(() => {
    try {
      if (localStorage.getItem('acev-tema') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
        aplicarFavicon('light')
      }
    } catch {
      // Storage bloqueado: fica no escuro, o padrão.
    }
  }, [])
  return null
}
