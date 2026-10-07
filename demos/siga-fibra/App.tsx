'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Login } from './components/Login'
import { Sidebar } from './components/Sidebar'
import { Overview } from './pages/Overview'
import { ServerPage } from './pages/ServerPage'
import { TrafficPage } from './pages/TrafficPage'
import { ClicksPage } from './pages/ClicksPage'
import { EdgeRequestsPage } from './pages/EdgeRequestsPage'
import { IpAnalysisPage } from './pages/IpAnalysisPage'
import { CampanhaPage } from './pages/CampanhaPage'

type Page = 'overview' | 'campanha' | 'server' | 'traffic' | 'clicks' | 'edge' | 'ip-analysis'

export default function App() {
  // Réplica: o visitante já entra autenticado. "Sair" leva ao login real do
  // painel, que aqui aceita qualquer senha.
  const [authenticated, setAuthenticated] = useState(true)
  const [page, setPage] = useState<Page>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem('sf_auth')
    setAuthenticated(false)
  }

  const handlePageChange = (p: string) => {
    setPage(p as Page)
    setSidebarOpen(false)
  }

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />
  }

  const renderPage = () => {
    switch (page) {
      case 'overview': return <Overview />
      case 'campanha': return <CampanhaPage />
      case 'server':   return <ServerPage />
      case 'traffic':  return <TrafficPage />
      case 'clicks':   return <ClicksPage />
      case 'edge':        return <EdgeRequestsPage />
      case 'ip-analysis': return <IpAnalysisPage />
      default:            return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        active={page}
        onChange={handlePageChange}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <header
          className="flex items-center justify-between px-4 py-3 lg:hidden sticky top-0 z-10"
          style={{ background: '#060d0f', borderBottom: '1px solid rgba(39,202,163,0.15)' }}
        >
          <img src="/demos/siga-fibra/logosiga.png" alt="Siga Fibra" className="h-7 w-auto object-contain" />
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#27CAA3' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
