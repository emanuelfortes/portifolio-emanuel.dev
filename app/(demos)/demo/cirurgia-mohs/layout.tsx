import type { Metadata, Viewport } from "next";
import "@/demos/cirurgia-mohs/styles.css";
import SiteLayout from "@/demos/cirurgia-mohs/SiteLayout";
import { siteConfig } from "@/demos/cirurgia-mohs/config/site";

export const metadata: Metadata = {
  title: {
    default: `Cirurgia de Mohs e Câncer de Pele no Nordeste | ${siteConfig.marca}`,
    template: `%s | ${siteConfig.marca}`,
  },
  description: siteConfig.descricaoCurta,
  applicationName: siteConfig.marca,
  icons: { icon: "/demos/cirurgia-mohs/icon.png" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#252d42",
  width: "device-width",
  initialScale: 1,
};

export default function CirurgiaMohsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteLayout>{children}</SiteLayout>;
}
