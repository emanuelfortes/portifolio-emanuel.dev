import type { Metadata } from "next";

/**
 * Layout raiz das réplicas, separado do layout do portfólio.
 *
 * Cada réplica roda num iframe dentro do monitor da seção de projetos, e
 * precisa se comportar como o site original: fonte, reset, Tailwind e media
 * queries próprios. Se herdasse app/(site)/layout.tsx, levaria junto o fundo
 * escuro, o granulado e a Space Grotesk do portfólio. Por isso as demos ficam
 * num grupo de rotas com layout raiz próprio, que não importa globals.css.
 */
export const metadata: Metadata = {
  /* São cópias de sites que já existem com domínio próprio. */
  robots: { index: false, follow: false },
};

export default function DemoRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
