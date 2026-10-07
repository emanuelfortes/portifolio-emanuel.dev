import CheckoutFlow from '@/demos/siga-fibra-site/components/checkout/CheckoutFlow'
import { CAMPANHA } from '@/demos/siga-fibra-site/lib/plans'

const precoFmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

export const metadata = {
  title: `Promoção ${CAMPANHA.name} · Siga Fibra`,
  description: `${CAMPANHA.speed} ${CAMPANHA.unit} de hipervelocidade + 1 streaming à sua escolha por ${precoFmt(CAMPANHA.price)}/mês durante ${CAMPANHA.months} meses.`,
}

export default function CheckoutCampanhaPage() {
  return <CheckoutFlow planId={CAMPANHA.planId} campanha />
}
