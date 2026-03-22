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
);

create table if not exists subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);
