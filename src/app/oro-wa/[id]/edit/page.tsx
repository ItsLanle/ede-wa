import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PostForm } from "@/components/forum/PostForm";
import { SiteShell } from "@/components/SiteShell";
import { getPost, isOwner, parseId, uploadedImagePath } from "@/lib/forum";

import { updatePost } from "../../actions";

export const metadata: Metadata = { title: "Edit post — Ọ̀rọ̀ Wa" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const post = await getPost(id);
  if (!post) notFound();
  // Only the author can edit; everyone else goes back to the post.
  if (!(await isOwner(id))) redirect(`/oro-wa/${id}`);

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
          Ọ̀rọ̀ Wa · Edit post #{id}
        </p>
        <h1 className="mt-4 mb-10 font-display text-4xl font-semibold tracking-tight text-green-950">
          Edit your post
        </h1>
        <PostForm
          action={updatePost.bind(null, id)}
          initial={post}
          hasUploadedPhoto={Boolean(uploadedImagePath(post.image_url))}
          submitLabel="Save changes"
          cancelHref={`/oro-wa/${id}`}
        />
      </div>
    </SiteShell>
  );
}
