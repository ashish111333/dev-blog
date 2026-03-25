import { unstable_cache } from "next/cache";
import { getSql } from "@/lib/db";

export type PostPreview = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
};

export type Post = PostPreview & {
  content: string;
  createdAt: string;
  updatedAt: string;
};

const ensureSchema = async () => {
  const sql = getSql();

  if (!sql) {
    return false;
  }

  await sql`
    create table if not exists posts (
      id bigserial primary key,
      title text not null,
      slug text not null unique,
      excerpt text not null,
      content text not null,
      cover_image text,
      published_at timestamptz not null default now(),
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists subscribers (
      email text primary key,
      created_at timestamptz not null default now()
    )
  `;

  return true;
};

function isMissingTableError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "42P01"
  );
}

const getPublishedPostsCached = unstable_cache(
  async () => {
    const sql = getSql();

    if (!sql) {
      return [] satisfies PostPreview[];
    }

    try {
      const rows = await sql<{
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        cover_image: string | null;
        published_at: string;
      }[]>`
        select id, title, slug, excerpt, cover_image, published_at
        from posts
        order by published_at desc, created_at desc
      `;

      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        coverImage: row.cover_image,
        publishedAt: row.published_at
      })) satisfies PostPreview[];
    } catch (error) {
      if (isMissingTableError(error)) {
        return [] satisfies PostPreview[];
      }

      throw error;
    }
  },
  ["published-posts"],
  {
    revalidate: 600,
    tags: ["posts"]
  }
);

const getPostBySlugCached = unstable_cache(
  async (slug: string) => {
    const sql = getSql();

    if (!sql) {
      return null;
    }

    try {
      const rows = await sql<{
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        cover_image: string | null;
        published_at: string;
        created_at: string;
        updated_at: string;
      }[]>`
        select id, title, slug, excerpt, content, cover_image, published_at, created_at, updated_at
        from posts
        where slug = ${slug}
        limit 1
      `;

      const row = rows[0];

      if (!row) {
        return null;
      }

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        coverImage: row.cover_image,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      } satisfies Post;
    } catch (error) {
      if (isMissingTableError(error)) {
        return null;
      }

      throw error;
    }
  },
  ["post-by-slug"],
  {
    revalidate: 600,
    tags: ["posts"]
  }
);

export async function getPublishedPosts() {
  return getPublishedPostsCached();
}

export async function getPostBySlug(slug: string) {
  return getPostBySlugCached(slug);
}

export async function createPost(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
}) {
  const ready = await ensureSchema();

  if (!ready) {
    throw new Error("DATABASE_URL is missing.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("DATABASE_URL is missing.");
  }

  const [row] = await sql<{ slug: string }[]>`
    insert into posts (title, slug, excerpt, content, cover_image)
    values (${input.title}, ${input.slug}, ${input.excerpt}, ${input.content}, ${input.coverImage ?? null})
    returning slug
  `;

  return row;
}

export async function createSubscriber(email: string) {
  const ready = await ensureSchema();

  if (!ready) {
    throw new Error("DATABASE_URL is missing.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("DATABASE_URL is missing.");
  }

  await sql`
    insert into subscribers (email)
    values (${email.toLowerCase()})
    on conflict (email) do nothing
  `;
}
