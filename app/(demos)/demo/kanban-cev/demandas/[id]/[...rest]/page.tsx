import { redirect } from 'next/navigation'
import { to } from '@/demos/kanban-cev/lib/paths'

// Subpáginas que não existem voltam para a demanda (nunca 404).
export default function Page({ params }: { params: { id: string } }) {
  redirect(to(`/demandas/${params.id}`))
}
