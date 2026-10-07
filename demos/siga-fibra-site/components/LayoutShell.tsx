'use client'

import { usePathname } from '@/demos/siga-fibra-site/lib/navigation'
import Navbar from '@/demos/siga-fibra-site/components/navbar/Navbar'
import Footer from '@/demos/siga-fibra-site/components/footer/Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCheckout = pathname?.includes('/checkout')

  return (
    <>
      {!isCheckout && <Navbar />}
      <div className={isCheckout ? '' : 'pt-[67px]'}>{children}</div>
      {!isCheckout && <Footer />}
    </>
  )
}
