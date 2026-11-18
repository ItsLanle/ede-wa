import type { Metadata } from "next";

import { PostForm } from "@/components/forum/PostForm";
import { SiteShell } from "@/components/SiteShell";

import { createPost } from "../actions";

export const metadata: Metadata = { title: "New post — Ọ̀rọ̀ Wa" };

export default function NewPostPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
          Ọ̀rọ̀ Wa · New post
        </p>
        <h1 className="mt-4 mb-10 font-display text-4xl font-semibold tracking-tight text-green-950">
          Start a conversation
        </h1>
        <PostForm action={createPost} submitLabel="Post" cancelHref="/oro-wa" />
      </div>
    </SiteShell>
  );
}
