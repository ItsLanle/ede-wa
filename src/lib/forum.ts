import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Data for Ọ̀rọ̀ Wa, the community forum. Server-only: it uses the Supabase
 * secret key, which must never reach the browser. Tables: supabase/schema.sql.
 */

export type Post = {
  id: number;
  created_at: string;
  title: string;
  content: string | null;
  image_url: string | null;
  upvotes: number;
};

export type Comment = {
  id: number;
  post_id: number;
  created_at: string;
  body: string;
};

export type Sort = "new" | "top";

/** Columns that are safe to show. Never select `secret` for display. */
const POST_COLUMNS = "id, created_at, title, content, image_url, upvotes";

export function db() {
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  // Accept the URL with or without the "/rest/v1/" ending Supabase shows on
  // some screens; the client wants just https://<project>.supabase.co
  const url = process.env.SUPABASE_URL?.trim().replace(/\/(rest\/v1)?\/?$/, "");
  if (!url || !key) {
    throw new Error("Add SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function listPosts(sort: Sort, query: string) {
  let request = db()
    .from("forum_posts")
    .select("id, created_at, title, upvotes")
    .order(sort === "top" ? "upvotes" : "created_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  if (query) {
    // Escape % and _ so they're searched for literally.
    request = request.ilike("title", `%${query.replace(/[\\%_]/g, "\\$&")}%`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data as Pick<Post, "id" | "created_at" | "title" | "upvotes">[];
}

export async function getPost(id: number) {
  const { data, error } = await db()
    .from("forum_posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Post | null;
}

export async function getComments(postId: number) {
  const { data, error } = await db()
    .from("forum_comments")
    .select("id, post_id, created_at, body")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Comment[];
}

/** The cookie that proves this browser wrote the post. */
export function ownerCookie(id: number) {
  return `oro-wa-post-${id}`;
}

/** True if the current visitor created this post. */
export async function isOwner(id: number) {
  const secret = (await cookies()).get(ownerCookie(id))?.value;
  if (!secret) return false;

  const { data } = await db()
    .from("forum_posts")
    .select("id")
    .eq("id", id)
    .eq("secret", secret)
    .maybeSingle();
  return Boolean(data);
}

/** Parses a post id from the URL; null if it isn't a positive whole number. */
export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/** "5 minutes ago", "2 days ago"… */
export function timeAgo(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
