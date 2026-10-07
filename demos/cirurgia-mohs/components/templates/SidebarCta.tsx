import Link from "@/demos/cirurgia-mohs/lib/Link";
import { siteConfig, whatsappLink, phoneLink } from "@/demos/cirurgia-mohs/config/site";
import Button, { PhoneIcon, WhatsAppIcon } from "@/demos/cirurgia-mohs/components/ui/Button";

/** Card lateral de conversão, discreto, com mensagem pré-preenchida por tema. */
export default function SidebarCta({ topic, variant = "paciente" }: { topic: string; variant?: "paciente" | "medico" }) {
  const medico = siteConfig.nomeMedico || "[NOME DO MÉDICO]";

  if (variant === "medico") {
    const wa = `https://wa.me/55${siteConfig.whatsappProfissional || siteConfig.whatsapp || "[WHATSAPP PROFISSIONAL]"}?text=${encodeURIComponent(
      "Olá, sou médico(a) e gostaria de encaminhar um paciente para avaliação de cirurgia de Mohs.",
    )}`;
    return (
      <div className="rounded-2xl border border-navy-200 bg-navy-50 p-5" data-aos="fade-up">
        <p className="font-display text-xl leading-snug text-navy-800">Tem um paciente com indicação de Mohs?</p>
        <p className="mt-2 text-sm leading-relaxed text-navy-700">
          Canal direto para encaminhamento profissional. Retorno com laudo e relatório cirúrgico para o médico assistente.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button href={wa} variant="whatsapp" data-track="click_whatsapp_medico">
            <WhatsAppIcon /> WhatsApp profissional
          </Button>
          {siteConfig.email && (
            <Button href={`mailto:${siteConfig.email}`} variant="secondary">
              Enviar e-mail
            </Button>
          )}
          <Link href="/para-medicos/como-encaminhar" className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-navy-700 underline-offset-2 hover:underline">
            Como encaminhar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-navy-800 p-5 text-paper" data-aos="fade-up">
      <p className="font-display text-xl leading-snug">Recebeu um diagnóstico de câncer de pele?</p>
      {siteConfig.mostrarAutoria && (
        <p className="mt-2 text-sm leading-relaxed text-navy-200">
          {medico}, cirurgião de Mohs em Fortaleza, atende pacientes de todo o Ceará e estados vizinhos.
        </p>
      )}
      <div className="mt-4 flex flex-col gap-2">
        <Button
          href={whatsappLink(`Olá! Li sobre ${topic} no site ${siteConfig.marca} e gostaria de agendar uma avaliação.`)}
          variant="whatsapp"
          data-track="click_whatsapp"
        >
          <WhatsAppIcon /> Falar no WhatsApp
        </Button>
        <Button href={phoneLink()} variant="outline-light" data-track="click_telefone">
          <PhoneIcon /> Ligar
        </Button>
      </div>
      <p className="mt-4 text-xs text-navy-300">
        Atendimento particular e por convênios.{" "}
        <Link href="/cirurgia-de-mohs-nordeste" className="underline underline-offset-2 hover:text-paper">
          Pacientes de outros estados
        </Link>
      </p>
    </div>
  );
}
