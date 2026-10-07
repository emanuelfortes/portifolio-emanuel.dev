import type { Metadata } from 'next'
import HeroHome from '@/demos/dr-erico/components/sections/HeroHome'

export const metadata: Metadata = {
  title: { absolute: 'Urologista em Fortaleza | Cirurgia Robótica e HoLEP' },
  description:
    'Dr. Érico Diógenes, urologista em Fortaleza especialista em Cirurgia Robótica, HoLEP e Uro-oncologia no Ceará. Tecnologia avançada. Agende sua consulta.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Dr. Érico Diógenes | Urologista em Fortaleza, Cirurgia Robótica e HoLEP',
    description:
      'Especialista em Cirurgia Robótica, HoLEP e tratamentos urológicos avançados em Fortaleza, CE.',
    url: '/',
  },
}
import VideoSection from '@/demos/dr-erico/components/sections/VideoSection'
import SobreDoutor from '@/demos/dr-erico/components/sections/SobreDoutor'
import Depoimentos from '@/demos/dr-erico/components/sections/Depoimentos'
import BlogPreview from '@/demos/dr-erico/components/sections/BlogPreview'
import CtaBanner from '@/demos/dr-erico/components/ui/CtaBanner'
import ContactMini from '@/demos/dr-erico/components/sections/ContactMini'
import TratamentosGrid from '@/demos/dr-erico/components/sections/TratamentosGrid'
import CirurgiaRoboticaHighlight from '@/demos/dr-erico/components/sections/CirurgiaRoboticaHighlight'
import LaserHighlight from '@/demos/dr-erico/components/sections/LaserHighlight'
import FaqHome from '@/demos/dr-erico/components/sections/FaqHome'
import { faqHome } from '@/demos/dr-erico/data/faq-home'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqHome.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function Home() {
  return (
    <>

      <HeroHome />
      <CirurgiaRoboticaHighlight />
      <TratamentosGrid />
      <LaserHighlight />
      <SobreDoutor />
      <Depoimentos />
      <VideoSection />
      <BlogPreview />
      <FaqHome />
      <CtaBanner />
      <ContactMini />
    </>
  )
}
