import Link from '@/demos/dr-erico/lib/Link'

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center py-20 bg-brand-beige-light">
      <div className="container-site text-center" data-aos="fade-up">
        <p className="font-display text-7xl md:text-9xl text-brand-gold">404</p>
        <h1 className="section-title mt-4">Página não encontrada</h1>
        <p className="mt-4 text-brand-muted max-w-md mx-auto">
          O conteúdo que você tentou acessar não existe ou foi movido.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Voltar para o início
        </Link>
      </div>
    </section>
  )
}
