import { redirect } from 'next/navigation'
import { BASE } from '@/demos/kanban-cev/lib/paths'

// Telas do original que não foram portadas (/offline e afins) voltam para a Home (nunca 404).
export default function Page() {
  redirect(BASE)
}
