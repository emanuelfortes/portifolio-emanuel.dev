import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, slugify } from "@/demos/cirurgia-mohs/lib/content";
import { blogCategories } from "@/demos/cirurgia-mohs/config/site";
import BlogListing, { POSTS_PER_PAGE } from "@/demos/cirurgia-mohs/components/blog/BlogListing";


export function generateStaticParams() {
  return blogCategories.map((c) => ({ categoria: slugify(c) }));
}

type Props = { params: { categoria: string } };

function resolveCategory(slug: string) {
  return blogCategories.find((c) => slugify(c) === slug);
}

export function generateMetadata({ params }: Props): Metadata {
  const { categoria } = params;
  const name = resolveCategory(categoria);
  if (!name) return {};
  return {
    title: `${name}: artigos para pacientes`,
    description: `Artigos sobre ${name.toLowerCase()} escritos para pacientes e familiares, revisados por médico com CRM e RQE.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const { categoria } = params;
  const name = resolveCategory(categoria);
  if (!name) notFound();
  const posts = getPostsByCategory(name);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  return (
    <BlogListing
      posts={posts.slice(0, POSTS_PER_PAGE)}
      page={1}
      totalPages={totalPages}
      category={name}
      basePath={`/blog/categoria/${categoria}`}
    />
  );
}
