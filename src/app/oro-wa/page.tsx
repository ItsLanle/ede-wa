import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/SiteShell";
import { listPosts, timeAgo, type Sort } from "@/lib/forum";

export const metadata: Metadata = {
  title: "Ọ̀rọ̀ Wa — Èdè Wa",
  description: "The Èdè Wa community: questions, proverbs, wins and culture from Yorùbá learners.",
};

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const sort: Sort = params.sort === "top" ? "top" : "new";
  const query = (params.q ?? "").trim().slice(0, 100);
  const posts = await listPosts(sort, query);

  const sortLink = (value: Sort) =>
    `/oro-wa?${new URLSearchParams({ sort: value, ...(query && { q: query }) })}`;

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
              Ọ̀rọ̀ Wa · Our talk
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
              Pull up a chair.
            </h1>
            <p className="mt-5 text-base leading-8 text-green-900/70">
              Ask the question you were too shy to ask at home. Share a proverb,
              a win, a story. Everyone here is learning.
            </p>
          </div>
          <Link
            href="/oro-wa/new"
            className="shrink-0 self-start rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-bisque-50 transition-all hover:bg-green-800 hover:shadow-md sm:self-auto"
          >
            Start a conversation
          </Link>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* A plain GET form: the search lands in the URL, so it's shareable. */}
          <form action="/oro-wa" className="flex flex-1 gap-2 sm:max-w-sm">
            <input type="hidden" name="sort" value={sort} />
            <label htmlFor="q" className="sr-only">
              Search posts by title
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search titles…"
              className="min-w-0 flex-1 rounded-full border border-green-900/15 bg-white/80 px-4 py-2.5 text-sm text-green-950 placeholder:text-green-900/40 focus:border-green-700 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full border border-green-900/15 px-4 py-2.5 text-sm font-medium text-green-800 hover:border-pink-600 hover:text-pink-600"
            >
              Search
            </button>
          </form>

          <nav aria-label="Sort posts" className="flex gap-2 text-sm font-medium">
            {(
              [
                ["new", "Newest", "Tuntun"],
                ["top", "Most upvoted", "Gbajúmọ̀"],
              ] as const
            ).map(([value, label, yoruba]) => (
              <Link
                key={value}
                href={sortLink(value)}
                aria-current={sort === value ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 transition-colors ${
                  sort === value
                    ? "bg-green-700 text-bisque-50"
                    : "text-green-800 hover:text-pink-600"
                }`}
              >
                {label} <span className="opacity-60">· {yoruba}</span>
              </Link>
            ))}
          </nav>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-green-900/20 p-10 text-center text-green-900/60">
            {query
              ? `No posts with “${query}” in the title yet.`
              : "No posts yet. Be the first to start a conversation!"}
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/oro-wa/${post.id}`}
                  className="group flex items-center gap-5 rounded-3xl border border-green-900/10 bg-white/70 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
                >
                  <span className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-pink-500/10 py-2 text-pink-600">
                    <span aria-hidden>▲</span>
                    <span className="font-mono text-sm font-semibold">{post.upvotes}</span>
                    <span className="sr-only">upvotes</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold break-words text-green-950 group-hover:text-pink-600">
                      {post.title}
                    </span>
                    <time dateTime={post.created_at} className="mt-1 block text-xs text-green-900/50">
                      Posted {timeAgo(post.created_at)}
                    </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
