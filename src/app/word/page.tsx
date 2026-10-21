import type { Metadata } from "next";

import { Backdrop } from "@/components/landing/Backdrop";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { WordCard } from "@/components/WordCard";
import { getPreviousWords, getWordOfTheDay } from "@/data/words";

// Re-render hourly so the word changes soon after midnight UTC.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Word of the day — Èdè Wa",
  description: "One Yorùbá word a day, with its tones, meaning and a sentence to say it in.",
};

export default function WordPage() {
  const today = getWordOfTheDay();
  const previous = getPreviousWords(6);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bisque-50 text-green-950">
      <Backdrop />
      <Header />

      <main className="relative z-10 px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
              Ọ̀rọ̀ òní
            </p>

            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
              Today&apos;s word
            </h1>

            <ol className="mt-8 flex max-w-lg flex-col gap-4 text-base leading-7 text-green-900/75">
              <li>
                <span className="font-semibold text-pink-600">Look.</span> The
                accents are the tones: a grave (à) falls low, an acute (á) rises
                high, and no mark sits in the middle.
              </li>
              <li>
                <span className="font-semibold text-pink-600">Say it.</span>{" "}
                Read it aloud slowly, syllable by syllable, then at speed.
              </li>
              <li>
                <span className="font-semibold text-pink-600">Use it.</span>{" "}
                Say the example sentence to someone today.
              </li>
            </ol>
          </div>

          <WordCard word={today} />
        </div>

        {previous.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-green-950 sm:text-3xl">
              Earlier this week
            </h2>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previous.map((word) => (
                <li
                  key={word.word}
                  className="rounded-2xl border border-green-900/10 bg-white/70 p-5"
                >
                  <p className="font-display text-2xl font-semibold text-pink-600">
                    {word.word}
                  </p>
                  <p className="mt-1 text-sm text-green-900/70">{word.meaning}</p>
                  <p className="mt-3 font-display text-green-950">{word.example}</p>
                  <p className="text-sm text-green-900/55">
                    {word.exampleMeaning}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
