import type { Metadata } from 'next'
import LoginPage from '@/demos/kanban-cev/pages/login'

export const metadata: Metadata = { title: 'Entrar · Time de Águias' }

export default function Page() {
  return <LoginPage />
}
