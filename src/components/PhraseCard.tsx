import { AudioButtons } from "@/components/AudioButtons";
import { ToneContour } from "@/components/ToneContour";
import type { Phrase } from "@/data/lessons";

export function PhraseCard({ phrase }: { phrase: Phrase }) {
  return (
    <article className="flex flex-col rounded-3xl border border-green-900/10 bg-white p-6 shadow-sm sm:p-7">
      <p className="font-display text-3xl font-semibold tracking-tight text-pink-600">
        {phrase.yoruba}
      </p>

      <p className="mt-2 font-display text-lg text-green-950">
        {phrase.meaning}
      </p>

      <div className="mt-6">
        <ToneContour syllables={phrase.syllables} />
      </div>

      {phrase.audio && (
        <div className="mt-4">
          <AudioButtons src={phrase.audio} label={phrase.yoruba} />
        </div>
      )}

      {phrase.note && (
        <p className="mt-5 border-t border-green-900/10 pt-4 text-sm leading-6 text-green-900/65">
          {phrase.note}
        </p>
      )}
    </article>
  );
}
