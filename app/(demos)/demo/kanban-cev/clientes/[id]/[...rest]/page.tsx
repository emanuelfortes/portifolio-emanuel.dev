import { redirect } from 'next/navigation'
import { to } from '@/demos/kanban-cev/lib/paths'

// Subpáginas que não existem voltam para o cliente (nunca 404).
export default function Page({ params }: { params: { id: string } }) {
  redirect(to(`/clientes/${params.id}`))
}
