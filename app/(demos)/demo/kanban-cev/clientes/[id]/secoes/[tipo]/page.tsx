import SecaoPage from '@/demos/kanban-cev/pages/cliente-secao'

export default function Page({ params }: { params: { id: string; tipo: string } }) {
  return <SecaoPage params={params} />
}
