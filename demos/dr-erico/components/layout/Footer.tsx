import Link from '@/demos/dr-erico/lib/Link'
import { Instagram, Youtube } from '@/demos/dr-erico/lib/brand-icons'
import Logo from './Logo'
import { site } from '@/demos/dr-erico/data/site'

/** Documentos institucionais do site. O expediente entra aqui quando existir. */
const DOCUMENTOS = [
  { titulo: 'Política Editorial', href: '/politica-editorial' },
  { titulo: 'Política de Correções', href: '/politica-de-correcoes' },
  { titulo: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { titulo: 'Termos de Uso', href: '/termos-de-uso' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-6 mt-16">
      <div className="container-site grid md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1">
          <Logo variant="light" />
          {/*
            PLANO DE RECUPERAÇÃO · ITEM 9 · Registro profissional visível.
            O JSON-LD já declarava CRM e RQE, mas o número não aparecia em
            nenhum conteúdo visível do site. O Google pede que o dado
            estruturado reflita o que está na página, e os três concorrentes
            do top 4 exibem CRM e RQE. Valor vem de data/site.ts (fonte única).
          */}
          <p className="mt-5 text-sm text-white/80">{site.role}</p>
          <p className="mt-1 text-sm font-medium text-white/90">
            {site.crm} · {site.rqe}
          </p>
        </div>

        <div>
          <h4 className="font-display text-brand-gold text-lg mb-4">Quem Somos</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link href="/dr-erico-diogenes" className="hover:text-brand-gold">
                Dr. Érico Diógenes
              </Link>
            </li>
            <li>
              <Link href="/dr-erico-diogenes" className="hover:text-brand-gold">
                Certificações
              </Link>
            </li>
            {/*
              Chamava-se "Notícias do Blog" e apontava para /blog. O rótulo
              passou a colidir com a seção /noticias, que agora existe: o mesmo
              motivo que levou o título da página a voltar a ser "Blog".
            */}
            <li>
              <Link href="/blog" className="hover:text-brand-gold">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/noticias" className="hover:text-brand-gold">
                Notícias
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-brand-gold text-lg mb-4">Especialidades</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Acompanhamento Clínico em Urologia</li>
            <li>
              <Link href="/cirurgia-robotica" className="hover:text-brand-gold">
                Cirurgia Robótica
              </Link>
            </li>
            <li>
              <Link href="/holep" className="hover:text-brand-gold">
                Tratamento a Laser para Próstata
              </Link>
            </li>
            <li>Uro-oncologia</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-brand-gold text-lg mb-4">Agendamentos</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a
                href="https://wa.me/5585981781020"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold"
              >
                Agendar Consulta
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5585981781020"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold"
              >
                Agendar Cirurgia
              </a>
            </li>
            <li>
              <Link href="/contato" className="hover:text-brand-gold">
                Onde estamos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-brand-gold text-lg mb-4">
            Inscreva-se na nossa newsletter
          </h4>
          <div className="flex gap-3 mt-2">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/*
        Documentos institucionais na barra de baixo, não numa coluna nova.

        As cinco colunas acima agrupam o site por assunto: quem somos, o que
        fazemos, como agendar. Política de privacidade não é assunto do
        consultório, é documento do site, e é na barra inferior que as pessoas
        procuram por ela. Entrar numa das colunas deixaria a grade torta e
        misturaria duas coisas de natureza diferente.

        Vale pelo SEO também: o Google precisa alcançar essas páginas a partir
        de qualquer lugar, e o rodapé aparece em todas elas.
      */}
      <div className="container-site mt-12 pt-6 border-t border-white/10">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/60">
          {DOCUMENTOS.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="hover:text-brand-gold transition-colors">
                {d.titulo}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-white/60">
          Dr. Érico Diógenes © {new Date().getFullYear()} · Todos os Direitos Reservados
        </p>
      </div>
    </footer>
  )
}
