import DemandaPage from '@/demos/kanban-cev/pages/demanda'

export default function Page({ params }: { params: { id: string } }) {
  return <DemandaPage params={params} />
}
