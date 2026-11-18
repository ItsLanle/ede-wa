-- Ọ̀rọ̀ Wa forum tables. Paste this into Supabase → SQL Editor → Run.

create table forum_posts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  title text not null check (char_length(title) between 1 and 150),
  content text check (char_length(content) <= 5000),
  image_url text check (char_length(image_url) <= 1000),
  upvotes integer not null default 0,
  -- Proves who wrote the post, so only they can edit or delete it.
  -- Kept in a cookie in the author's browser; never shown on the site.
  secret text not null
);

create table forum_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references forum_posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  body text not null check (char_length(body) between 1 and 1000)
);

create index forum_comments_post_id_idx on forum_comments (post_id);

-- Row level security with no policies: the public (anon) key can't touch
-- these tables at all. Only the site's server, using the secret key, can.
alter table forum_posts enable row level security;
alter table forum_comments enable row level security;

-- Adds one upvote in a single step, so two clicks at once both count.
create function forum_increment_upvotes(post_id bigint)
returns void
language sql
as $$
  update forum_posts set upvotes = upvotes + 1 where id = post_id;
$$;
