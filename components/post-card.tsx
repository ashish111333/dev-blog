import Link from "next/link";
import type { PostPreview } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type PostCardProps = {
  post: PostPreview;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      {post.coverImage ? (
        <img
          className="post-card-image"
          src={post.coverImage}
          alt={post.title}
        />
      ) : null}

      <div className="post-card-body">
        <div className="post-meta">{formatDate(post.publishedAt)}</div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
        <div className="cta-row">
          <Link className="button" href={`/blog/${post.slug}`}>
            Read post
          </Link>
        </div>
      </div>
    </article>
  );
}
