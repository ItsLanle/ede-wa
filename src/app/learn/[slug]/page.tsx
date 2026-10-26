import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhraseCard } from "@/components/PhraseCard";
import { SiteShell } from "@/components/SiteShell";
import { getLesson, lessons } from "@/data/lessons";

// Only the lessons listed in lessons.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  return lesson
    ? { title: `${lesson.title} — Èdè Wa`, description: lesson.summary }
    : {};
}

export default async function LessonPage({
  params,
}: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const index = lessons.indexOf(lesson);
  const next = lessons[index + 1];

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <Link
          href="/learn"
          className="text-sm font-medium text-green-800 hover:text-pink-600"
        >
          ← All lessons
        </Link>

        <div className="mt-8 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
            Lesson {index + 1} · {lesson.yorubaTitle}
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-green-900/70">
            {lesson.intro}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lesson.phrases.map((phrase) => (
            <PhraseCard key={phrase.yoruba} phrase={phrase} />
          ))}
        </div>

        <aside className="mt-12 rounded-3xl bg-green-950 p-8 text-bisque-50 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-300 uppercase">
            Àṣà · Culture
          </p>
          <p className="mt-4 max-w-3xl font-display text-xl leading-9">
            {lesson.culture}
          </p>
        </aside>

        <div className="mt-12 flex justify-end">
          {next ? (
            <Link
              href={`/learn/${next.slug}`}
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-green-700 px-8 text-base font-semibold text-bisque-50 transition-all hover:-translate-y-0.5 hover:bg-green-800"
            >
              Next: {next.title}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : (
            <Link
              href="/word"
              className="inline-flex h-14 items-center rounded-full bg-pink-500 px-8 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-pink-600"
            >
              Keep going with today&apos;s word
            </Link>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
