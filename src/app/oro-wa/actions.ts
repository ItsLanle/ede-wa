"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  IMAGE_BUCKET,
  currentAuthor,
  db,
  isFlag,
  isOwner,
  ownerCookie,
  parseId,
  uploadedImagePath,
  videoEmbed,
} from "@/lib/forum";

/**
 * Server actions for Ọ̀rọ̀ Wa. Forms call these directly; they run on the
 * server, so they can use the database key and read the user's cookie.
 */

export type FormState = { error?: string };

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

type PostFields = {
  title: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  flag: string | null;
  reference_id: number | null;
};

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Checks the form and returns clean fields, or an error to show. An uploaded
 * photo isn't saved yet; it's returned so the caller can upload it last.
 */
async function readPostForm(
  form: FormData,
  editingId?: number,
): Promise<{ fields: PostFields; photo: File | null } | { error: string }> {
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  const image = String(form.get("image_url") ?? "").trim();
  const video = String(form.get("video_url") ?? "").trim();
  const flag = String(form.get("flag") ?? "");
  const reference = String(form.get("reference_id") ?? "").trim();
  const file = form.get("image_file");
  const photo = file instanceof File && file.size > 0 ? file : null;

  if (!title) return { error: "Give your post a title." };
  if (title.length > 150) return { error: "Keep the title under 150 characters." };
  if (content.length > 5000) return { error: "Keep the post under 5,000 characters." };
  if (flag && !isFlag(flag)) return { error: "Pick a flag from the list." };

  if (image && photo) {
    return { error: "Choose either an image link or a photo upload, not both." };
  }
  if (image && !isHttpUrl(image)) {
    return { error: "The image link should be a web address starting with https://" };
  }
  if (photo) {
    if (!(photo.type in IMAGE_TYPES)) return { error: "Photos must be JPG, PNG, WebP or GIF." };
    if (photo.size > MAX_IMAGE_BYTES) return { error: "That photo is over 4 MB. Try a smaller one." };
  }

  if (video && !videoEmbed(video)) {
    return { error: "Video links must be YouTube, Vimeo, or a direct .mp4 / .webm file." };
  }

  let referenceId: number | null = null;
  if (reference) {
    referenceId = parseId(reference);
    if (!referenceId) return { error: "The repost should be a post number, like 12." };
    if (referenceId === editingId) return { error: "A post can't repost itself." };
    const { data } = await db().from("forum_posts").select("id").eq("id", referenceId).maybeSingle();
    if (!data) return { error: `There's no post #${referenceId} to repost.` };
  }

  return {
    fields: {
      title,
      content: content || null,
      image_url: image || null,
      video_url: video || null,
      flag: flag || null,
      reference_id: referenceId,
    },
    photo,
  };
}

/** Saves a photo to Supabase Storage and returns its public address. */
async function uploadPhoto(photo: File): Promise<string | null> {
  const path = `${randomUUID()}.${IMAGE_TYPES[photo.type]}`;
  const storage = db().storage.from(IMAGE_BUCKET);
  const { error } = await storage.upload(path, photo, { contentType: photo.type });
  if (error) {
    console.error("[oro-wa] upload", error);
    return null;
  }
  return storage.getPublicUrl(path).data.publicUrl;
}

async function removePhoto(imageUrl: string | null) {
  const path = uploadedImagePath(imageUrl);
  if (path) await db().storage.from(IMAGE_BUCKET).remove([path]);
}

export async function createPost(_: FormState, form: FormData): Promise<FormState> {
  const author = await currentAuthor();
  if (!author) return { error: "Refresh the page and try again." };

  const result = await readPostForm(form);
  if ("error" in result) return result;
  const { fields, photo } = result;

  if (photo) {
    fields.image_url = await uploadPhoto(photo);
    if (!fields.image_url) return { error: "Couldn't upload your photo. Try again." };
  }

  const { data, error } = await db()
    .from("forum_posts")
    // `secret` is required by the original schema; authorship now uses `author`.
    .insert({ ...fields, author, secret: randomUUID() })
    .select("id")
    .single();
  if (error) {
    console.error("[oro-wa] create", error);
    await removePhoto(fields.image_url);
    return { error: "Couldn't save your post. Try again." };
  }

  revalidatePath("/oro-wa");
  redirect(`/oro-wa/${data.id}`);
}

export async function updatePost(
  id: number,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  if (!(await isOwner(id))) return { error: "Only the person who wrote this post can edit it." };

  const result = await readPostForm(form, id);
  if ("error" in result) return result;
  const { fields, photo } = result;

  const { data: before } = await db().from("forum_posts").select("image_url").eq("id", id).single();

  if (photo) {
    fields.image_url = await uploadPhoto(photo);
    if (!fields.image_url) return { error: "Couldn't upload your photo. Try again." };
  } else if (form.get("keep_photo") === "on" && uploadedImagePath(before?.image_url ?? null)) {
    // The form doesn't show uploaded photos as a link, so keep the old one.
    fields.image_url = before?.image_url ?? null;
  }

  const { error } = await db().from("forum_posts").update(fields).eq("id", id);
  if (error) {
    console.error("[oro-wa] update", error);
    return { error: "Couldn't save your changes. Try again." };
  }
  if (before && before.image_url !== fields.image_url) await removePhoto(before.image_url);

  revalidatePath("/oro-wa");
  revalidatePath(`/oro-wa/${id}`);
  redirect(`/oro-wa/${id}`);
}

export async function deletePost(id: number) {
  if (!(await isOwner(id))) return;

  const { data } = await db().from("forum_posts").select("image_url").eq("id", id).single();
  const { error } = await db().from("forum_posts").delete().eq("id", id);
  if (error) {
    console.error("[oro-wa] delete", error);
    return;
  }
  await removePhoto(data?.image_url ?? null);

  (await cookies()).delete(ownerCookie(id));
  revalidatePath("/oro-wa");
  redirect("/oro-wa");
}

export async function upvotePost(id: number) {
  const { error } = await db().rpc("forum_increment_upvotes", { post_id: id });
  if (error) console.error("[oro-wa] upvote", error);
  revalidatePath(`/oro-wa/${id}`);
  revalidatePath("/oro-wa");
}

export async function addComment(postId: number, form: FormData) {
  const author = await currentAuthor();
  const body = String(form.get("body") ?? "").trim();
  if (!author || !body || body.length > 1000) return;

  const { error } = await db().from("forum_comments").insert({ post_id: postId, body, author });
  if (error) console.error("[oro-wa] comment", error);
  revalidatePath(`/oro-wa/${postId}`);
}

export async function deleteComment(commentId: number, postId: number) {
  const author = await currentAuthor();
  if (!author) return;

  // Only deletes when the comment is theirs.
  const { error } = await db()
    .from("forum_comments")
    .delete()
    .eq("id", commentId)
    .eq("author", author);
  if (error) console.error("[oro-wa] delete comment", error);
  revalidatePath(`/oro-wa/${postId}`);
}
