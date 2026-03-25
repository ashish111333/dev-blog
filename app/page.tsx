import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { TypewriterHeading } from "@/components/typewriter-heading";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 600;

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <section className="hero">
        <TypewriterHeading
          text="Explaining systems one by one."
          className="hero-typewriter"
        />
        <p>
          Notes on backend engineering, systems design, and infrastructure, explained
          one piece at a time.
        </p>
        <div className="cta-row">
          <Link className="button" href="/blog">
            Read the blog
          </Link>
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
            <p className="muted">The first published post will appear here once the blog goes live.</p>
          </div>
        )}
      </section>
    </>
  );
}
