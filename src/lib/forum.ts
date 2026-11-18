import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Data for Ọ̀rọ̀ Wa, the community forum. Server-only: it uses the Supabase
 * secret key, which must never reach the browser. Tables: supabase/schema.sql.
 */

import { type Flag } from "./flags";

export { FLAGS, isFlag, type Flag } from "./flags";

export type Post = {
  id: number;
  created_at: string;
  title: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  flag: Flag | null;
  reference_id: number | null;
  upvotes: number;
  author: string | null;
};

export type Comment = {
  id: number;
  post_id: number;
  created_at: string;
  body: string;
  author: string | null;
};

export type Sort = "new" | "top";

/** Columns that are safe to show. Never select `secret` for display. */
const POST_COLUMNS =
  "id, created_at, title, content, image_url, video_url, flag, reference_id, upvotes, author";

export const IMAGE_BUCKET = "forum-images";

function supabaseUrl() {
  // Accept the URL with or without the "/rest/v1/" ending Supabase shows on
  // some screens; the client wants just https://<project>.supabase.co
  return process.env.SUPABASE_URL?.trim().replace(/\/(rest\/v1)?\/?$/, "");
}

export function db() {
  const url = supabaseUrl();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    throw new Error("Add SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function listPosts({
  sort,
  query,
  flag,
}: {
  sort: Sort;
  query: string;
  flag: Flag | null;
}) {
  let request = db()
    .from("forum_posts")
    .select(POST_COLUMNS)
    .order(sort === "top" ? "upvotes" : "created_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  if (query) {
    // Escape % and _ so they're searched for literally.
    request = request.ilike("title", `%${query.replace(/[\\%_]/g, "\\$&")}%`);
  }
  if (flag) request = request.eq("flag", flag);

  const { data, error } = await request;
  if (error) throw error;
  return data as Post[];
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
    .select("id, post_id, created_at, body, author")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Comment[];
}

// ─── Pseudo-authentication ────────────────────────────────────────────────
//
// On a visitor's first visit, src/proxy.ts gives them a random secret user
// ID in a cookie. Posts and comments store only a fingerprint (hash) of it,
// so the public handle shown on the page ("Learner #3f9a2c") can't be used
// to pretend to be someone else.

export const USER_COOKIE = "oro-wa-user";

/** Turns a secret user ID into the fingerprint stored on posts. */
export function fingerprint(userId: string) {
  return createHash("sha256").update(userId).digest("hex");
}

/** The current visitor's fingerprint, or null if they have no ID yet. */
export async function currentAuthor() {
  const userId = (await cookies()).get(USER_COOKIE)?.value;
  return userId ? fingerprint(userId) : null;
}

/** The public name shown on posts and comments. */
export function handle(author: string | null) {
  return author ? `Learner #${author.slice(0, 6)}` : "A learner";
}

/** The cookie early posts (before user IDs) used to prove authorship. */
export function ownerCookie(id: number) {
  return `oro-wa-post-${id}`;
}

/** True if the current visitor wrote this post. */
export async function isOwner(id: number) {
  const store = await cookies();
  const userId = store.get(USER_COOKIE)?.value;
  const legacySecret = store.get(ownerCookie(id))?.value;
  if (!userId && !legacySecret) return false;

  const { data } = await db()
    .from("forum_posts")
    .select("author, secret")
    .eq("id", id)
    .maybeSingle();
  if (!data) return false;

  return (
    (userId !== undefined && data.author === fingerprint(userId)) ||
    (legacySecret !== undefined && data.secret === legacySecret)
  );
}

// ─── Media ───────────────────────────────────────────────────────────────

/**
 * Turns a video link into something the post page can play: a YouTube or
 * Vimeo embed, or a direct video file. Null if it isn't a supported link.
 */
export function videoEmbed(link: string): { kind: "iframe" | "file"; src: string } | null {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const youtubeId =
    host === "youtu.be"
      ? url.pathname.slice(1)
      : host === "youtube.com"
        ? url.searchParams.get("v") ??
          url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]
        : null;
  if (youtubeId && /^[\w-]{6,20}$/.test(youtubeId)) {
    return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${youtubeId}` };
  }

  const vimeoId = host === "vimeo.com" ? url.pathname.match(/^\/(\d+)/)?.[1] : null;
  if (vimeoId) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeoId}` };

  if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) return { kind: "file", src: url.href };

  return null;
}

/** The storage path of an uploaded image, or null for outside links. */
export function uploadedImagePath(imageUrl: string | null) {
  const prefix = `${supabaseUrl()}/storage/v1/object/public/${IMAGE_BUCKET}/`;
  return imageUrl?.startsWith(prefix) ? imageUrl.slice(prefix.length) : null;
}

/** Parses a post id from the URL; null if it isn't a positive whole number. */
export function parseId(value: unknown): number | null {
  const id = Number(String(value ?? "").replace(/^#/, "").trim());
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
