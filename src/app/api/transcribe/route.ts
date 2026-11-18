import { SpeechError, transcribe } from "@/lib/speech";

/**
 * POST /api/transcribe — the learner's voice note in, the Yorùbá text out.
 * The browser sends the recording as form data in a field called "audio".
 */

// About a minute of compressed speech; voice notes here should be short.
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  let audio: FormDataEntryValue | null;
  try {
    audio = (await request.formData()).get("audio");
  } catch {
    return Response.json({ error: "Expected form data" }, { status: 400 });
  }

  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({ error: "No recording received" }, { status: 400 });
  }
  if (audio.size > MAX_BYTES) {
    return Response.json(
      { error: "That voice note is too long. Keep it under a minute." },
      { status: 413 },
    );
  }

  try {
    return Response.json({ text: await transcribe(audio) });
  } catch (error) {
    const status = error instanceof SpeechError ? error.status : 500;
    const message =
      error instanceof SpeechError ? error.message : "Couldn't hear that. Try again.";
    if (!(error instanceof SpeechError)) console.error("[api/transcribe]", error);
    return Response.json({ error: message }, { status });
  }
}
