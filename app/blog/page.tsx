import { PostCard } from "@/components/post-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 600;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="section">
      <div className="section-head">
        <div className="stack">
          <span className="eyebrow">Blog</span>
          <h1 className="section-title">All posts</h1>
          <p className="muted">
            Minimal public reading experience, dark all the way through.
          </p>
        </div>
      </div>

      <div className="panel">
        <SubscribeForm />
      </div>

      {posts.length ? (
        <div className="grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="eyebrow">Nothing published</span>
          <h2 className="section-title">No posts have been published yet.</h2>
          <p className="muted">Once you publish from the dashboard, they will show up here.</p>
        </div>
      )}
    </section>
  );
}
