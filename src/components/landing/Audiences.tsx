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

export function Audiences() {
  return (
    <section id="who" className="scroll-mt-20 px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
            Who it is for
          </p>

          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
            Every age, one language.
          </h2>

          <p className="mt-4 text-base leading-8 text-green-900/70">
            The same course, paced to the life you are living.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <article
              key={audience.label}
              className={`flex flex-col rounded-3xl border p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${
                audience.primary
                  ? "border-green-700/20 bg-green-700 text-bisque-50 shadow-md"
                  : "border-green-900/10 bg-white/70 text-green-950"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`font-mono text-xs font-semibold tracking-[0.15em] uppercase ${
                    audience.primary ? "text-pink-200" : "text-pink-600"
                  }`}
                >
                  {audience.tag}
                </span>

                {audience.primary && (
                  <span className="rounded-full bg-pink-500 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
                    Primary
                  </span>
                )}
              </div>

              <h3
                className={`mt-6 font-display text-2xl font-semibold ${
                  audience.primary ? "text-bisque-50" : "text-green-950"
                }`}
              >
                {audience.label}
              </h3>

              <p
                className={`mt-3 text-sm leading-7 ${
                  audience.primary ? "text-bisque-50/80" : "text-green-900/70"
                }`}
              >
                {audience.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
