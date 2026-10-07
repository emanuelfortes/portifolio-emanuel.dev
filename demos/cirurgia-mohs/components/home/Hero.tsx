import Image from "next/image";
import type { ImageSpec } from "@/demos/cirurgia-mohs/lib/content";
import { images, type ImageAsset } from "@/demos/cirurgia-mohs/config/images";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import Button, { ArrowIcon } from "@/demos/cirurgia-mohs/components/ui/Button";

const heroBox = "overflow-hidden rounded-t-[14px] max-md:aspect-[4/3] md:rounded-t-2xl";

/** Fotos do hero já disponíveis: "home-01" e, para a transição suave, "home-01-b". */
export function heroFrames(image?: ImageSpec): ImageAsset[] {
  if (!image) return [];
  return [images[image.id], images[`${image.id}-b`]].filter((a): a is ImageAsset => Boolean(a));
}

/**
 * Foto panorâmica do hero, com transição suave entre as duas fotos quando a
 * segunda existir. A seção seguinte sobe por cima da base (ver TrustBar).
 */
function HeroPhotos({ frames, alt }: { frames: ImageAsset[]; alt: string }) {
  return (
    <div className={`relative aspect-[21/9] ${heroBox}`}>
      {frames.map((f, i) => (
        <Image
          key={f.src}
          src={f.src}
          alt={i === 0 ? alt : ""}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 960px, 100vw"
          className={`object-cover ${i === 1 ? "hero-crossfade" : ""}`}
        />
      ))}
    </div>
  );
}

/**
 * Hero centrado da home (docs/HANDOFF.md §3.2): eyebrow, H1, parágrafo, botões
 * e, quando a foto panorâmica existir, a imagem encostada na base. Enquanto não
 * houver foto registrada, o hero fica só com texto (sem espaço reservado), com
 * respiro extra embaixo para a faixa de confiança subir sobre o navy.
 *
 * Existindo a imagem "home-fundo", ela entra como fundo sob a película navy, do
 * mesmo jeito que nos cabeçalhos das páginas internas: a foto não mexe na altura
 * nem na posição de nada — quem manda continua sendo o texto. Havendo também
 * "home-fundo-b" e "home-fundo-c", as três se alternam em transição lenta.
 *
 * O recorte muda por tamanho de tela: no computador a foto aparece inteira e
 * centrada; no celular o site mostra só uma fatia vertical de ~39% dela, e o
 * centro destas fotos é a parte vazia — por isso ali a imagem ancora à direita,
 * onde estão os instrumentos.
 */
export default function Hero({ h1, image }: { h1: string; image?: ImageSpec }) {
  const frames = heroFrames(image);
  /* Fotos do fundo, na ordem em que entram. Só a primeira é pré-carregada. */
  const fundos = ["home-fundo", "home-fundo-b", "home-fundo-c"]
    .map((id) => images[id])
    .filter((a): a is ImageAsset => Boolean(a));
  return (
    <section
      className={`relative isolate overflow-hidden bg-navy text-paper ${frames.length ? "" : "border-b-2 border-gold"}`}
      aria-labelledby="hero-title"
    >
      {fundos.length > 0 && (
        <>
          {fundos.map((f, i) => (
            <Image
              key={f.src}
              src={f.src}
              alt=""
              aria-hidden
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className={`-z-20 object-cover object-right md:object-center ${i > 0 ? "hero-fundo" : ""}`}
              style={i === 2 ? { animationDelay: "6s" } : undefined}
            />
          ))}
          {/* 70%, não os 85% das páginas internas: estas fotos são escuras de origem
              e, com película mais densa, o navy chapado engolia os instrumentos. No
              celular, +5% para compensar o recorte à direita, que é mais claro. */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-navy/75 md:bg-navy/70" />
        </>
      )}
      <Container className={`relative pt-14 text-center md:pt-[88px] ${frames.length ? "" : "pb-24 md:pb-36"}`}>
        <p className="hero-rise eyebrow text-accent-500">Portal independente · Câncer de pele · Cirurgia micrográfica de Mohs</p>
        <h1 id="hero-title" style={{ animationDelay: "120ms" }} className="hero-rise mx-auto mt-5 max-w-[880px] text-balance text-4xl leading-[1.06] md:text-[64px]">
          {h1}
        </h1>
        {/* 15px no celular: ao lado de um H1 de 36px, o parágrafo em 18px pesava
            mais que o título. No desktop o H1 vai a 64px e os 18px voltam. */}
        <p style={{ animationDelay: "260ms" }} className="hero-rise mx-auto mt-6 max-w-[640px] text-[15px] leading-relaxed text-navy-200 md:text-lg">
          Um portal de conteúdo independente sobre diagnóstico, tratamento e recuperação do câncer de pele, com foco na
          cirurgia micrográfica de Mohs. Guias em linguagem clara para quem recebeu um diagnóstico, conteúdo técnico
          para o médico que precisa encaminhar e a situação da cirurgia em cada estado do Nordeste. Revisado por
          médico. Sem atendimento, sem promessas.
        </p>
        <div style={{ animationDelay: "400ms" }} className="hero-rise mx-auto mt-8 flex max-w-md justify-center sm:max-w-none">
          <Button href="/cirurgia-de-mohs" variant="primary">
            Entender a cirurgia de Mohs <ArrowIcon />
          </Button>
        </div>
        <p style={{ animationDelay: "520ms" }} className="hero-rise mx-auto mt-6 max-w-[640px] text-[13px] font-semibold tracking-wide text-navy-200">
          Conteúdo revisado por médico dermatologista com formação em cirurgia de Mohs · Este portal não realiza
          atendimento
        </p>
        {frames.length > 0 && (
          <div className="mx-auto mt-12 max-w-[960px] md:mt-16">
            <HeroPhotos frames={frames} alt={image?.alt ?? ""} />
          </div>
        )}
      </Container>
    </section>
  );
}
