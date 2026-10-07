'use client'

import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'
import HeroBanner, { BannerSlide } from '@/demos/siga-fibra-site/components/shared/HeroBanner'
import QuickLinksEmpresa from '@/demos/siga-fibra-site/components/empresa/QuickLinksEmpresa'
import ChipMovelEmpresaSection from '@/demos/siga-fibra-site/components/empresa/ChipMovelEmpresaSection'
import FixoEmpresaHomeSection from '@/demos/siga-fibra-site/components/empresa/FixoEmpresaHomeSection'
import CtaBannerEmpresa from '@/demos/siga-fibra-site/components/empresa/CtaBannerEmpresa'
export default function EmpresaHome() {
  const router = useRouter()

  const slides: BannerSlide[] = [
    {
      image: '/demos/siga-fibra-site/img/banners/lantolan.webp',
      imageMobile: '/demos/siga-fibra-site/img/banners/lantolan-mobile.webp',
      imageAlt: 'LAN to LAN Empresarial',
      onClick: () => router.push('/empresa/internet/lan-to-lan'),
    },
    {
      image: '/demos/siga-fibra-site/img/banners/linkdedicado.webp',
      imageMobile: '/demos/siga-fibra-site/img/banners/linkdedicado-mobile.webp',
      imageAlt: 'Link Dedicado Empresarial',
      onClick: () => router.push('/empresa/internet/link-dedicado'),
    },
  ]

  return (
    <div className="font-sans">
      <HeroBanner slides={slides} accentColor="#03C2C3" autoPlayInterval={6000} showArrows={false} aspectRatio="19/4" aspectRatioMobile="4/5" />
      <QuickLinksEmpresa />
      <ChipMovelEmpresaSection />
      <FixoEmpresaHomeSection />
      <CtaBannerEmpresa />
    </div>
  )
}
