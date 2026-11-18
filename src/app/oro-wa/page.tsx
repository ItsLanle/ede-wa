import type { Metadata } from "next";
import Link from "next/link";

import { FLAGS, handle, isFlag, listPosts, timeAgo, type Flag, type Sort } from "@/lib/forum";

import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Ọ̀rọ̀ Wa — Èdè Wa",
  description: "The Èdè Wa community: questions, proverbs, wins and culture from Yorùbá learners.",
};

type Params = { sort?: string; q?: string; flag?: string; view?: string };

export default async function ForumPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const sort: Sort = params.sort === "top" ? "top" : "new";
  const query = (params.q ?? "").trim().slice(0, 100);
  const flag: Flag | null = isFlag(params.flag) ? params.flag : null;
  // "Full" view shows each post's text and image in the feed.
  const full = params.view === "full";
  const posts = await listPosts({ sort, query, flag });

  /** A link to this page with some options changed. */
  const link = (changes: Partial<Record<keyof Params, string | null>>) => {
    const next = { sort, q: query, flag: flag ?? "", view: full ? "full" : "", ...changes };
    const search = new URLSearchParams(
      Object.entries(next).filter(([, value]) => value) as [string, string][],
    );
    return `/oro-wa${search.size ? `?${search}` : ""}`;
  };

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? "bg-green-700 text-bisque-50" : "border border-green-900/15 text-green-800 hover:text-pink-600"
    }`;

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
            {flag && <input type="hidden" name="flag" value={flag} />}
            {full && <input type="hidden" name="view" value="full" />}
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

          <nav aria-label="Sort posts" className="flex gap-2">
            <Link href={link({ sort: "new" })} aria-current={sort === "new" ? "page" : undefined} className={pill(sort === "new")}>
              Newest <span className="opacity-60">· Tuntun</span>
            </Link>
            <Link href={link({ sort: "top" })} aria-current={sort === "top" ? "page" : undefined} className={pill(sort === "top")}>
              Most upvoted <span className="opacity-60">· Gbajúmọ̀</span>
            </Link>
          </nav>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Filter by flag" className="flex flex-wrap gap-2">
            <Link href={link({ flag: null })} className={pill(!flag)}>
              All
            </Link>
            {Object.entries(FLAGS).map(([value, f]) => (
              <Link
                key={value}
                href={link({ flag: value })}
                aria-current={flag === value ? "page" : undefined}
                className={pill(flag === value)}
              >
                {f.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Feed layout" className="flex shrink-0 gap-1 rounded-full border border-green-900/15 p-1 text-xs font-semibold">
            <Link
              href={link({ view: null })}
              className={`rounded-full px-3 py-1.5 ${!full ? "bg-green-700 text-bisque-50" : "text-green-800"}`}
            >
              Compact
            </Link>
            <Link
              href={link({ view: "full" })}
              className={`rounded-full px-3 py-1.5 ${full ? "bg-green-700 text-bisque-50" : "text-green-800"}`}
            >
              Full
            </Link>
          </nav>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-green-900/20 p-10 text-center text-green-900/60">
            {query || flag
              ? "No posts match yet. Try another search or flag."
              : "No posts yet. Be the first to start a conversation!"}
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/oro-wa/${post.id}`}
                  className="group flex gap-5 rounded-3xl border border-green-900/10 bg-white/70 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
                >
                  <span className="flex h-fit w-14 shrink-0 flex-col items-center rounded-2xl bg-pink-500/10 py-2 text-pink-600">
                    <span aria-hidden>▲</span>
                    <span className="font-mono text-sm font-semibold">{post.upvotes}</span>
                    <span className="sr-only">upvotes</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold break-words text-green-950 group-hover:text-pink-600">
                      {post.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-green-900/50">
                      <time dateTime={post.created_at}>Posted {timeAgo(post.created_at)}</time>
                      {full && post.flag && (
                        <span className="rounded-full bg-green-700/10 px-2 py-0.5 font-semibold text-green-800">
                          {FLAGS[post.flag].label}
                        </span>
                      )}
                      {full && <span>by {handle(post.author)}</span>}
                    </span>

                    {full && post.content && (
                      <span className="mt-3 line-clamp-3 block text-sm leading-6 whitespace-pre-wrap text-green-900/75">
                        {post.content}
                      </span>
                    )}
                    {full && post.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image_url}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="mt-3 max-h-56 rounded-2xl border border-green-900/10 object-cover"
                      />
                    )}
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
