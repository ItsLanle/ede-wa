import { SiteShell } from "@/components/SiteShell";

/** Shown instantly while a post and its comments are fetched. */
export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24" role="status" aria-live="polite">
        <span className="sr-only">Loading post…</span>
        <div className="flex items-center gap-3 text-sm font-medium text-pink-600">
          <span aria-hidden className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          Ń bọ̀… (loading)
        </div>
        <div className="mt-10 animate-pulse space-y-5" aria-hidden>
          <div className="h-10 w-3/4 rounded-full bg-green-900/10" />
          <div className="h-3 w-1/4 rounded-full bg-green-900/5" />
          <div className="space-y-3 pt-4">
            <div className="h-4 rounded-full bg-green-900/5" />
            <div className="h-4 rounded-full bg-green-900/5" />
            <div className="h-4 w-2/3 rounded-full bg-green-900/5" />
          </div>
          <div className="h-64 rounded-3xl bg-pink-500/5" />
        </div>
      </div>
    </SiteShell>
  );
}
