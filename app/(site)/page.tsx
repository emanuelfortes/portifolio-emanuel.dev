import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Bento from "@/components/Bento";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      {/*
        overflow-x-clip (e não hidden) porque os glows decorativos das seções
        são posicionados com offsets negativos e sangram para fora do container.
        Sem isso eles alargam o documento e o mobile ganha scroll lateral.
        `clip` corta sem criar contexto de rolagem, então não quebra o header
        fixo nem a rolagem suave das âncoras — o que `hidden` faria.
      */}
      <main className="overflow-x-clip">
        <Hero />
        <Bento />
        <Skills />
        <Projects />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
