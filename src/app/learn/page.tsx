import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/SiteShell";
import { lessons } from "@/data/lessons";

export const metadata: Metadata = {
  title: "Lessons — Èdè Wa",
  description: "Short Yorùbá lessons for real moments: greetings, family and the market.",
};

export default function LearnPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
            Ẹ̀kọ́ · Lessons
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
            Start where you are.
          </h1>

          <p className="mt-5 text-base leading-8 text-green-900/70">
            Each lesson is a handful of phrases you would really say, with their
            tones drawn out and a note on the culture behind them. Ten minutes
            each.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {lessons.map((lesson, index) => (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${lesson.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-green-900/10 bg-white/70 p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.15em] text-pink-600 uppercase">
                  Lesson {index + 1}
                </span>

                <h2 className="mt-6 font-display text-2xl font-semibold text-green-950">
                  {lesson.title}
                </h2>

                <p className="font-display text-lg text-pink-600">
                  {lesson.yorubaTitle}
                </p>

                <p className="mt-3 flex-1 text-sm leading-7 text-green-900/70">
                  {lesson.summary}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-800 group-hover:text-pink-600">
                  {lesson.phrases.length} phrases
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </SiteShell>
  );
}
