import HomeBanner from '@/demos/siga-fibra-site/components/home/HomeBanner'
import QuickLinksSection from '@/demos/siga-fibra-site/components/home/QuickLinksSection'
import PlanosInternetSection from '@/demos/siga-fibra-site/components/home/PlanosInternetSection'
import StreamingSection from '@/demos/siga-fibra-site/components/home/StreamingSection'
import AppEcosystemSection from '@/demos/siga-fibra-site/components/home/AppEcosystemSection'
import AmigoIndicaSection from '@/demos/siga-fibra-site/components/home/AmigoIndicaSection'
import ChipMovelSection from '@/demos/siga-fibra-site/components/home/ChipMovelSection'
import FixoHomeSection from '@/demos/siga-fibra-site/components/home/FixoHomeSection'
import CtaBanner from '@/demos/siga-fibra-site/components/home/CtaBanner'

export default function PFHome() {
  return (
    <div className="font-sans">
      <HomeBanner />
      <QuickLinksSection />
      <PlanosInternetSection />
      <StreamingSection />
      <AppEcosystemSection />
      <AmigoIndicaSection />
      <ChipMovelSection />
      <FixoHomeSection />
      <CtaBanner />
    </div>
  )
}
