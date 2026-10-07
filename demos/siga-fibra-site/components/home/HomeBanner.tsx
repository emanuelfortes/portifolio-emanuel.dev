'use client'

import { useRouter } from '@/demos/siga-fibra-site/lib/navigation'
import HeroBanner, { BannerSlide } from '@/demos/siga-fibra-site/components/shared/HeroBanner'
import { CAMPANHA, CAMPANHA_CHECKOUT_URL } from '@/demos/siga-fibra-site/lib/plans'

export default function HomeBanner() {
  const router = useRouter()

  const slides: BannerSlide[] = [
    { image: '/demos/siga-fibra-site/img/banners/mesdascriancas.webp', imageMobile: '/demos/siga-fibra-site/img/banners/mesdascriancas-mobile.webp', imageAlt: CAMPANHA.name,    onClick: () => router.push(CAMPANHA_CHECKOUT_URL)          },
    { image: '/demos/siga-fibra-site/img/banners/amigoindica.webp',    imageMobile: '/demos/siga-fibra-site/img/banners/amigoindica-mobile.webp',    imageAlt: 'Amigo Indica',   onClick: () => router.push('/pessoa-fisica/amigo-indica')   },
    { image: '/demos/siga-fibra-site/img/banners/internetfibra.webp',  imageMobile: '/demos/siga-fibra-site/img/banners/internetfibra-mobile.webp',  imageAlt: 'Internet Fibra', onClick: () => router.push('/pessoa-fisica/internet-fibra') },
  ]

  return (
    <HeroBanner slides={slides} accentColor="#27CAA3" autoPlayInterval={6000} showArrows={false} aspectRatio="19/4" aspectRatioMobile="4/5" />
  )
}
