import Image from 'next/image'
import Link from '@/demos/dr-erico/lib/Link'
import { site } from '@/demos/dr-erico/data/site'

interface Props {
  sidebar?: boolean
}

export default function AuthorCard({ sidebar = false }: Props) {
  if (sidebar) {
    return (
      <div className="bg-brand-beige-light rounded-2xl p-5">
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-full overflow-hidden relative shadow-card mb-3">
            <Image unoptimized
              src="/demos/dr-erico/img/dr-erico-foto-3.webp"
              alt="Dr. Érico Diógenes, Urologista em Fortaleza"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold mb-1">
            Autor
          </p>
          <h3 className="font-display text-lg text-brand-navy leading-tight">
            Dr. Érico Diógenes
          </h3>
          <p className="text-xs font-medium text-brand-muted mt-0.5">
            Urologista em Fortaleza
          </p>
          <p className="text-xs text-brand-muted mt-1 opacity-75">{site.crm} · {site.rqe}</p>

          <p className="text-xs text-brand-muted mt-3 leading-relaxed text-left">
            Urologista especialista em cirurgia robótica, HoLEP e uro-oncologia. Referência no
            Ceará em tratamentos minimamente invasivos para próstata e saúde masculina.
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
            {['Urologista', 'Cirurgia Robótica', 'HoLEP', 'Próstata', 'Fortaleza'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-white text-brand-navy border border-brand-beige rounded-full px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/dr-erico-diogenes"
            className="mt-4 text-xs text-brand-gold hover:underline font-medium"
          >
            Conheça o Dr. Érico →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-14 pt-10 border-t border-brand-beige">
      <div className="flex flex-col sm:flex-row gap-6 items-start bg-brand-beige-light rounded-2xl p-6 md:p-8">
        <div className="shrink-0">
          <div className="w-44 h-44 rounded-full overflow-hidden relative shadow-card">
            <Image unoptimized
              src="/demos/dr-erico/img/dr-erico-foto-3.webp"
              alt="Dr. Érico Diógenes, Urologista em Fortaleza"
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">
            Autor
          </p>
          <h3 className="font-display text-xl text-brand-navy leading-tight">
            Dr. Érico Diógenes
          </h3>
          <p className="text-sm font-medium text-brand-muted mt-0.5">
            Urologista em Fortaleza, {site.crm} · {site.rqe}
          </p>

          <p className="text-sm text-brand-muted mt-3 leading-relaxed">
            Urologista especialista em cirurgia robótica, HoLEP e uro-oncologia. Formado pela
            Universidade Federal do Ceará, com doutorado pela USP e fellowship no Hospital
            Sírio-Libanês. Referência no Ceará em tratamentos minimamente invasivos para próstata,
            câncer urológico e saúde masculina.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {[
              'Urologista',
              'Cirurgia Robótica',
              'HoLEP',
              'Uro-oncologia',
              'Próstata',
              'Fortaleza',
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white text-brand-navy border border-brand-beige rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/dr-erico-diogenes"
            className="inline-block mt-4 text-sm text-brand-gold hover:underline font-medium"
          >
            Conheça o Dr. Érico →
          </Link>
        </div>
      </div>
    </div>
  )
}
