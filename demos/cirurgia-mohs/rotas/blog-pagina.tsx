import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/demos/cirurgia-mohs/lib/content";
import BlogListing, { POSTS_PER_PAGE } from "@/demos/cirurgia-mohs/components/blog/BlogListing";


export function generateStaticParams() {
  const total = Math.ceil(getBlogPosts().length / POSTS_PER_PAGE);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }));
}

type Props = { params: { n: string } };

export function generateMetadata({ params }: Props): Metadata {
  const { n } = params;
  return {
    title: `Blog: página ${n}`,
    description: "Artigos sobre cirurgia de Mohs e câncer de pele para pacientes.",
  };
}

export default function BlogPage({ params }: Props) {
  const { n } = params;
  const page = Number(n);
  const posts = getBlogPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  return (
    <BlogListing
      posts={posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)}
      page={page}
      totalPages={totalPages}
      basePath="/blog"
    />
  );
}
