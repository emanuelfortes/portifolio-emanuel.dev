import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { ContentPage, FaqItem, ImageSpec } from "@/demos/cirurgia-mohs/lib/content";
import { siteConfig } from "@/demos/cirurgia-mohs/config/site";
import Container from "@/demos/cirurgia-mohs/components/ui/Container";
import { ArrowIcon } from "@/demos/cirurgia-mohs/components/ui/Button";
import ImagePlaceholder from "@/demos/cirurgia-mohs/components/content/ImagePlaceholder";
import Faq from "@/demos/cirurgia-mohs/components/content/Faq";
import { images } from "@/demos/cirurgia-mohs/config/images";
import { CategoryEyebrow, TeaserColumn, postImage } from "@/demos/cirurgia-mohs/components/blog/Teasers";
import MargensInfografico from "./MargensInfografico";

/* Utilidades ---------------------------------------------------------------- */

function ColumnTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-2 text-[28px] leading-tight text-navy">
      {children}
    </h2>
  );
}

function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="action-link mt-5">
      {children} <ArrowIcon className="h-3.5 w-3.5" />
    </Link>
  );
}

/** Lista editorial: itens em display 17px (com descrição opcional); no celular cada item vira linha com seta teal. */
function EditorialList({ items }: { items: { title: string; href: string; description?: string }[] }) {
  return (
    <ul className="mt-4 font-display text-[17px] leading-[1.9] text-navy" role="list">
      {items.map((t) => (
        <li key={t.href} className={`border-b border-line md:border-0 ${t.description ? "py-1.5" : ""}`}>
          <Link href={t.href} className="flex items-center justify-between gap-4 hover:text-gold">
            <span>
              {t.title}
              {t.description && (
                <span className="block font-sans text-xs leading-snug text-ink-muted">{t.description}</span>
              )}
            </span>
            <ArrowIcon className="h-3.5 w-3.5 shrink-0 text-teal md:hidden" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* 3. Faixa de confiança ------------------------------------------------------ */

export function TrustBar({ overlap = false }: { overlap?: boolean }) {
  const items = [
    "Conteúdo revisado por médico dermatologista com formação em cirurgia micrográfica de Mohs",
    "Cobertura de seis estados: Ceará, Piauí, Maranhão, Rio Grande do Norte, Paraíba e Pernambuco",
    "Portal editorial independente: não somos clínica e não realizamos atendimento",
    "Fontes: diretrizes NCCN, critérios de uso apropriado da Mohs, SBD e INCA",
  ];
  /* Com foto no hero, a "folha" branca sobe por cima da base da imagem e projeta
     sombra sobre ela. Sem foto não há o que cobrir: a faixa encosta no navy, que
     fecha com o filete dourado do hero. */
  return (
    <section
      aria-label="Diferenciais do atendimento"
      className={`relative z-10 border-b border-navy bg-paper ${
        overlap ? "-mt-12 shadow-[0_-18px_40px_-10px_rgba(22,28,43,0.5)] md:-mt-20" : ""
      }`}
    >
      <Container className="py-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] font-medium text-navy md:grid-cols-4 md:gap-x-0" role="list">
          {items.map((t, i) => (
            <li
              key={t}
              className={`flex items-start gap-2 md:px-6 ${i === 0 ? "md:pl-0" : "md:border-l md:border-line"} ${
                i === items.length - 1 ? "md:pr-0" : ""
              }`}
            >
              <span className="text-teal" aria-hidden="true">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* 4. Três colunas editoriais -------------------------------------------------- */

/* Tópicos, estados e textos vêm de content/paginas/home.md (mantidos na íntegra). */
const topics = [
  { title: "O que é a cirurgia de Mohs", href: "/cirurgia-de-mohs", description: "A técnica com maior taxa de cura para os tumores de alto risco, explicada passo a passo." },
  { title: "Carcinoma basocelular", href: "/cancer-de-pele/carcinoma-basocelular", description: "O câncer de pele mais comum: o que é, se é grave e como tratar." },
  { title: "Carcinoma espinocelular", href: "/cancer-de-pele/carcinoma-espinocelular", description: "O segundo mais comum e quando exige mais atenção." },
  { title: "Melanoma", href: "/cancer-de-pele/melanoma", description: "Sinais, diagnóstico e o papel da cirurgia." },
  { title: "O plano de saúde cobre?", href: "/blog/plano-de-saude-cobre-cirurgia-de-mohs", description: "Rol da ANS, convênios e o que fazer em caso de negativa." },
  { title: "Pós-operatório", href: "/pos-operatorio", description: "O que esperar dia a dia, do curativo à cicatriz final." },
];

const states = [
  { name: "Ceará", cities: "Fortaleza", href: "/cirurgia-de-mohs-fortaleza" },
  { name: "Piauí", cities: "Teresina, Parnaíba, Picos, Floriano", href: "/cirurgia-de-mohs-nordeste/piaui" },
  { name: "Maranhão", cities: "São Luís, Imperatriz, Caxias, Timon", href: "/cirurgia-de-mohs-nordeste/maranhao" },
  { name: "Rio Grande do Norte", cities: "Natal, Mossoró, Caicó", href: "/cirurgia-de-mohs-nordeste/rio-grande-do-norte" },
  { name: "Paraíba", cities: "João Pessoa, Campina Grande, Patos, Sousa", href: "/cirurgia-de-mohs-nordeste/paraiba" },
  { name: "Pernambuco", cities: "Recife, Petrolina, Caruaru, Garanhuns", href: "/cirurgia-de-mohs-nordeste/pernambuco" },
];

export function EditorialColumns({ whyImage }: { whyImage?: ImageSpec }) {
  return (
    <section className="border-b border-navy" aria-label="Comece por aqui">
      <Container className="grid md:grid-cols-3">
        <div className="py-8 max-md:border-b max-md:border-line md:border-r md:border-line md:py-12 md:pr-8" data-aos="fade-up">
          <p className="eyebrow">Comece por aqui</p>
          <ColumnTitle id="diagnostico">Recebeu um diagnóstico?</ColumnTitle>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            O câncer de pele é o tipo mais comum de câncer no Brasil e, na grande maioria dos casos, tem tratamento com
            cura. O que muda o resultado é entender o diagnóstico e escolher o tratamento certo, no lugar certo, na
            primeira vez. Comece por aqui:
          </p>
          <EditorialList items={topics} />
        </div>

        <div className="py-8 max-md:border-b max-md:border-line md:border-r md:border-line md:px-8 md:py-12" data-aos="fade-up">
          <p className="eyebrow">A diferença está nas margens</p>
          <ColumnTitle id="por-que-mohs">Por que a cirurgia de Mohs?</ColumnTitle>
          {/* O espaço home-02 é desenho, não foto: vem do MargensInfografico. */}
          <div className="mt-4">
            <MargensInfografico alt={whyImage?.alt} />
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
            Na cirurgia convencional, o laboratório examina cerca de 1% da margem do tumor removido. Na cirurgia de
            Mohs, o próprio cirurgião examina praticamente 100% das margens ao microscópio, no mesmo dia, e só
            reconstrói a ferida quando tem certeza de que o tumor foi todo retirado. O resultado é a maior taxa de cura
            descrita na literatura para o câncer de pele não melanoma, com a menor retirada de pele saudável. Nem todo
            tumor precisa de Mohs, e entender quando ela faz diferença é o primeiro passo.{" "}
            <Link href="/cirurgia-de-mohs" className="action-link">
              Entenda <ArrowIcon className="h-3 w-3" />
            </Link>
          </p>
        </div>

        <div className="py-8 md:py-12 md:pl-8" data-aos="fade-up">
          <p className="eyebrow">Onde fazer</p>
          <ColumnTitle id="nordeste">Onde fazer cirurgia de Mohs no Nordeste</ColumnTitle>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            A cirurgia de Mohs exige cirurgião com formação específica e laboratório anexo, o que faz com que existam
            poucos serviços na região, concentrados em Fortaleza e Recife. Fortaleza, com cirurgiões formados em centros
            de referência, é a referência mais próxima para o Piauí, o Maranhão e o interior do Ceará; Recife atende
            sobretudo a Paraíba e parte do Rio Grande do Norte. Veja a situação do seu estado, as distâncias e o que
            perguntar antes de escolher um serviço:
          </p>
          <ul className="mt-4 text-[13px] leading-[2]" role="list">
            {states.map((s) => (
              <li key={s.href} className="border-b border-line">
                <Link href={s.href} className="group flex items-baseline justify-between gap-4">
                  <span className="font-medium text-navy group-hover:text-gold">{s.name}</span>
                  <span className="text-right text-muted">{s.cities}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ActionLink href="/cirurgia-de-mohs-nordeste">Ver o panorama de todo o Nordeste</ActionLink>
        </div>
      </Container>
    </section>
  );
}

/* 5. Últimos artigos ---------------------------------------------------------- */

/** Capa mais larga que alta: a chamada em destaque mostra a foto inteira, empilhada sobre o texto. */
function isWideCover(image: ImageSpec) {
  const asset = images[image.id];
  return !!asset && asset.width > asset.height;
}

export function LatestArticles({ posts }: { posts: ContentPage[] }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;
  const cover = postImage(featured);
  const wide = isWideCover(cover);
  return (
    <section className="bg-navy text-paper" aria-labelledby="ultimos-artigos">
      <Container className="py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="ultimos-artigos" className="text-[28px] leading-tight text-paper md:text-[34px]">
            Últimos artigos
          </h2>
          <Link href="/blog" className="action-link text-accent-500">
            Ver todos os artigos <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <article className="md:border-r md:border-paper/30 md:pr-8" data-aos="fade-up">
            <div className={`grid gap-5 ${wide ? "" : "md:grid-cols-2 md:gap-6"}`}>
              <Link href={featured.slug} tabIndex={-1} aria-hidden="true" className="block">
                <ImagePlaceholder
                  image={cover}
                  ratio={wide ? "auto" : "4/5"}
                  frame
                  tone="dark"
                  className={wide ? "" : "max-md:aspect-[16/10]"}
                  sizes={wide ? "(min-width: 768px) 520px, 100vw" : "(min-width: 768px) 260px, 100vw"}
                />
              </Link>
              <div>
                <CategoryEyebrow post={featured} className="text-accent-500" />
                <h3 className={`mt-2 leading-tight text-paper ${wide ? "text-balance text-[28px]" : "text-[26px]"}`}>
                  <Link href={featured.slug} className="hover:text-accent-500">
                    {featured.fm.h1}
                  </Link>
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-navy-200">{featured.fm.description}</p>
                <p className="mt-3 text-[11px] text-navy-300">{featured.readingTime} min de leitura</p>
              </div>
            </div>
          </article>
          {rest.slice(0, 2).map((p) => (
            <TeaserColumn key={p.slug} post={p} ratio="4/3" thumb={72} titleClass="text-lg" showSummary dark />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* 6. Três colunas de apoio ---------------------------------------------------- */

const doctorLinks = [
  { title: "Quando encaminhar para Mohs", href: "/para-medicos/quando-encaminhar" },
  { title: "Como encaminhar um paciente", href: "/para-medicos/como-encaminhar" },
  { title: "Carcinoma basocelular de alto risco", href: "/para-medicos/cbc-alto-risco" },
];

export function SupportColumns({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="border-b border-navy" aria-label="Para médicos, sobre o portal e perguntas frequentes">
      <Container className="grid gap-10 py-12 md:grid-cols-3 md:gap-12">
        <div data-aos="fade-up">
          <p className="eyebrow">Área médica</p>
          <h2 className="mt-2 text-[22px] leading-tight text-navy">Para médicos</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            Dermatologistas, cirurgiões, oncologistas e clínicos: critérios objetivos de indicação de Mohs (AUC 2012 e
            NCCN), estratificação de risco do carcinoma basocelular e espinocelular, evidências comparativas e o que um
            bom fluxo de encaminhamento deve conter.
          </p>
          <EditorialList items={doctorLinks} />
          <ActionLink href="/para-medicos">Acessar a área médica</ActionLink>
        </div>
        <div data-aos="fade-up">
          <p className="eyebrow">Quem somos</p>
          <h2 className="mt-2 text-[22px] leading-tight text-navy">Sobre o portal</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            O {siteConfig.marca} é um portal editorial independente. Não somos uma clínica, não pertencemos a um médico
            e não realizamos atendimento. O conteúdo é produzido pela equipe editorial a partir de diretrizes e estudos
            publicados, revisado por médico dermatologista com formação em cirurgia de Mohs, e em alguns conteúdos
            indicamos médicos e serviços que realizam a técnica, segundo critérios publicados.
          </p>
          <ActionLink href="/sobre">Conheça a política editorial</ActionLink>
        </div>
        <div data-aos="fade-up">
          <p className="eyebrow">Dúvidas comuns</p>
          <h2 className="mt-2 text-[22px] leading-tight text-navy">Perguntas frequentes</h2>
          {/* As respostas abrem aqui mesmo; a página de FAQ fica para quem quer mais. */}
          <Faq items={faqs} compact />
          <ActionLink href="/perguntas-frequentes">Ver todas as perguntas</ActionLink>
        </div>
      </Container>
    </section>
  );
}
