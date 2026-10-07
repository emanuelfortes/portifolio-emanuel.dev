import Link from "@/demos/cirurgia-mohs/lib/Link";
import Image from "next/image";
import { mainNav, siteConfig, doctorName, locaisMohs } from "@/demos/cirurgia-mohs/config/site";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";


/**
 * Rodapé (docs/HANDOFF.md §2.4): fundo navy com a logo branca, colunas de
 * links e a linha final. Os textos seguem o rodapé do home.md (copy v2):
 * identidade editorial, revisão médica, cobertura regional e aviso de não
 * atendimento; os dados do médico só aparecem com autoria nomeada.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const medico = doctorName();
  const crm = siteConfig.crm || "[CRM]";
  const rqe = siteConfig.rqe || "[RQE]";
  const links = [
    ...mainNav,
    { label: "Perguntas frequentes", href: "/perguntas-frequentes" },
    { label: "Sobre o portal", href: "/sobre" },
    { label: "Fale com a redação", href: "/contato" },
    { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  ];

  return (
    <footer className="border-t border-navy-600 bg-navy-900 text-navy-200" role="contentinfo">
      <Container className="grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image
            src="/demos/cirurgia-mohs/brand/logo-branca.webp"
            alt={`${siteConfig.marca}. ${siteConfig.tagline}`}
            width={924}
            height={281}
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-navy-300">{siteConfig.descricaoCurta}</p>
          <div className="mt-5 space-y-1 text-xs">
            {siteConfig.mostrarAutoria && (
              <p className="font-semibold text-paper">
                {medico} · Dermatologista · CRM {crm} · RQE {rqe}
              </p>
            )}
            <p className="font-semibold text-paper">Portal independente sobre câncer de pele e cirurgia de Mohs</p>
            <p>Conteúdo revisado por médico dermatologista com formação em cirurgia micrográfica de Mohs</p>
            <p className="text-navy-300">
              Cobertura: Ceará · Piauí · Maranhão · Rio Grande do Norte · Paraíba · Pernambuco
            </p>
          </div>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-4">
          <p className="eyebrow text-accent-500">Navegue</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {links.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-paper">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow text-accent-500">Onde fazer cirurgia de Mohs</p>
          <ul className="mt-3 space-y-1.5 text-xs">
            {locaisMohs.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-paper">
                  Cirurgia de Mohs: {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-navy-600">
        <Container className="flex flex-col gap-2 py-6 text-[11px] text-navy-300 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="uppercase tracking-[1px]">
            {siteConfig.mostrarAutoria
              ? `MOHS · ${medico} · CRM ${crm} · RQE ${rqe} · Fortaleza – CE`
              : "MOHS · Portal independente sobre câncer de pele e cirurgia de Mohs"}
          </p>
          <p className="md:text-right">
            © {year} {siteConfig.marca}. Este portal tem caráter educativo, não realiza atendimento médico e não
            substitui a consulta. Resultados variam de acordo com cada caso.
          </p>
        </Container>
      </div>
    </footer>
  );
}
