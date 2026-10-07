import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "aos/dist/aos.css";
import "@/demos/siga-fibra-site/styles.css";
import SiteLayout from "@/demos/siga-fibra-site/SiteLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://sigafibra.com"),
  title: "Siga Fibra",
  icons: { icon: "/demos/siga-fibra-site/favicon.png" },
};

export default function SigaFibraSiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteLayout>{children}</SiteLayout>;
}
