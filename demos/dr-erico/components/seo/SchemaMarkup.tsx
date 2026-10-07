/**
 * O original publica JSON-LD (MedicalWebPage, Physician etc.). Na réplica o
 * dado estruturado não tem função e apontaria para o domínio real, então os
 * componentes ficam com a mesma assinatura e não renderizam nada.
 */
type MedicalWebPageData = {
  name: string
  description: string
  url: string
  specialty?: string
}

export default function SchemaMarkup(_props: { webPage?: unknown }) {
  return null
}

export function MedicalWebPageSchema(_props: MedicalWebPageData) {
  return null
}
