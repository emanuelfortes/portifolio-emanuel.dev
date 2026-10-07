import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, slugify } from "@/demos/cirurgia-mohs/lib/content";
import { blogCategories } from "@/demos/cirurgia-mohs/config/site";
import BlogListing, { POSTS_PER_PAGE } from "@/demos/cirurgia-mohs/components/blog/BlogListing";


export function generateStaticParams() {
  const out: { categoria: string; n: string }[] = [];
  for (const c of blogCategories) {
    const total = Math.ceil(getPostsByCategory(c).length / POSTS_PER_PAGE);
    for (let n = 2; n <= total; n++) out.push({ categoria: slugify(c), n: String(n) });
  }
  return out;
}

type Props = { params: { categoria: string; n: string } };

export function generateMetadata({ params }: Props): Metadata {
  const { categoria, n } = params;
  const name = blogCategories.find((c) => slugify(c) === categoria);
  if (!name) return {};
  return {
    title: `${name}: página ${n}`,
    description: `Artigos sobre ${name.toLowerCase()} para pacientes.`,
  };
}

export default function CategoryPaged({ params }: Props) {
  const { categoria, n } = params;
  const name = blogCategories.find((c) => slugify(c) === categoria);
  if (!name) notFound();
  const page = Number(n);
  const posts = getPostsByCategory(name);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  return (
    <BlogListing
      posts={posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)}
      page={page}
      totalPages={totalPages}
      category={name}
      basePath={`/blog/categoria/${categoria}`}
    />
  );
}
