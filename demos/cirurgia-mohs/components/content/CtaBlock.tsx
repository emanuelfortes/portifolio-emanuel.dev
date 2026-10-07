import type { ButtonItem, CtaBlock as CtaData } from "@/demos/cirurgia-mohs/lib/content";
import Button, { ArrowIcon, PhoneIcon, WhatsAppIcon } from "@/demos/cirurgia-mohs/components/ui/Button";
import Markdown from "./Markdown";
import { formatPhone } from "@/demos/cirurgia-mohs/lib/format";

/** Grupo de botões de conversão; `dark` troca o contorno do telefone/e-mail para fundos navy. */
export function ButtonGroup({
  items,
  className = "",
  dark = false,
}: {
  items: ButtonItem[];
  className?: string;
  dark?: boolean;
}) {
  const outline = dark ? "outline-light" : "secondary";
  return (
    <div className={`not-prose flex flex-wrap gap-2.5 ${className}`}>
      {items.map((b, i) => {
        if (b.kind === "whatsapp") {
          const track = b.label.includes("profissional") ? "click_whatsapp_medico" : "click_whatsapp";
          return (
            <Button key={i} href={b.href} variant="whatsapp" data-track={track}>
              <WhatsAppIcon /> {b.label}
            </Button>
          );
        }
        if (b.kind === "phone") {
          const digits = b.href.replace(/\D/g, "").replace(/^55/, "");
          return (
            <Button key={i} href={b.href} variant={outline} data-track="click_telefone">
              <PhoneIcon /> Ligar {/^\d+$/.test(digits) ? formatPhone(digits) : "[TELEFONE]"}
            </Button>
          );
        }
        if (b.kind === "email") {
          return (
            <Button key={i} href={b.href} variant={outline}>
              {b.label}
            </Button>
          );
        }
        return (
          <Button key={i} href={b.href} variant="primary">
            {b.label} <ArrowIcon />
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Bloco fixo de conversão (seção 6 da estratégia).
 * variant "paciente" = fundo navy; "medico" = fundo claro com borda.
 */
export default function CtaBlock({
  cta,
  variant = "paciente",
  compact = false,
}: {
  cta: CtaData;
  variant?: "paciente" | "medico";
  compact?: boolean;
}) {
  const dark = variant === "paciente";
  return (
    <aside
      aria-label="Fale com o especialista"
      data-aos="fade-up"
      className={`not-prose my-12 overflow-hidden rounded-3xl ${
        dark ? "bg-navy-800 text-paper" : "border border-navy-200 bg-navy-50 text-navy-800"
      } ${compact ? "p-6 sm:p-8" : "p-8 sm:p-12"}`}
    >
      <div className="max-w-3xl">
        <p className={`font-display leading-tight ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
          {cta.title}
        </p>
        {cta.text && (
          <Markdown
            md={cta.text}
            className={`mt-3 text-base leading-relaxed ${dark ? "text-navy-200 [&_a]:text-paper" : "text-navy-700"}`}
          />
        )}
        <ButtonGroup items={cta.buttons} className="mt-6 justify-center" dark={dark} />
        {cta.note && (
          <Markdown
            md={cta.note}
            className={`mt-5 text-sm italic ${dark ? "text-navy-300 [&_a]:text-paper [&_a]:underline" : "text-ink-muted [&_a]:underline"}`}
          />
        )}
      </div>
    </aside>
  );
}
