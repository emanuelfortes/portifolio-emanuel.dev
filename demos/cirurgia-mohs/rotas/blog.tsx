import type { Metadata } from "next";
import { getBlogPosts } from "@/demos/cirurgia-mohs/lib/content";
import BlogListing, { POSTS_PER_PAGE } from "@/demos/cirurgia-mohs/components/blog/BlogListing";

export const metadata: Metadata = {
  title: "Blog: artigos sobre cirurgia de Mohs e câncer de pele para pacientes",
  description:
    "Artigos claros sobre cirurgia de Mohs, tipos de câncer de pele, pós-operatório, convênios e custos, revisados por médico com CRM e RQE. Fortaleza e todo o Nordeste.",
};

export default function BlogIndex() {
  const posts = getBlogPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  return <BlogListing posts={posts.slice(0, POSTS_PER_PAGE)} page={1} totalPages={totalPages} basePath="/blog" />;
}
