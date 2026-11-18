"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";

import type { FormState } from "@/app/oro-wa/actions";

/** Letters and tone marks most keyboards can't type. */
const SPECIAL = ["ẹ", "ọ", "ṣ", "Ẹ", "Ọ", "Ṣ"];
const TONES = [
  { mark: "́", label: "High tone ´" },
  { mark: "̀", label: "Low tone `" },
];

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  initial?: { title: string; content: string | null; image_url: string | null };
  submitLabel: string;
  cancelHref: string;
};

export function PostForm({ action, initial, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const contentRef = useRef<HTMLTextAreaElement>(null);
  /** The field typed in last, so the letter buttons insert there. */
  const lastField = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  function insert(text: string) {
    const field = lastField.current ?? contentRef.current;
    if (!field) return;
    const start = field.selectionStart ?? field.value.length;
    const end = field.selectionEnd ?? field.value.length;
    field.setRangeText(text, start, end, "end");
    field.focus();
  }

  const inputClass =
    "w-full rounded-2xl border border-green-900/15 bg-white/80 px-4 py-3 text-base text-green-950 placeholder:text-green-900/40 focus:border-green-700 focus:outline-none";

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p role="alert" className="rounded-2xl border border-pink-600/30 px-4 py-3 text-sm text-pink-700">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-green-950">
          Title <span className="text-pink-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={150}
          defaultValue={initial?.title}
          onFocus={(event) => {
            lastField.current = event.currentTarget;
          }}
          placeholder="How do I greet my grandma on the phone?"
          className={`${inputClass} font-display text-lg`}
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-semibold text-green-950">
          Say more <span className="font-normal text-green-900/50">(optional)</span>
        </label>
        <textarea
          ref={contentRef}
          id="content"
          name="content"
          rows={7}
          maxLength={5000}
          defaultValue={initial?.content ?? ""}
          onFocus={(event) => {
            lastField.current = event.currentTarget;
          }}
          placeholder="Share the context, a proverb, a win, a question…"
          className={inputClass}
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-green-900/50">Yorùbá letters:</span>
          {SPECIAL.map((letter) => (
            <button
              key={letter}
              type="button"
              // Keep the cursor in the field being typed in.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insert(letter)}
              className="size-8 rounded-lg border border-green-900/15 bg-white font-display text-green-950 hover:border-pink-600"
            >
              {letter}
            </button>
          ))}
          {TONES.map((tone) => (
            <button
              key={tone.label}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insert(tone.mark)}
              title={`${tone.label}: type a vowel, then press this`}
              className="rounded-lg border border-green-900/15 bg-white px-2 py-1 text-xs text-green-950 hover:border-pink-600"
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="image_url" className="mb-2 block text-sm font-semibold text-green-950">
          Image link <span className="font-normal text-green-900/50">(optional)</span>
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          maxLength={1000}
          defaultValue={initial?.image_url ?? ""}
          placeholder="https://…"
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-bisque-50 transition-all hover:bg-green-800 hover:shadow-md disabled:opacity-50"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href={cancelHref} className="text-sm font-medium text-green-800 hover:text-pink-600">
          Cancel
        </Link>
      </div>
    </form>
  );
}
