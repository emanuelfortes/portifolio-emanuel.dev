import { site } from '@/demos/dr-erico/data/site'

export default function ContactMini() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-site" data-aos="fade-up">
        <h2 className="font-display text-3xl md:text-4xl text-brand-navy mb-8">Onde nos encontrar</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {site.locations.map((loc) => (
            <div
              key={loc.name}
              className="rounded-2xl border border-brand-beige bg-brand-beige-light p-6"
            >
              <h3 className="font-display text-xl text-brand-navy">{loc.name}</h3>
              <p className="text-brand-muted mt-2 text-sm leading-relaxed">
                {loc.street}
                <br />
                {loc.district}, {loc.city}
              </p>
              {loc.hours ? (
                <p className="text-brand-muted mt-3 text-sm">{loc.hours}</p>
              ) : null}
              {loc.phone ? (
                <p className="text-brand-muted mt-2 text-sm">{loc.phone}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
