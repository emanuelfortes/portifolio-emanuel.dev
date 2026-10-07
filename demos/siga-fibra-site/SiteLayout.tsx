import LayoutShell from '@/demos/siga-fibra-site/components/LayoutShell'
import AosInit from '@/demos/siga-fibra-site/components/AosInit'
import ThemeProvider from '@/demos/siga-fibra-site/components/ThemeProvider'

/**
 * Corpo do app/layout.tsx original, sem <html>/<body> (o layout raiz das
 * demos cuida disso) e sem Google Ads (gtag), Meta Pixel e o componente
 * Tracking, que mandava acessos e cliques para a API do cliente.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AosInit />
      <LayoutShell>{children}</LayoutShell>
    </ThemeProvider>
  )
}
