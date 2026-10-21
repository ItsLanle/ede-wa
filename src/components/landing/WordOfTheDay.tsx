import Link from "next/link";

import { WordCard } from "@/components/WordCard";
import { getWordOfTheDay } from "@/data/words";

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

          <Link
            href="/word"
            className="group mt-9 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-pink-500 px-9 text-base font-semibold text-white shadow-lg shadow-pink-500/15 transition-all hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl"
          >
            Begin Your Journey
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <WordCard word={getWordOfTheDay()} />
      </div>
    </section>
  );
}
