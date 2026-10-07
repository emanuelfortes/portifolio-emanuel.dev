import HeroInternetFibra from '@/demos/siga-fibra-site/components/internet-fibra/HeroInternetFibra'
import PlanosInternetSection from '@/demos/siga-fibra-site/components/home/PlanosInternetSection'
import DiferenciaisInternetFibra from '@/demos/siga-fibra-site/components/internet-fibra/DiferenciaisInternetFibra'

export default function InternetFibra() {
  return (
    <div className="font-sans">
      <HeroInternetFibra />
      <div id="planos">
        <PlanosInternetSection />
      </div>
      <DiferenciaisInternetFibra />
    </div>
  )
}
