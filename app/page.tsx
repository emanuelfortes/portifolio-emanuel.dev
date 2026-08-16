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
      <main>
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
