export function WordOfTheDay() {
  return (
    <section id="begin" className="scroll-mt-20 px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
            Lesson one
          </p>

          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            Start with one word today.
          </h2>

          <p className="mt-5 max-w-lg text-base leading-8 text-green-900/70">
            Each day opens with a single word — its tones marked, its meaning
            placed in a sentence you would really say. Learn it, hear it, say
            it back. Tomorrow it returns inside a conversation.
          </p>

          <a
            href="#"
            className="group mt-9 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-pink-500 px-9 text-base font-semibold text-white shadow-lg shadow-pink-500/15 transition-all hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl"
          >
            Begin Your Journey
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-5 rounded-[2rem] bg-green-700/10 blur-3xl"
          />

          <div className="relative rounded-[2rem] border border-green-900/10 bg-white p-8 shadow-xl sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold tracking-[0.16em] text-green-900/50 uppercase">
                Ọ̀rọ̀ òní / Word of the day
              </span>

              <span className="rounded-full bg-bisque-100 px-3 py-1 text-xs font-medium text-tan-700">
                noun
              </span>
            </div>

            <p className="mt-8 font-display text-7xl font-semibold tracking-tight text-pink-600">
              Ìyá
            </p>

            <p className="mt-3 font-mono text-sm text-green-900/55">
              ee-YAH · ì low · yá high
            </p>

            <p className="mt-8 font-display text-xl text-green-950">mother</p>

            <div className="mt-8 border-t border-green-900/10 pt-7">
              <p className="font-display text-2xl text-green-950">Ìyá mi ni.</p>

              <p className="mt-2 text-sm text-green-900/60">She is my mother.</p>
            </div>

            <div className="mt-7 flex items-center gap-2 rounded-xl bg-green-700/5 px-4 py-3 text-sm text-green-800">
              <span aria-hidden className="size-2 rounded-full bg-green-500" />
              Listen · Repeat · Remember
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
