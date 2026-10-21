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

export function Pillars() {
  return (
    <section
      id="how"
      className="border-y border-green-900/10 bg-green-950 px-6 py-20 text-bisque-50 sm:px-10 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-300 uppercase">
            How Èdè Wa works
          </p>

          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for the way the diaspora learns.
          </h2>

          <p className="mt-5 text-base leading-8 text-bisque-50/70">
            Not a vocabulary drill. A learning experience grounded in voice,
            culture, and the moments where Yorùbá actually lives.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.index}
              className="flex flex-col rounded-3xl border border-bisque-50/10 bg-white/5 p-8 transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-pink-300">
                {pillar.index}
              </span>

              <h3 className="mt-6 font-display text-2xl font-semibold">
                {pillar.title}
              </h3>

              <div className="mt-5 h-1 w-10 rounded-full bg-pink-500" />

              <p className="mt-5 text-sm leading-7 text-bisque-50/70">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
