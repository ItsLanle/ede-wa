const conversationTraits = [
  {
    number: "01",
    title: "It listens",
    body: "Speak in full sentences, half sentences, or stumble through it twice. The AI hears you out loud — no script to read from, no timer counting down.",
  },
  {
    number: "02",
    title: "It responds",
    body: "Real back-and-forth in Yorùbá: greeting an elder, haggling at the market, catching up with a cousin. It follows where you take the conversation and stays at your level.",
  },
  {
    number: "03",
    title: "It corrects gently",
    body: "Tone by tone, syllable by syllable — what you got right first, then the one thing to try again. Encouragement, never a red X.",
  },
];

export function Practice() {
  return (
    <section
      id="practice"
      className="scroll-mt-20 bg-bisque-100/45 px-6 py-20 sm:px-10 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
            Ìjíròrò · AI conversation partner
          </p>

          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            A judgment-free place to actually speak.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-green-900/70">
            The hardest part of learning Yorùbá in the diaspora was never the
            grammar. It is saying it out loud in front of someone who already
            knows better. Èdè Wa gives you a partner that never sighs, never
            laughs, and never runs out of patience.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {conversationTraits.map((trait) => (
              <div
                key={trait.title}
                className="flex gap-5 rounded-2xl border border-green-900/10 bg-white/70 p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-500/10 font-mono text-xs font-semibold text-pink-600">
                  {trait.number}
                </span>

                <div>
                  <h3 className="font-display text-xl font-semibold text-green-950">
                    {trait.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-green-900/70">
                    {trait.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ConversationMockup />
      </div>
    </section>
  );
}

function ConversationMockup() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-5 rounded-[2rem] bg-pink-500/10 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-green-900/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-green-700 font-display text-sm font-semibold text-bisque-50">
              Ìj
            </span>

            <div>
              <p className="text-sm font-semibold text-green-950">Ìjíròrò</p>

              <p className="text-xs text-green-900/50">
                Your AI conversation partner
              </p>
            </div>
          </div>

          <span className="flex items-center gap-2 text-xs font-medium text-green-700">
            <span className="size-2 rounded-full bg-green-500" />
            Listening
          </span>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-green-700 px-5 py-4 text-bisque-50">
            <p className="font-display text-lg">Ẹ káàsán! Báwo ni ọjọ́ rẹ?</p>

            <p className="mt-2 text-sm text-bisque-50/70">
              Good afternoon! How has your day been?
            </p>
          </div>

          <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-pink-500/10 px-5 py-4 text-green-950">
            <p className="font-display text-lg">Ó dára… mo ń kọ́ Yorùbá.</p>

            <p className="mt-2 text-sm text-green-900/60">
              It is good… I am learning Yorùbá.
            </p>

            <p className="mt-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-pink-600 uppercase">
              <MicIcon />
              spoken aloud
            </p>
          </div>

          <div className="rounded-2xl border border-tan-400/30 bg-bisque-50 px-5 py-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-tan-700 uppercase">
              Gentle feedback
            </p>

            <p className="mt-2.5 text-sm leading-6 text-green-900/75">
              Your <span className="font-semibold text-pink-600">kọ́</span>{" "}
              landed high — that is exactly right. Hold the{" "}
              <span className="font-semibold text-pink-600">ń</span> in{" "}
              <span className="font-display">mo ń kọ́</span> a beat longer and
              it will sound like home.
            </p>
          </div>
        </div>
      </div>
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
