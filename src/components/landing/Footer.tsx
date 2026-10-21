export function Footer() {
  return (
    <footer className="border-t border-green-900/10 bg-white/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-full bg-green-700 font-display text-sm font-semibold text-bisque-50"
            >
              È
            </span>

            <span className="font-display text-lg font-semibold text-green-950">
              Èdè Wa
            </span>
          </div>

          <blockquote className="mt-5 max-w-xl">
            <p className="font-display text-lg leading-8 text-green-900 italic">
              “Ọmọ tí a kò kọ́ ni yóò gbé ilé tí a kọ́ tà.”
            </p>

            <p className="mt-2 text-sm text-green-900/55">
              The child we fail to teach will sell the house we built.
              <cite className="ml-1 not-italic">— Yorùbá proverb</cite>
            </p>
          </blockquote>
        </div>

        <div className="flex flex-col gap-2 text-sm text-green-900/55 lg:items-end">
          <p>Made for the diaspora</p>
          <p>© 2026 Èdè Wa</p>
        </div>
      </div>
    </footer>
  );
}
