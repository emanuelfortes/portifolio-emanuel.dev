import CheckoutFlow from '@/demos/siga-fibra-site/components/checkout/CheckoutFlow'

/* No original (Next 15) searchParams é uma Promise; no Next 14 do portfólio
   chega como objeto. O resto da página é o mesmo. */
export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string; addon?: string }
}) {
  const { plan, addon } = searchParams
  return <CheckoutFlow planId={plan} preAddonId={addon} />
}
