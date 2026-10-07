import Link from '@/demos/dr-erico/lib/Link'
import { getRecentPosts } from '@/demos/dr-erico/data/posts'
import PostCard from '@/demos/dr-erico/components/ui/PostCard'

export default function BlogPreview() {
  const posts = getRecentPosts(6)

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-site">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="section-title">Blog</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.slice(0, 4).map((post, i) => (
            <div key={post.id} data-aos="fade-up" data-aos-delay={i * 80}>
              <PostCard post={post} compact />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog" className="btn-silver">
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </section>
  )
}
