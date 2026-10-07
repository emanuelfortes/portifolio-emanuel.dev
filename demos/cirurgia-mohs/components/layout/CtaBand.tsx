import type { ButtonItem } from "@/demos/cirurgia-mohs/lib/content";
import { siteConfig, whatsappLink, phoneLink } from "@/demos/cirurgia-mohs/config/site";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import { ButtonGroup } from "@/demos/cirurgia-mohs/components/content/CtaBlock";
import Markdown from "@/demos/cirurgia-mohs/components/content/Markdown";

/** Faixa de conversão navy no fim da Home e do Blog (docs/HANDOFF.md §2.3). */
export default function CtaBand({ title, text, buttons }: { title?: string; text?: string; buttons?: ButtonItem[] }) {
  /* Sem `buttons`: WhatsApp e telefone. Lista vazia (ex.: "## Fecho" da home, só texto): sem botões. */
  const items: ButtonItem[] = buttons ?? [
        {
          label: "Falar no WhatsApp",
          href: whatsappLink(`Olá! Vim pelo site ${siteConfig.marca} e gostaria de agendar uma avaliação.`),
          kind: "whatsapp",
        },
        { label: "Ligar", href: phoneLink(), kind: "phone" },
      ];

  return (
    <section className="bg-navy text-paper" aria-label="Fale com o especialista">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <p className="font-display text-[22px] leading-snug md:text-[26px]">
            {title ?? "Recebeu um diagnóstico de câncer de pele ou quer uma segunda opinião?"}
          </p>
          {text && <Markdown md={text} className="mt-2 text-sm leading-relaxed text-navy-200 [&_a]:text-paper [&_a]:underline" />}
        </div>
        {items.length > 0 && <ButtonGroup items={items} dark className="shrink-0 md:flex-nowrap" />}
      </Container>
    </section>
  );
}
