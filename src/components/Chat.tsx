"use client";

import { useEffect, useRef, useState } from "react";

import { scenarios, type Scenario } from "@/data/scenarios";

type Turn = {
  role: "user" | "assistant";
  content: string;
  /** The learner's own voice note, kept so they can listen back. */
  audioUrl?: string;
};

type Reply = { yoruba: string; english: string; tip: string; error: string };

const MAX_CHARS = 1000;
const MAX_RECORDING_SECONDS = 60;

/**
 * Split a reply like "YO: ...\nEN: ...\nTIP: ..." into its fields. Runs on
 * every streamed chunk, so it has to cope with half-written lines. Text with
 * no prefix (if the model skips the format) is treated as Yorùbá.
 */
function parseReply(text: string): Reply {
  const reply: Reply = { yoruba: "", english: "", tip: "", error: "" };
  const fields = { YO: "yoruba", EN: "english", TIP: "tip", ERR: "error" } as const;
  let current: keyof Reply = "yoruba";

  for (const line of text.split("\n")) {
    const match = line.match(/^(YO|EN|TIP|ERR):\s?(.*)$/);
    if (match) {
      current = fields[match[1] as keyof typeof fields];
      reply[current] = match[2];
    } else if (line.trim()) {
      reply[current] += (reply[current] ? " " : "") + line.trim();
    }
  }
  return reply;
}

async function errorFrom(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.error === "string") return body.error;
  } catch {}
  return fallback;
}

export function Chat() {
  const [scenario, setScenario] = useState<Scenario | null>(null);

  if (!scenario) {
    return <ScenarioPicker onPick={setScenario} />;
  }
  // key resets the conversation state whenever the scenario changes.
  return (
    <Conversation
      key={scenario.id}
      scenario={scenario}
      onExit={() => setScenario(null)}
    />
  );
}

function ScenarioPicker({ onPick }: { onPick: (scenario: Scenario) => void }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {scenarios.map((scenario) => (
        <li key={scenario.id}>
          <button
            type="button"
            onClick={() => onPick(scenario)}
            className="group flex h-full w-full flex-col rounded-3xl border border-green-900/10 bg-white/70 p-7 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="font-display text-2xl font-semibold text-green-950">
              {scenario.title}
            </h2>
            <p className="font-display text-lg text-pink-600">
              {scenario.yorubaTitle}
            </p>
            <p className="mt-3 flex-1 text-sm leading-7 text-green-900/70">
              {scenario.summary}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-800 group-hover:text-pink-600">
              Start talking
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Records a voice note with the browser's MediaRecorder. The browser picks
 * the format (WebM in Chrome, MP4 in Safari); ElevenLabs accepts both.
 */
function useRecorder(onDone: (audio: Blob) => void) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  // Always call the latest onDone, without restarting the recorder.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // Count up while recording, and stop automatically at the limit.
  useEffect(() => {
    if (!recording) return;
    const started = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setSeconds(elapsed);
      if (elapsed >= MAX_RECORDING_SECONDS) recorderRef.current?.stop();
    }, 250);
    return () => clearInterval(timer);
  }, [recording]);

  // Release the microphone if the learner leaves mid-recording.
  useEffect(() => () => recorderRef.current?.stop(), []);

  async function start() {
    // Throws if the learner blocks the microphone; the caller shows why.
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop()); // mic light off
      setRecording(false);
      const audio = new Blob(chunks, { type: recorder.mimeType });
      if (audio.size > 0) onDoneRef.current(audio);
    };

    recorderRef.current = recorder;
    recorder.start();
    setSeconds(0);
    setRecording(true);
  }

  function stop() {
    recorderRef.current?.stop();
  }

  return { recording, seconds, start, stop };
}

function Conversation({
  scenario,
  onExit,
}: {
  scenario: Scenario;
  onExit: () => void;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [draftAudio, setDraftAudio] = useState<string>();
  const [streaming, setStreaming] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState("");
  /** Index of the reply that should start playing by itself. */
  const [autoPlayIndex, setAutoPlayIndex] = useState<number>();
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const recorder = useRecorder(async (audio) => {
    setTranscribing(true);
    setError("");
    setDraftAudio(URL.createObjectURL(audio));
    try {
      const form = new FormData();
      form.append("audio", audio);
      const response = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!response.ok) {
        throw new Error(await errorFrom(response, "Couldn't hear that. Try again."));
      }
      const { text } = await response.json();
      if (!text) {
        setError("Ìjíròrò didn't catch any words. Try recording again, a little closer to the mic.");
      }
      setDraft(text);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't hear that. Try again.");
    } finally {
      setTranscribing(false);
    }
  });

  // Stop any reply still streaming if the learner leaves the page.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns]);

  async function toggleRecording() {
    if (recorder.recording) {
      recorder.stop();
      return;
    }
    try {
      await recorder.start();
    } catch {
      setError(
        "Ìjíròrò needs your microphone. Allow it in your browser's address bar, or type instead.",
      );
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text || streaming || transcribing || recorder.recording) return;

    const userTurn: Turn = { role: "user", content: text, audioUrl: draftAudio };
    const history: Turn[] = [...turns, userTurn];
    setTurns([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setDraftAudio(undefined);
    setError("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Writes the reply so far into the last (assistant) turn.
    const showReply = (content: string) =>
      setTurns((current) => [
        ...current.slice(0, -1),
        { role: "assistant", content },
      ]);

    let reply = "";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only the words go to the API, never the recordings.
        body: JSON.stringify({
          scenario: scenario.id,
          turns: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Read the streamed text chunk by chunk as Claude writes it.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        showReply(reply);
      }
    } catch (caught) {
      if (controller.signal.aborted) return;
      console.error(caught);
      reply += "\nERR: Couldn't reach Ìjíròrò. Check your connection and try again.";
    } finally {
      setStreaming(false);
    }

    // A failed turn can't be continued from (the API needs user/assistant to
    // alternate), so drop both halves and put the learner's message back in
    // the box to resend.
    const failure = parseReply(reply).error;
    if (failure) {
      setTurns(history.slice(0, -1));
      setDraft(text);
      setDraftAudio(userTurn.audioUrl);
      setError(failure);
      return;
    }

    // The reply is complete: speak it.
    setAutoPlayIndex(history.length);
  }

  const busy = streaming || transcribing;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold text-green-950">
            {scenario.title}
          </p>
          <p className="text-sm text-green-900/60">{scenario.summary}</p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="shrink-0 rounded-full border border-green-900/15 px-4 py-2 text-sm font-medium text-green-800 transition-colors hover:border-pink-600 hover:text-pink-600"
        >
          Change scenario
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-green-900/10 bg-white shadow-xl">
        <div
          className="max-h-[60vh] min-h-80 space-y-5 overflow-y-auto p-6 sm:p-8"
          aria-live="polite"
        >
          <PartnerBubble
            reply={{
              yoruba: scenario.opener.yoruba,
              english: scenario.opener.english,
              tip: "",
              error: "",
            }}
          />

          {turns.map((turn, index) =>
            turn.role === "user" ? (
              <LearnerBubble key={index} text={turn.content} audioUrl={turn.audioUrl} />
            ) : (
              <PartnerBubble
                key={index}
                reply={parseReply(turn.content)}
                pending={streaming && index === turns.length - 1}
                autoPlay={index === autoPlayIndex}
              />
            ),
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
          className="border-t border-green-900/10 p-4 sm:p-5"
        >
          {error && (
            <p role="alert" className="mb-3 rounded-2xl border border-pink-600/30 px-4 py-3 text-sm text-pink-700">
              {error}
            </p>
          )}

          {draftAudio && draft && !transcribing && (
            <p className="mb-2 px-1 text-xs text-green-900/60">
              Here&apos;s what Ìjíròrò heard. Fix anything it got wrong, then send.
            </p>
          )}

          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={busy}
              aria-label={recorder.recording ? "Stop recording" : "Record a voice note"}
              className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                recorder.recording
                  ? "animate-pulse bg-pink-600 text-white"
                  : "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20"
              }`}
            >
              {recorder.recording ? <StopIcon /> : <MicIcon />}
            </button>

            <label htmlFor="message" className="sr-only">
              Your reply in Yorùbá
            </label>
            {recorder.recording ? (
              <p className="flex-1 px-4 py-3 text-sm text-pink-700">
                Recording… {recorder.seconds}s (tap ■ when you&apos;re done)
              </p>
            ) : (
              <textarea
                id="message"
                rows={2}
                value={transcribing ? "Listening to your voice note…" : draft}
                readOnly={transcribing}
                maxLength={MAX_CHARS}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  // Enter sends; Shift+Enter makes a new line.
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="Tap the mic and speak — or type if you prefer"
                className="flex-1 resize-none rounded-2xl border border-green-900/15 bg-bisque-50/60 px-4 py-3 text-base text-green-950 placeholder:text-green-900/40 focus:border-green-700 focus:outline-none"
              />
            )}

            <button
              type="submit"
              disabled={busy || recorder.recording || !draft.trim()}
              className="rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-bisque-50 transition-all hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {streaming ? "…" : "Send"}
            </button>
          </div>
          <p className="mt-2 px-1 text-xs text-green-900/50">
            Speak in Yorùbá, or say it in English if you&apos;re stuck. No tone
            marks when typing? That&apos;s fine too.
          </p>
        </form>
      </div>
    </div>
  );
}

/**
 * Plays a line in Ìjíròrò's voice. The audio is only made (and paid for)
 * the first time someone presses play, then reused.
 */
function VoiceNote({ text, autoPlay }: { text: string; autoPlay?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  async function play() {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }
    try {
      if (!audioRef.current) {
        setState("loading");
        const response = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error(await errorFrom(response, ""));
        urlRef.current = URL.createObjectURL(await response.blob());
        audioRef.current = new Audio(urlRef.current);
        audioRef.current.onended = () => setState("idle");
      }
      audioRef.current.currentTime = 0;
      setState("playing");
      await audioRef.current.play();
    } catch (caught) {
      console.error("[voice]", caught);
      setState("error");
    }
  }

  // Speak new replies as soon as they arrive.
  const autoPlayed = useRef(false);
  useEffect(() => {
    if (autoPlay && !autoPlayed.current) {
      autoPlayed.current = true;
      play();
    }
    // play is recreated each render; this should only run when autoPlay flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  return (
    <button
      type="button"
      onClick={play}
      disabled={state === "loading"}
      className="inline-flex items-center gap-2 rounded-full bg-bisque-50/15 px-3 py-1.5 text-xs font-semibold text-bisque-50 transition-colors hover:bg-bisque-50/25 disabled:opacity-60"
    >
      {state === "playing" ? <StopIcon small /> : <PlayIcon />}
      {state === "loading"
        ? "Loading voice…"
        : state === "playing"
          ? "Playing"
          : state === "error"
            ? "Voice unavailable — retry"
            : "Listen"}
    </button>
  );
}

function PartnerBubble({
  reply,
  pending,
  autoPlay,
}: {
  reply: Reply;
  pending?: boolean;
  autoPlay?: boolean;
}) {
  return (
    <div className="max-w-[88%] space-y-2">
      <div className="rounded-2xl rounded-tl-sm bg-green-700 px-5 py-4 text-bisque-50">
        {reply.yoruba && !pending && (
          <div className="mb-3">
            <VoiceNote text={reply.yoruba} autoPlay={autoPlay} />
          </div>
        )}
        <p className="font-display text-lg">
          {reply.yoruba || (pending ? <span className="animate-pulse">…</span> : null)}
        </p>
        {reply.english && (
          <p className="mt-2 text-sm text-bisque-50/70">{reply.english}</p>
        )}
      </div>

      {reply.tip && (
        <p className="rounded-2xl bg-pink-500/10 px-4 py-3 text-sm leading-6 text-green-950">
          <span className="font-semibold text-pink-600">Tip · </span>
          {reply.tip}
        </p>
      )}
    </div>
  );
}

function LearnerBubble({ text, audioUrl }: { text: string; audioUrl?: string }) {
  return (
    <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-pink-500/10 px-5 py-4 text-green-950">
      {audioUrl && (
        <audio controls src={audioUrl} className="mb-2 h-9 w-full max-w-64">
          Your voice note
        </audio>
      )}
      <p className="font-display text-lg whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function MicIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

function StopIcon({ small }: { small?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={small ? "size-3" : "size-4"} fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-3" fill="currentColor">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}
