import type { Word } from "@/data/words";

export function WordCard({ word }: { word: Word }) {
  return (
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
            {word.partOfSpeech}
          </span>
        </div>

        <p className="mt-8 font-display text-7xl font-semibold tracking-tight text-pink-600">
          {word.word}
        </p>

        <p className="mt-3 font-mono text-sm text-green-900/55">
          {word.pronunciation} ·{" "}
          {word.syllables
            .map((syllable) => `${syllable.text} ${syllable.tone}`)
            .join(" · ")}
        </p>

        <p className="mt-8 font-display text-xl text-green-950">
          {word.meaning}
        </p>

        <div className="mt-8 border-t border-green-900/10 pt-7">
          <p className="font-display text-2xl text-green-950">{word.example}</p>

          <p className="mt-2 text-sm text-green-900/60">{word.exampleMeaning}</p>
        </div>

        <div className="mt-7 flex items-center gap-2 rounded-xl bg-green-700/5 px-4 py-3 text-sm text-green-800">
          <span aria-hidden className="size-2 rounded-full bg-green-500" />
          Listen · Repeat · Remember
        </div>
      </div>
    </div>
  );
}
