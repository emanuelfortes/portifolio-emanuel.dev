import Link from '@/demos/dr-erico/lib/Link'

type Props = {
  title: string
  breadcrumb?: string
  align?: 'left' | 'center'
}

export default function PageHeader({ title, breadcrumb, align = 'left' }: Props) {
  return (
    <section className="bg-brand-beige py-14 md:py-20 relative overflow-hidden">
      <div className={`container-site ${align === 'center' ? 'text-center' : ''}`}>
        <div className="text-sm text-brand-muted" data-aos="fade-up">
          <Link href="/" className="hover:text-brand-gold">
            Home
          </Link>
          {breadcrumb && <span> / {breadcrumb}</span>}
        </div>
        <h1
          className="font-display text-4xl md:text-5xl text-brand-navy mt-3 leading-tight"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {title}
        </h1>
      </div>
    </section>
  )
}
