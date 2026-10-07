import ClientePage from '@/demos/kanban-cev/pages/cliente'

export default function Page({ params }: { params: { id: string } }) {
  return <ClientePage params={params} />
}
