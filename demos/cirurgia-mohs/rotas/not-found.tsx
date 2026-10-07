import Link from "@/demos/cirurgia-mohs/lib/Link";
import Button, { ArrowIcon } from "@/demos/cirurgia-mohs/components/ui/Button";
import { mainNav } from "@/demos/cirurgia-mohs/config/site";

/**
 * Página 404 com busca (via Google site:) e links para as páginas pilares.
 * Réplica: a busca abre o Google em outra aba (o original filtra pelo domínio
 * de NEXT_PUBLIC_SITE_URL; aqui o filtro fica vazio, como no original sem a variável).
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-600">Erro 404</p>
      <h1 className="mt-3 text-4xl">Página não encontrada</h1>
      <p className="mt-4 text-lg text-navy-700">
        O endereço pode ter mudado. Use a busca ou vá direto para uma das páginas principais.
      </p>
      <form action="https://www.google.com/search" method="get" target="_blank" role="search" className="mx-auto mt-8 flex max-w-md gap-2">
        <label htmlFor="q" className="sr-only">Buscar no site</label>
        <input id="q" name="q" placeholder="Buscar no site…" className="w-full rounded-full border border-navy-200 bg-white px-5 py-3 text-base focus:border-navy-500 focus:outline-none" />
        <input type="hidden" name="as_sitesearch" value="" />
        <button type="submit" className="rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-paper">Buscar</button>
      </form>
      <nav aria-label="Páginas principais" className="mt-10 flex flex-wrap justify-center gap-3">
        {mainNav.map((i) => (
          <Button key={i.href} href={i.href} variant="secondary">{i.label} <ArrowIcon /></Button>
        ))}
      </nav>
      <p className="mt-10 text-sm"><Link href="/" className="underline underline-offset-2">Voltar para a página inicial</Link></p>
    </div>
  );
}
