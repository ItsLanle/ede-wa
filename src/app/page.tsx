const audiences = [
  {
    tag: "18–25",
    label: "Young adults",
    primary: true,
    body: "Our primary audience — the ones who grew up hearing Yorùbá at home and are ready to speak it back, on their own terms, without asking anyone to slow down for them.",
  },
  {
    tag: "6–12",
    label: "Children",
    body: "Voiced, playful lessons that build a real ear for tone while it is still easy to catch.",
  },
  {
    tag: "13–17",
    label: "Teenagers",
    body: "Phone-first sessions short enough to finish on the bus, and conversations worth having with grandparents.",
  },
  {
    tag: "Campus",
    label: "College students",
    body: "Lessons that fit between lectures and sit alongside African studies coursework — with a partner to practise on at one in the morning.",
  },
  {
    tag: "Anytime",
    label: "Adults with full calendars",
    body: "Ten minutes is a whole lesson. Èdè Wa remembers where you stopped, through shifts, deadlines, and school runs.",
  },
];

const conversationTraits = [
  {
    title: "It listens",
    body: "Speak in full sentences, half sentences, or stumble through it twice. The AI hears you out loud — no script to read from, no timer counting down.",
  },
  {
    title: "It responds",
    body: "Real back-and-forth in Yorùbá: greeting an elder, haggling at the market, catching up with a cousin. It follows where you take the conversation and stays at your level.",
  },
  {
    title: "It corrects gently",
    body: "Tone by tone, syllable by syllable — what you got right first, then the one thing to try again. Encouragement, never a red X.",
  },
];

const pillars = [
  {
    index: "01",
    title: "Tone you can actually hear",
    body: "Yorùbá turns on tone — ọkọ̀ is a vehicle, ọkọ is a husband, oko is a farm. Every phrase is voiced by native speakers, slowed down, then spoken at speed until your ear catches the difference.",
  },
  {
    index: "02",
    title: "The Yorùbá your family speaks",
    body: "Lessons built from real moments: greeting an elder, calling home on Sunday, ordering at the market, holding your own at an owambe.",
  },
  {
    index: "03",
    title: "Culture in every lesson",
    body: "Òwe, oríkì, and the stories behind the words — so you learn why a thing is said, not only how to say it.",
  },
];

export default function Home() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <Backdrop />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a href="#" className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-gold-300 to-gold-600 font-display text-lg font-semibold text-forest-950 shadow-[0_0_24px_-6px_rgba(236,197,94,0.6)]"
          >
            È
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-sand-50">
            Èdè Wa
          </span>
        </a>

        <nav className="flex items-center gap-6 text-sm">
          <a
            href="#who"
            className="hidden text-sand-300 transition-colors hover:text-gold-300 sm:block"
          >
            Who it is for
          </a>
          <a
            href="#practice"
            className="hidden text-sand-300 transition-colors hover:text-gold-300 sm:block"
          >
            Practice with AI
          </a>
          <a
            href="#begin"
            className="text-sand-300 transition-colors hover:text-gold-300"
          >
            Your first word
          </a>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24 text-center sm:px-10 sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-gold-300 uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            Yorùbá for the diaspora
          </p>

          <h1 className="mt-8 bg-linear-to-b from-sand-50 via-gold-300 to-gold-600 bg-clip-text pb-3 font-display text-6xl leading-[0.95] font-semibold tracking-tight text-transparent sm:text-8xl">
            Èdè Wa
          </h1>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span
              aria-hidden
              className="h-px w-10 bg-linear-to-r from-transparent to-gold-500/60 sm:w-16"
            />
            <p className="font-display text-lg tracking-[0.3em] text-gold-400 uppercase sm:text-xl">
              Our Language
            </p>
            <span
              aria-hidden
              className="h-px w-10 bg-linear-to-l from-transparent to-gold-500/60 sm:w-16"
            />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-sand-300 sm:text-lg sm:leading-9">
            Èdè Wa is a Yorùbá course for the whole diaspora, at every age. It is
            built first for young adults — the 18-to-25s who grew up hearing the
            language at home and never got to speak it back — and it holds up
            just as well for children, teenagers, college students, and adults
            with no spare hour in the day. Short lessons train your ear for
            tone, teach the phrases your family actually uses, and carry the
            proverbs and stories behind them. Practise out loud with an AI
            conversation partner whenever you like. Ten minutes a day is enough
            to begin.
          </p>

          <div className="mt-11 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <a
              href="#"
              className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-gold-400 to-gold-600 px-9 text-base font-semibold text-forest-950 shadow-[0_14px_44px_-14px_rgba(236,197,94,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_54px_-14px_rgba(236,197,94,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300 sm:w-auto"
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
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-sand-200/15 px-8 text-base font-medium text-sand-200 transition-colors hover:border-gold-400/40 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300 sm:w-auto"
            >
              Meet your AI partner
            </a>
          </div>

          <p className="mt-7 text-sm text-sand-400">
            Free to start · No card needed · Ages 6 to 60+ · Ọ̀yọ́, Ẹ̀gbá and Lagos
            speakers
          </p>
        </section>

        {/* Who it is for */}
        <section
          id="who"
          className="mx-auto w-full max-w-6xl scroll-mt-20 border-t border-sand-200/10 px-6 py-20 sm:px-10"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
              Every age, one language
            </h2>
            <p className="text-sm text-sand-400">
              The same course, paced to the life you are living
            </p>
          </div>

          <dl className="mt-12 divide-y divide-sand-200/10 border-y border-sand-200/10">
            {audiences.map((audience) => (
              <div
                key={audience.label}
                className={`grid gap-2 py-7 pl-5 sm:grid-cols-[7.5rem_1fr] sm:gap-8 ${
                  audience.primary
                    ? "border-l-2 border-gold-400 bg-gold-500/[0.05]"
                    : "border-l-2 border-transparent"
                }`}
              >
                <dt className="font-mono text-xs tracking-[0.16em] text-gold-500 uppercase sm:pt-1.5">
                  {audience.tag}
                </dt>
                <dd>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-semibold text-sand-50">
                      {audience.label}
                    </h3>
                    {audience.primary ? (
                      <span className="rounded-full bg-linear-to-r from-gold-400 to-gold-600 px-2.5 py-0.5 font-mono text-[0.625rem] tracking-[0.14em] text-forest-950 uppercase">
                        Primary audience
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 max-w-2xl text-[0.9375rem] leading-7 text-sand-300">
                    {audience.body}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Pillars */}
        <section
          id="how"
          className="mx-auto w-full max-w-6xl scroll-mt-20 border-t border-sand-200/10 px-6 py-20 sm:px-10"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
            Built for the way the diaspora learns
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-sand-300">
            Not a vocabulary drill. A way back into a language that is already
            partly yours.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-sand-200/10 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.index}
                className="group bg-forest-950 p-8 transition-colors hover:bg-forest-900"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-gold-500">
                  {pillar.index}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-sand-50">
                  {pillar.title}
                </h3>
                <span
                  aria-hidden
                  className="mt-5 block h-px w-10 bg-clay-500 transition-all group-hover:w-16 group-hover:bg-gold-400"
                />
                <p className="mt-5 text-[0.9375rem] leading-7 text-sand-300">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* AI conversation partner */}
        <section
          id="practice"
          className="scroll-mt-20 border-y border-sand-200/10 bg-forest-900/40"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 sm:px-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-gold-500 uppercase">
                Ìjíròrò · AI conversation partner
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
                A judgment-free place to actually speak
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-sand-300">
                The hardest part of learning Yorùbá in the diaspora was never the
                grammar. It is saying it out loud in front of someone who
                already knows better. So Èdè Wa gives you a partner that never
                sighs, never laughs, and never runs out of patience — an AI you
                can hold a real Yorùbá conversation with, for as long as you
                want, at whatever hour you find the nerve.
              </p>

              <ul className="mt-10 space-y-7">
                {conversationTraits.map((trait) => (
                  <li key={trait.title} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-3 h-px w-8 shrink-0 bg-gold-500/70"
                    />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-sand-50">
                        {trait.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-7 text-sand-300">
                        {trait.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-10 border-l-2 border-gold-400/40 pl-4 text-sm leading-6 text-sand-400">
                Practise the same greeting forty times if that is what it takes.
                Nobody is keeping score.
              </p>
            </div>

            <div className="relative lg:order-first">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[2rem] bg-linear-to-tr from-forest-500/15 via-gold-500/10 to-transparent blur-xl"
              />
              <div className="relative rounded-3xl border border-sand-200/12 bg-forest-950/80 p-6 backdrop-blur-sm sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-sand-200/10 pb-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-forest-500 to-forest-700 font-display text-sm font-semibold text-gold-300"
                    >
                      Ìj
                    </span>
                    <div>
                      <p className="text-sm font-medium text-sand-50">
                        Ìjíròrò
                      </p>
                      <p className="font-mono text-[0.6875rem] text-sand-400">
                        Your AI partner
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-gold-400 uppercase">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-gold-400"
                    />
                    listening
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-sand-200/10 bg-forest-800/60 px-5 py-4">
                    <p className="font-display text-lg text-sand-50">
                      Ẹ káàsán! Báwo ni ọjọ́ rẹ?
                    </p>
                    <p className="mt-1.5 text-sm text-sand-400">
                      Good afternoon! How has your day been?
                    </p>
                  </div>

                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm border border-gold-400/25 bg-gold-500/[0.08] px-5 py-4">
                    <p className="font-display text-lg text-sand-50">
                      Ó dára… mo ń kọ́ Yorùbá.
                    </p>
                    <p className="mt-1.5 text-sm text-sand-400">
                      It is good… I am learning Yorùbá.
                    </p>
                    <p className="mt-3 flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-gold-400 uppercase">
                      <MicIcon />
                      spoken aloud
                    </p>
                  </div>

                  <div className="rounded-2xl border border-clay-400/25 bg-clay-600/12 px-5 py-4">
                    <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-clay-400 uppercase">
                      Gentle feedback
                    </p>
                    <p className="mt-2.5 text-sm leading-6 text-sand-200">
                      Your <span className="text-gold-300">kọ́</span> landed
                      high — that is exactly right. Hold the{" "}
                      <span className="text-gold-300">ń</span> in{" "}
                      <span className="font-display">mo ń kọ́</span> a beat
                      longer and it will sound like home.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* First word */}
        <section
          id="begin"
          className="mx-auto w-full max-w-6xl scroll-mt-20 border-t border-sand-200/10 px-6 py-20 sm:px-10"
        >
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-gold-500 uppercase">
                Lesson one
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
                Start with one word today
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-sand-300">
                Each day opens with a single word — its tones marked, its
                meaning placed in a sentence you would really say. Learn it,
                hear it, say it back. Tomorrow it returns inside a
                conversation.
              </p>
              <a
                href="#"
                className="group mt-10 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-gold-400 to-gold-600 px-9 text-base font-semibold text-forest-950 shadow-[0_14px_44px_-14px_rgba(236,197,94,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_54px_-14px_rgba(236,197,94,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
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
                className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-gold-500/12 via-clay-500/10 to-transparent blur-xl"
              />
              <div className="relative rounded-3xl border border-sand-200/12 bg-forest-900/70 p-9 backdrop-blur-sm sm:p-11">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-sand-400 uppercase">
                    Ọ̀rọ̀ òní / Word of the day
                  </span>
                  <span className="rounded-full border border-clay-400/30 px-2.5 py-0.5 font-mono text-[0.6875rem] text-clay-400">
                    noun
                  </span>
                </div>

                <p className="mt-8 font-display text-6xl font-semibold tracking-tight text-gold-300 sm:text-7xl">
                  Ìyá
                </p>
                <p className="mt-4 font-mono text-sm text-sand-300">
                  ee&#8209;YAH · ì <span className="text-sand-400">low</span> ·
                  yá <span className="text-sand-400">high</span>
                </p>

                <p className="mt-8 text-lg text-sand-100">mother</p>

                <div className="mt-8 border-t border-sand-200/10 pt-7">
                  <p className="font-display text-xl text-sand-50">
                    Ìyá mi ni.
                  </p>
                  <p className="mt-2 text-sm text-sand-300">
                    She is my mother.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-sand-200/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
          <blockquote className="max-w-xl">
            <p className="font-display text-lg leading-8 text-sand-200 italic">
              “Ọmọ tí a kò kọ́ ni yóò gbé ilé tí a kọ́ tà.”
            </p>
            <p className="mt-3 text-sm text-sand-400">
              The child we fail to teach will sell the house we built.{" "}
              <cite className="text-sand-400/70 not-italic">
                — Yorùbá proverb
              </cite>
            </p>
          </blockquote>

          <p className="text-sm text-sand-400">
            © 2026 Èdè Wa · Made for the diaspora
          </p>
        </div>
      </footer>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="size-3.5"
    >
      <rect x="9" y="2.5" width="6" height="10" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </svg>
  );
}

/** Adire-inspired pattern and warm light behind the whole page. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <svg className="size-full text-gold-300/45">
        <defs>
          <pattern
            id="adire"
            width="76"
            height="76"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M38 4 72 38 38 72 4 38Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
            />
            <circle cx="38" cy="38" r="2.5" fill="currentColor" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            <circle cx="76" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="76" r="1.5" fill="currentColor" />
            <circle cx="76" cy="76" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adire)" opacity="0.16" />
      </svg>

      <div className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-forest-500/20 blur-[120px]" />
      <div className="absolute -top-24 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-gold-500/12 blur-[120px]" />
      <div className="absolute bottom-[-14rem] left-[-10rem] h-[32rem] w-[32rem] rounded-full bg-clay-600/18 blur-[130px]" />
    </div>
  );
}
