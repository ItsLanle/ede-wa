import type { Metadata } from "next";

import { PostForm } from "@/components/forum/PostForm";
import { SiteShell } from "@/components/SiteShell";
import { parseId } from "@/lib/forum";

import { createPost } from "../actions";

export const metadata: Metadata = { title: "New post — Ọ̀rọ̀ Wa" };

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  // "Repost" buttons link here with ?ref=<post id> to fill in the reference.
  const reference = parseId((await searchParams).ref);

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
          Ọ̀rọ̀ Wa · New post
        </p>
        <h1 className="mt-4 mb-10 font-display text-4xl font-semibold tracking-tight text-green-950">
          {reference ? `Repost #${reference}` : "Start a conversation"}
        </h1>
        <PostForm
          action={createPost}
          initial={{ reference_id: reference }}
          submitLabel="Post"
          cancelHref={reference ? `/oro-wa/${reference}` : "/oro-wa"}
        />
      </div>
    </SiteShell>
  );
}
