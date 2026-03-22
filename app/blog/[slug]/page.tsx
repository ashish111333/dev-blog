import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="article">
      <header className="article-header">
        <span className="eyebrow">Published {formatDate(post.publishedAt)}</span>
        <h1 className="article-title">{post.title}</h1>
        <p className="muted">{post.excerpt}</p>
        {post.coverImage ? (
          <img className="article-cover" src={post.coverImage} alt={post.title} />
        ) : null}
      </header>

      <MarkdownRenderer content={post.content} />
    </article>
  );
}
