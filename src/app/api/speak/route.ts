import { SpeechError, synthesize } from "@/lib/speech";

/**
 * POST /api/speak — Yorùbá text in, Ìjíròrò's voice out (MP3).
 * Body: { "text": "Ẹ káàbọ̀! Kí lẹ fẹ́ rà?" }
 */

// Replies are one or two sentences. The cap stops anyone using this route to
// read out long texts on our bill (ElevenLabs charges per character).
const MAX_CHARS = 400;

export async function POST(request: Request) {
  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return Response.json({ error: "No text to speak" }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return Response.json({ error: "Text too long" }, { status: 413 });
  }

  try {
    const audio = await synthesize(text.trim());
    return new Response(audio, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (error) {
    const status = error instanceof SpeechError ? error.status : 500;
    const message =
      error instanceof SpeechError ? error.message : "Couldn't make the voice. Try again.";
    if (!(error instanceof SpeechError)) console.error("[api/speak]", error);
    return Response.json({ error: message }, { status });
  }
}
