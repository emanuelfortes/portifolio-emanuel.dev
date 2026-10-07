import type { Metadata } from "next";
import { getPage, getBlogPosts } from "@/demos/cirurgia-mohs/lib/content";
import { metadataFor } from "@/demos/cirurgia-mohs/lib/seo";
import Hero, { heroFrames } from "@/demos/cirurgia-mohs/components/home/Hero";
import CtaBand from "@/demos/cirurgia-mohs/components/layout/CtaBand";
import { TrustBar, EditorialColumns, LatestArticles, SupportColumns } from "@/demos/cirurgia-mohs/components/home/Sections";

/**
 * Home do portal, no layout editorial de docs/HANDOFF.md §3: hero centrado,
 * faixa de confiança, três colunas, últimos artigos, colunas de apoio e faixa
 * CTA. As imagens e o CTA final vêm de content/paginas/home.md (o JSON-LD
 * MedicalBusiness + WebSite do original fica de fora da réplica).
 */

const home = () => getPage("/")!;

export const metadata: Metadata = metadataFor(home());

/* As 5 perguntas do home.md, ligadas às respostas na página de FAQ. */
const HOME_QUESTIONS = [
  /^A cirurgia de Mohs dói\?/i,
  /^Quanto tempo dura a cirurgia de Mohs\?/i,
  /^O plano de saúde cobre a cirurgia de Mohs\?/i,
  /^Moro em outro estado\./i,
  /^Carcinoma basocelular é grave\?/i,
];

export default function HomePage() {
  const page = home();
  const faqPage = getPage("/perguntas-frequentes");
  const faqs = HOME_QUESTIONS.map((re) => faqPage?.faqs.find((f) => re.test(f.question))).filter(
    (f): f is NonNullable<typeof f> => Boolean(f),
  );
  const latest = getBlogPosts().slice(0, 3);
  const [heroImage, whyImage] = page.images;

  return (
    <>
      <Hero h1={page.fm.h1} image={heroImage} />
      <TrustBar overlap={heroFrames(heroImage).length > 0} />
      <EditorialColumns whyImage={whyImage} />
      <LatestArticles posts={latest} />
      <SupportColumns faqs={faqs} />
      <CtaBand title={page.cta?.title} text={page.cta?.text} buttons={page.cta?.buttons} />
    </>
  );
}
