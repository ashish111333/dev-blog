import Link from "next/link";
import { DashboardEditor } from "@/components/dashboard-editor";
import { requireAdminSession } from "@/lib/auth";
import { getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireAdminSession();
  const posts = await getPublishedPosts();

  return (
    <section className="section">
      <div className="dashboard-grid">
        <DashboardEditor adminEmail={session.email} />

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Snapshot</span>
            <div className="stats-grid" style={{ marginTop: 16 }}>
              <div>
                <p className="helper-text">Posts</p>
                <h2 className="section-title">{posts.length}</h2>
              </div>
              <div>
                <p className="helper-text">Public route</p>
                <Link className="chip" href="/blog">
                  /blog
                </Link>
              </div>
            </div>
          </section>

          <section className="panel">
            <span className="eyebrow">Published</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              Current posts
            </h2>

            {posts.length ? (
              <div className="list" style={{ marginTop: 12 }}>
                {posts.map((post) => (
                  <div className="list-item" key={post.slug}>
                    <div className="stack" style={{ gap: 6 }}>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      <span className="badge">
                        <span className="dot" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <code>{post.slug}</code>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ marginTop: 12 }}>
                No posts yet. Publish your first one from the editor.
              </p>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}
