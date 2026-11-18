import { SiteShell } from "@/components/SiteShell";

/** Shown instantly while the feed's posts are fetched from the database. */
export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-24" role="status" aria-live="polite">
        <span className="sr-only">Loading posts…</span>
        <div className="flex items-center gap-3 text-sm font-medium text-pink-600">
          <span aria-hidden className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          Ń bọ̀… (loading)
        </div>
        <ul className="mt-10 space-y-3" aria-hidden>
          {[0, 1, 2, 3, 4].map((row) => (
            <li
              key={row}
              className="flex animate-pulse items-center gap-5 rounded-3xl border border-green-900/10 bg-white/60 p-6"
            >
              <span className="h-14 w-14 rounded-2xl bg-pink-500/10" />
              <span className="flex-1 space-y-3">
                <span className="block h-5 w-2/3 rounded-full bg-green-900/10" />
                <span className="block h-3 w-1/4 rounded-full bg-green-900/5" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
