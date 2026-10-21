"use client";

import { useRef, useState } from "react";

const SLOW_RATE = 0.6;

/** Play a recording at normal speed or slowed down (browsers keep the pitch). */
export function AudioButtons({ src, label }: { src: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "error">("idle");

  function play(rate: number) {
    const audio = audioRef.current;
    if (!audio) return;
    // Loading a new source resets playbackRate to the default, so set both.
    audio.defaultPlaybackRate = rate;
    audio.playbackRate = rate;
    audio.currentTime = 0;
    audio.play().catch(() => setStatus("error"));
  }

  if (status === "error") {
    return <p className="text-xs text-green-900/50">Audio unavailable</p>;
  }

  const button =
    "inline-flex h-9 items-center gap-2 rounded-full border border-green-900/15 px-4 text-sm font-medium text-green-800 transition-colors hover:border-pink-500/40 hover:bg-pink-500/5 hover:text-pink-600";

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus("idle")}
        onError={() => setStatus("error")}
      />

      <button
        type="button"
        onClick={() => play(1)}
        aria-label={`Play ${label}`}
        className={button}
      >
        <SpeakerIcon />
        {status === "playing" ? "Playing…" : "Play"}
      </button>

      <button
        type="button"
        onClick={() => play(SLOW_RATE)}
        aria-label={`Play ${label} slowly`}
        className={button}
      >
        Slow
      </button>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}
