import Image from 'next/image'

type Props = {
  variant?: 'light' | 'dark'
  className?: string
}

export default function Logo({ className = '' }: Props) {
  return (
    <Image unoptimized
      src="/demos/dr-erico/img/logo_1.webp"
      alt="Dr. Érico Diógenes"
      width={160}
      height={48}
      priority
      className={`h-12 w-auto object-contain ${className}`}
    />
  )
}
