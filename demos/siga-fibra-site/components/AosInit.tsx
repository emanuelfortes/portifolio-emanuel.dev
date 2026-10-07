'use client'

import { useEffect } from 'react'
import AOS from 'aos'

export default function AosInit() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
      offset: 60,
    })
  }, [])

  return null
}
