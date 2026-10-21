import Link from "next/link";

export function FinalCta() {
  return (
    <section className="px-6 pb-20 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-green-700 px-6 py-16 text-center text-bisque-50 shadow-xl sm:px-12 sm:py-20">
        <p className="text-xs font-semibold tracking-[0.2em] text-pink-200 uppercase">
          Ọ̀rọ̀ kan lónìí
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Your language is worth finding again.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-bisque-50/75">
          Start with ten minutes. Hear a word. Say it back. Keep going.
        </p>

        <Link
          href="/word"
          className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-pink-500 px-9 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-lg"
        >
          Start learning Yorùbá
        </Link>
      </div>
    </section>
  );
}
