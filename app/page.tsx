import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { getAdminSession } from "@/lib/auth";
import { getPublishedPosts } from "@/lib/posts";

export default async function HomePage() {
  const session = await getAdminSession();
  const posts = await getPublishedPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <section className="hero">
        <h1>Dev explaining systems one by one.</h1>
        <p>
          Notes on backend engineering, systems design, and infrastructure, explained
          one piece at a time.
        </p>
        <div className="cta-row">
          <Link className="button" href="/blog">
            Read the blog
          </Link>
          {session ? (
            <Link className="ghost-button" href="/dashboard">
              Open dashboard
            </Link>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div className="stack">
            <span className="eyebrow">Subscribe</span>
            <h2 className="section-title">Join the mailing list</h2>
          </div>
        </div>
        <div className="panel">
          <SubscribeForm />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div className="stack">
            <span className="eyebrow">Latest posts</span>
            <h2 className="section-title">Recent writing</h2>
          </div>
          <Link className="chip" href="/blog">
            View all posts
          </Link>
        </div>

        {latestPosts.length ? (
          <div className="grid">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="eyebrow">No posts yet</span>
            <h2 className="section-title">Your blog is ready.</h2>
            <p className="muted">
              {session
                ? "Head to the dashboard, write your first post, and it will appear here."
                : "The first published post will appear here once the blog goes live."}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
