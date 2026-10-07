import Link from "@/demos/cirurgia-mohs/lib/Link";

/** Trilha de navegação visível (o schema BreadcrumbList vem do JSON-LD da página). */
export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Você está em" className="text-xs text-navy-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-medium text-navy-700">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-navy-800 hover:underline underline-offset-2">
                  {item.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden="true" className="text-navy-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
