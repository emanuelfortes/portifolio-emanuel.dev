import TopBar from '@/demos/dr-erico/components/layout/TopBar'
import Navbar from '@/demos/dr-erico/components/layout/Navbar'
import Footer from '@/demos/dr-erico/components/layout/Footer'
import FloatingWhatsapp from '@/demos/dr-erico/components/layout/FloatingWhatsapp'
import AosProvider from '@/demos/dr-erico/components/layout/AosProvider'
import ScrollToTop from '@/demos/dr-erico/components/layout/ScrollToTop'

/**
 * Corpo do app/layout.tsx original, sem <html>/<body> (o layout raiz das
 * demos cuida disso) e sem GTM, GA4, Meta Pixel, JSON-LD e feed RSS.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AosProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsapp />
      </div>
    </AosProvider>
  )
}
