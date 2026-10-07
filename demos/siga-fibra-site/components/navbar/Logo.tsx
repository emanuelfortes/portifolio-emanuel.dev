'use client'

import Image from 'next/image'

interface LogoProps {
  onClick: () => void
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <button onClick={onClick} className="shrink-0 focus:outline-none" aria-label="Siga Fibra">
      <Image
        src="/demos/siga-fibra-site/img/logosiga.webp"
        alt="Siga Fibra"
        width={120}
        height={40}
        className="h-9 w-auto object-contain"
        priority
      />
    </button>
  )
}
