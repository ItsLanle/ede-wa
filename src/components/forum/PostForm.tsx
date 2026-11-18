"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import type { FormState } from "@/app/oro-wa/actions";
import { FLAGS } from "@/lib/flags";

/** Letters and tone marks most keyboards can't type. */
const SPECIAL = ["ẹ", "ọ", "ṣ", "Ẹ", "Ọ", "Ṣ"];
const TONES = [
  { mark: "́", label: "High tone ´" },
  { mark: "̀", label: "Low tone `" },
];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  initial?: {
    title?: string;
    content?: string | null;
    image_url?: string | null;
    video_url?: string | null;
    flag?: string | null;
    reference_id?: number | null;
  };
  /** True when editing a post whose image is an uploaded photo. */
  hasUploadedPhoto?: boolean;
  submitLabel: string;
  cancelHref: string;
};

export function PostForm({ action, initial, hasUploadedPhoto, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [photoError, setPhotoError] = useState("");
  const [preview, setPreview] = useState<string>();
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

  const remember = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    lastField.current = event.currentTarget;
  };

  const inputClass =
    "w-full rounded-2xl border border-green-900/15 bg-white/80 px-4 py-3 text-base text-green-950 placeholder:text-green-900/40 focus:border-green-700 focus:outline-none";
  const labelClass = "mb-2 block text-sm font-semibold text-green-950";
  const optional = <span className="font-normal text-green-900/50">(optional)</span>;

  return (
    <form action={formAction} className="space-y-7">
      {(state.error || photoError) && (
        <p role="alert" className="rounded-2xl border border-pink-600/30 px-4 py-3 text-sm text-pink-700">
          {photoError || state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title <span className="text-pink-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={150}
          defaultValue={initial?.title}
          onFocus={remember}
          placeholder="How do I greet my grandma on the phone?"
          className={`${inputClass} font-display text-lg`}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>Flag {optional}</legend>
        <div className="flex flex-wrap gap-2">
          {[["", "None", ""] as const, ...Object.entries(FLAGS).map(([value, f]) => [value, f.label, f.yoruba] as const)].map(
            ([value, label, yoruba]) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="flag"
                  value={value}
                  defaultChecked={(initial?.flag ?? "") === value}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-green-900/15 px-4 py-2 text-sm text-green-800 transition-colors peer-checked:border-green-700 peer-checked:bg-green-700 peer-checked:text-bisque-50 peer-focus-visible:ring-2 peer-focus-visible:ring-pink-600">
                  {label}
                  {yoruba && <span className="opacity-60"> · {yoruba}</span>}
                </span>
              </label>
            ),
          )}
        </div>
      </fieldset>

      <div>
        <label htmlFor="content" className={labelClass}>
          Say more {optional}
        </label>
        <textarea
          ref={contentRef}
          id="content"
          name="content"
          rows={7}
          maxLength={5000}
          defaultValue={initial?.content ?? ""}
          onFocus={remember}
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

      <div className="grid gap-5 rounded-3xl border border-green-900/10 bg-white/50 p-5 sm:grid-cols-2">
        <div>
          <label htmlFor="image_url" className={labelClass}>
            Image link {optional}
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            maxLength={1000}
            defaultValue={hasUploadedPhoto ? "" : (initial?.image_url ?? "")}
            placeholder="https://…"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="image_file" className={labelClass}>
            …or upload a photo {optional}
          </label>
          <input
            id="image_file"
            name="image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPhotoError("");
              setPreview((old) => {
                if (old) URL.revokeObjectURL(old);
                return file ? URL.createObjectURL(file) : undefined;
              });
              if (file && file.size > MAX_IMAGE_BYTES) {
                setPhotoError("That photo is over 4 MB. Try a smaller one.");
                event.target.value = "";
                setPreview(undefined);
              }
            }}
            className="block w-full text-sm text-green-900/70 file:mr-3 file:rounded-full file:border-0 file:bg-pink-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pink-600 hover:file:bg-pink-500/20"
          />
          <p className="mt-1 text-xs text-green-900/50">JPG, PNG, WebP or GIF, up to 4 MB.</p>
          {hasUploadedPhoto && !preview && (
            <label className="mt-2 flex items-center gap-2 text-sm text-green-900/70">
              <input type="checkbox" name="keep_photo" defaultChecked />
              Keep the current photo
            </label>
          )}
          {preview && (
            // A local preview of the chosen file, not a remote image.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview of your photo" className="mt-3 max-h-40 rounded-2xl" />
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="video_url" className={labelClass}>
            Video link {optional}
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            maxLength={1000}
            defaultValue={initial?.video_url ?? ""}
            placeholder="A YouTube or Vimeo link"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reference_id" className={labelClass}>
            Repost: reference another post {optional}
          </label>
          <input
            id="reference_id"
            name="reference_id"
            inputMode="numeric"
            pattern="#?[0-9]+"
            defaultValue={initial?.reference_id ?? ""}
            placeholder="Post number, e.g. 12"
            className={`${inputClass} sm:max-w-xs`}
          />
          <p className="mt-1 text-xs text-green-900/50">
            The post number is shown at the top of every post.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-bisque-50 transition-all hover:bg-green-800 hover:shadow-md disabled:opacity-50"
        >
          {pending && <Spinner />}
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href={cancelHref} className="text-sm font-medium text-green-800 hover:text-pink-600">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}
