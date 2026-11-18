/**
 * Speech for Ìjíròrò: turning the learner's voice into text, and Ìjíròrò's
 * replies into a voice. Server-only (it uses the ElevenLabs API key).
 *
 * Everything provider-specific lives in this one file, so if testing shows
 * another service handles Yorùbá better, only this file changes.
 *
 * Settings come from .env.local:
 *   ELEVENLABS_API_KEY    required
 *   ELEVENLABS_VOICE_ID   required: the voice Ìjíròrò speaks with
 *   ELEVENLABS_STT_MODEL  optional, default "scribe_v2"
 *   ELEVENLABS_TTS_MODEL  optional, default "eleven_v3"
 *
 * Yorùbá support (ElevenLabs docs, checked 2026-11-15):
 *   - Speech-to-text lists Yorùbá ("yor") for scribe_v2, rated "moderate"
 *     (roughly 25–50% word error rate), so learners must be able to fix the
 *     transcript before sending. scribe_v3 doesn't list Yorùbá explicitly.
 *   - Text-to-speech lists Yorùbá ("yo") only for the eleven_v3 models; the
 *     API's default model doesn't support it.
 */

const API = "https://api.elevenlabs.io/v1";

export class SpeechError extends Error {
  constructor(
    message: string,
    /** HTTP status to send back to the browser. */
    readonly status: number,
  ) {
    super(message);
  }
}

function apiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    throw new SpeechError(
      "No ElevenLabs key found. Add ELEVENLABS_API_KEY to .env.local and restart the dev server.",
      500,
    );
  }
  return key;
}

/** Turns an ElevenLabs error response into a message for the learner. */
async function failure(response: Response, what: string): Promise<SpeechError> {
  const detail = await response.text().catch(() => "");
  console.error(`[speech] ${what} failed: ${response.status} ${detail}`);
  if (response.status === 401) {
    return new SpeechError("The ElevenLabs key is missing or invalid.", 500);
  }
  if (response.status === 429) {
    return new SpeechError("Too many voice requests at once. Wait a moment and try again.", 429);
  }
  return new SpeechError(`Couldn't ${what}. Try again.`, 502);
}

/** Speech → Yorùbá text. */
export async function transcribe(audio: Blob): Promise<string> {
  const form = new FormData();
  form.append("model_id", process.env.ELEVENLABS_STT_MODEL || "scribe_v2");
  // Tell it the language rather than letting it guess: auto-detect can
  // mistake a learner's Yorùbá for another language.
  form.append("language_code", "yor");
  form.append("tag_audio_events", "false");
  form.append("file", audio, "message");

  const response = await fetch(`${API}/speech-to-text`, {
    method: "POST",
    headers: { "xi-api-key": apiKey() },
    body: form,
  });
  if (!response.ok) throw await failure(response, "hear that");

  const result: { text?: string } = await response.json();
  return (result.text ?? "").trim();
}

/** Yorùbá text → speech, as MP3 audio. */
export async function synthesize(text: string): Promise<ArrayBuffer> {
  const voice = process.env.ELEVENLABS_VOICE_ID;
  if (!voice) {
    throw new SpeechError(
      "No voice chosen. Add ELEVENLABS_VOICE_ID to .env.local and restart the dev server.",
      500,
    );
  }

  const response = await fetch(
    `${API}/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey(), "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_TTS_MODEL || "eleven_v3",
        language_code: "yo",
      }),
    },
  );
  if (!response.ok) throw await failure(response, "make the voice");

  return response.arrayBuffer();
}
