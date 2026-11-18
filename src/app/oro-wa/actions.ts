"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db, isOwner, ownerCookie } from "@/lib/forum";

/**
 * Server actions for Ọ̀rọ̀ Wa. Forms call these directly; they run on the
 * server, so they can use the database key and set cookies.
 */

export type FormState = { error?: string };

type PostFields = { title: string; content: string | null; image_url: string | null };

/** Checks the form; returns the clean fields or an error to show. */
function readPostForm(form: FormData): PostFields | { error: string } {
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  const image = String(form.get("image_url") ?? "").trim();

  if (!title) return { error: "Give your post a title." };
  if (title.length > 150) return { error: "Keep the title under 150 characters." };
  if (content.length > 5000) return { error: "Keep the post under 5,000 characters." };

  if (image) {
    let url: URL;
    try {
      url = new URL(image);
    } catch {
      return { error: "The image link doesn't look like a web address." };
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { error: "The image link should start with https://" };
    }
  }

  return { title, content: content || null, image_url: image || null };
}

export async function createPost(_: FormState, form: FormData): Promise<FormState> {
  const fields = readPostForm(form);
  if ("error" in fields) return fields;

  const secret = randomUUID();
  const { data, error } = await db()
    .from("forum_posts")
    .insert({ ...fields, secret })
    .select("id")
    .single();
  if (error) {
    console.error("[oro-wa] create", error);
    return { error: "Couldn't save your post. Try again." };
  }

  // Remember in this browser that you wrote it, so you can edit or delete it.
  (await cookies()).set(ownerCookie(data.id), secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  revalidatePath("/oro-wa");
  redirect(`/oro-wa/${data.id}`);
}

export async function updatePost(
  id: number,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  if (!(await isOwner(id))) return { error: "Only the person who wrote this post can edit it." };

  const fields = readPostForm(form);
  if ("error" in fields) return fields;

  const { error } = await db().from("forum_posts").update(fields).eq("id", id);
  if (error) {
    console.error("[oro-wa] update", error);
    return { error: "Couldn't save your changes. Try again." };
  }

  revalidatePath("/oro-wa");
  revalidatePath(`/oro-wa/${id}`);
  redirect(`/oro-wa/${id}`);
}

export async function deletePost(id: number) {
  if (!(await isOwner(id))) return;

  const { error } = await db().from("forum_posts").delete().eq("id", id);
  if (error) {
    console.error("[oro-wa] delete", error);
    return;
  }

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
  const body = String(form.get("body") ?? "").trim();
  if (!body || body.length > 1000) return;

  const { error } = await db().from("forum_comments").insert({ post_id: postId, body });
  if (error) console.error("[oro-wa] comment", error);
  revalidatePath(`/oro-wa/${postId}`);
}
