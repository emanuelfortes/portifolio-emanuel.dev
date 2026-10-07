import Link from "@/demos/cirurgia-mohs/lib/Link";
import type { CardItem } from "@/demos/cirurgia-mohs/lib/content";
import { ArrowIcon } from "@/demos/cirurgia-mohs/components/ui/Button";

/** Grade de cards de navegação (cluster pilar → artigos, estados, etc.). */
export default function CardGrid({
  items,
  columns = 3,
  tone = "light",
}: {
  items: CardItem[];
  columns?: 2 | 3;
  tone?: "light" | "dark";
}) {
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  const card =
    tone === "dark"
      ? "border-navy-600 bg-navy-700/60 text-paper hover:bg-navy-700"
      : "border-line bg-white text-navy-800 hover:border-navy-300 hover:shadow-md";
  const desc = tone === "dark" ? "text-navy-200" : "text-ink-muted";

  return (
    <ul className={`not-prose grid gap-4 ${cols} my-8 list-none !pl-0`} role="list">
      {items.map((item, i) => (
        <li key={item.href + i} data-aos="zoom-in" data-aos-delay={Math.min(i, 5) * 60}>
          <Link
            href={item.href}
            className={`group flex h-full flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${card}`}
          >
            <div>
              <h3 className="font-display text-xl leading-snug">{item.title}</h3>
              {item.description && (
                <p className={`mt-2 text-sm leading-relaxed ${desc}`}>{item.description}</p>
              )}
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent-600 transition-transform group-hover:translate-x-1">
              Ler mais <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
