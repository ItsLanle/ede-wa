import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SubmitButton } from "@/components/forum/SubmitButton";
import { SiteShell } from "@/components/SiteShell";
import {
  FLAGS,
  currentAuthor,
  getComments,
  getPost,
  handle,
  isOwner,
  parseId,
  timeAgo,
  videoEmbed,
} from "@/lib/forum";

import { addComment, deleteComment, deletePost, upvotePost } from "../actions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseId((await params).id);
  const post = id ? await getPost(id) : null;
  return { title: post ? `${post.title} — Ọ̀rọ̀ Wa` : "Post not found — Ọ̀rọ̀ Wa" };
}

export default async function PostPage({ params }: Props) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const [post, comments, owner, me] = await Promise.all([
    getPost(id),
    getComments(id),
    isOwner(id),
    currentAuthor(),
  ]);
  if (!post) notFound();

  const referenced = post.reference_id ? await getPost(post.reference_id) : null;
  const video = post.video_url ? videoEmbed(post.video_url) : null;
  const byline = (author: string | null) =>
    `${handle(author)}${author && author === me ? " (you)" : ""}`;

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
        <Link href="/oro-wa" className="text-sm font-medium text-green-800 hover:text-pink-600">
          ← Ọ̀rọ̀ Wa
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-green-900/15 px-2.5 py-1 font-mono text-green-900/60">
            Post #{post.id}
          </span>
          {post.flag && (
            <Link
              href={`/oro-wa?flag=${post.flag}`}
              className="rounded-full bg-green-700/10 px-2.5 py-1 text-green-800 hover:text-pink-600"
            >
              {FLAGS[post.flag].label} · {FLAGS[post.flag].yoruba}
            </Link>
          )}
        </div>

        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight break-words text-green-950 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-green-900/50">
          {byline(post.author)} · <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
        </p>

        {post.reference_id && (
          <div className="mt-8 rounded-3xl border-l-4 border-pink-500 bg-white/60 p-5">
            <p className="text-xs font-semibold tracking-[0.15em] text-pink-600 uppercase">
              Reposting #{post.reference_id}
            </p>
            {referenced ? (
              <Link href={`/oro-wa/${referenced.id}`} className="group mt-2 block">
                <span className="font-display text-xl font-semibold text-green-950 group-hover:text-pink-600">
                  {referenced.title}
                </span>
                {referenced.content && (
                  <span className="mt-1 line-clamp-2 block text-sm text-green-900/70">
                    {referenced.content}
                  </span>
                )}
                <span className="mt-2 block text-xs text-green-900/50">
                  {handle(referenced.author)} · {timeAgo(referenced.created_at)} · ▲ {referenced.upvotes}
                </span>
              </Link>
            ) : (
              <p className="mt-2 text-sm text-green-900/60">That post has been deleted.</p>
            )}
          </div>
        )}

        {post.content && (
          <p className="mt-8 text-lg leading-8 break-words whitespace-pre-wrap text-green-950/85">
            {post.content}
          </p>
        )}

        {post.image_url && (
          // An outside link of any size or host, so a plain img (not next/image).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt=""
            referrerPolicy="no-referrer"
            className="mt-8 max-h-[32rem] w-full rounded-3xl border border-green-900/10 object-contain"
          />
        )}

        {video?.kind === "iframe" && (
          <iframe
            src={video.src}
            title={`Video for “${post.title}”`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="mt-8 aspect-video w-full rounded-3xl border border-green-900/10"
          />
        )}
        {video?.kind === "file" && (
          <video src={video.src} controls preload="metadata" className="mt-8 w-full rounded-3xl" />
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-green-900/10 py-5">
          <form action={upvotePost.bind(null, post.id)}>
            <SubmitButton className="rounded-full bg-pink-500/10 px-5 py-2.5 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-500/20">
              <span aria-hidden>▲</span>
              Ẹ ṣé · {post.upvotes} {post.upvotes === 1 ? "upvote" : "upvotes"}
            </SubmitButton>
          </form>

          <Link
            href={`/oro-wa/new?ref=${post.id}`}
            className="rounded-full border border-green-900/15 px-4 py-2.5 text-sm font-medium text-green-800 hover:border-pink-600 hover:text-pink-600"
          >
            ↻ Repost
          </Link>

          {owner && (
            <>
              <Link
                href={`/oro-wa/${post.id}/edit`}
                className="ml-auto rounded-full border border-green-900/15 px-4 py-2.5 text-sm font-medium text-green-800 hover:border-pink-600 hover:text-pink-600"
              >
                Edit
              </Link>
              <form action={deletePost.bind(null, post.id)}>
                <SubmitButton
                  pendingText="Deleting…"
                  className="rounded-full border border-pink-600/30 px-4 py-2.5 text-sm font-medium text-pink-700 hover:bg-pink-500/10"
                >
                  Delete
                </SubmitButton>
              </form>
            </>
          )}
        </div>

        <section aria-labelledby="comments" className="mt-10">
          <h2 id="comments" className="font-display text-2xl font-semibold text-green-950">
            Comments <span className="text-green-900/40">({comments.length})</span>
          </h2>

          <form action={addComment.bind(null, post.id)} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label htmlFor="body" className="sr-only">
              Add a comment
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={2}
              maxLength={1000}
              placeholder="Add to the conversation…"
              className="flex-1 resize-none rounded-2xl border border-green-900/15 bg-white/80 px-4 py-3 text-base text-green-950 placeholder:text-green-900/40 focus:border-green-700 focus:outline-none"
            />
            <SubmitButton
              pendingText="Posting…"
              className="justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-bisque-50 hover:bg-green-800"
            >
              Comment
            </SubmitButton>
          </form>

          {comments.length === 0 ? (
            <p className="mt-6 text-sm text-green-900/50">No comments yet. Say something kind.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-2xl border border-green-900/10 bg-white/70 px-5 py-4">
                  <p className="break-words whitespace-pre-wrap text-green-950">{comment.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-green-900/50">
                    <span>
                      {byline(comment.author)} ·{" "}
                      <time dateTime={comment.created_at}>{timeAgo(comment.created_at)}</time>
                    </span>
                    {me && comment.author === me && (
                      <form action={deleteComment.bind(null, comment.id, post.id)} className="ml-auto">
                        <SubmitButton pendingText="Deleting…" className="font-medium text-pink-700 hover:underline">
                          Delete
                        </SubmitButton>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </SiteShell>
  );
}
