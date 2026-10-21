const words = ["Kọ́", "Sọ", "Gbọ́", "Kà", "Kọ́ ẹ̀kọ́"];

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-20 sm:px-10 sm:pb-28 sm:pt-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-pink-600 uppercase">
          <span aria-hidden className="size-2 rounded-full bg-pink-500" />
          Yorùbá for the diaspora
        </div>

        <h1 className="mt-8 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-green-950 sm:text-8xl">
          Èdè Wa
        </h1>

        <div className="mt-5 flex items-center justify-center gap-4">
          <span aria-hidden className="h-px w-10 bg-green-700/30 sm:w-16" />

          <p className="font-display text-lg tracking-[0.22em] text-pink-600 uppercase sm:text-xl">
            Our Language
          </p>

          <span aria-hidden className="h-px w-10 bg-green-700/30 sm:w-16" />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-green-900/75 sm:text-lg sm:leading-9">
          Èdè Wa is a Yorùbá course for the whole diaspora, at every age. It is
          built first for young adults who grew up hearing the language at home
          and never got to speak it back — while making room for children,
          teenagers, college students, and adults with full calendars.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#begin"
            className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-green-700 px-9 text-base font-semibold text-bisque-50 shadow-lg shadow-green-900/10 transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl sm:w-auto"
          >
            Begin Your Journey
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>

          <a
            href="#practice"
            className="inline-flex h-14 w-full items-center justify-center rounded-full border border-green-900/20 bg-white/40 px-8 text-base font-medium text-green-900 transition-all hover:border-pink-500/40 hover:bg-pink-500/5 hover:text-pink-600 sm:w-auto"
          >
            Meet your AI partner
          </a>
        </div>

        <p className="mt-6 text-sm text-green-900/55">
          Free to start · No card needed · Ages 6 to 60+ · Ọ̀yọ́, Ẹ̀gbá and
          Lagos speakers
        </p>
      </div>

      <div className="mx-auto mt-20 flex max-w-5xl flex-wrap items-center justify-center gap-3">
        {words.map((word, index) => (
          <div
            key={word}
            className={`rounded-2xl border px-5 py-3 font-display text-lg shadow-sm ${
              index % 2 === 0
                ? "border-green-700/15 bg-white text-green-800"
                : "border-pink-500/15 bg-pink-500/5 text-pink-600"
            }`}
          >
            {word}
          </div>
        ))}
      </div>
    </section>
  );
}
