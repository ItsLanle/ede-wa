import Anthropic from "@anthropic-ai/sdk";

import { getScenario, type Scenario } from "@/data/scenarios";

/**
 * POST /api/chat — one turn of Ìjíròrò, streamed back as plain text.
 *
 * This runs on the server, so the API key (ANTHROPIC_API_KEY in .env.local)
 * never reaches the browser. The browser sends the scenario id and the turns
 * so far; we add the system prompt and opener, call Claude, and stream the
 * reply text back as it is written.
 *
 * Reply format (parsed by components/Chat.tsx), one field per line:
 *   YO:  the reply in Yorùbá
 *   EN:  the English translation
 *   TIP: optional gentle correction of the learner's last message
 *   ERR: added by this route if something went wrong
 */

const MAX_TURNS = 40;
const MAX_CHARS = 1000;

type Turn = { role: "user" | "assistant"; content: string };

function systemPrompt(scenario: Scenario): string {
  return `You are Ìjíròrò, a patient Yorùbá conversation partner on Èdè Wa, a site for people in the diaspora learning Yorùbá. Most learners are beginners: heritage speakers who understand a little, or adults starting from scratch. The point is to give them a judgment-free place to actually use the language.

Role-play this scenario and stay in character:
${scenario.brief}

How to reply:
- Speak standard Yorùbá with full, correct tone marks and underdots (ẹ, ọ, ṣ). Use simple, common words and short sentences: one or two sentences per turn.
- Keep the conversation moving: usually end with a question the learner can answer.
- If the learner writes in English, or mixes languages, stay in Yorùbá and use the TIP line to show how they could say it in Yorùbá.
- Learners often type without tone marks because their keyboard lacks them. That is not a mistake. When it helps, show the fully marked version in the TIP, but don't present it as an error.
- Correct gently, and only the single most useful thing: first say what they got right, then the one thing to try. Never mock or scold. Skip the TIP when there is nothing worth correcting.
- If you are not sure a word or phrase is natural Yorùbá, choose a simpler one you are sure of.

Format every reply exactly like this, with nothing before or after:
YO: <your reply in Yorùbá>
EN: <its English translation>
TIP: <optional, in English, one or two short sentences>`;
}

/**
 * Never trust what the browser sends: check the shape before it reaches the
 * API. Turns must alternate user, assistant, user... and end with the user.
 */
function isTurns(value: unknown): value is Turn[] {
  if (
    !Array.isArray(value) ||
    value.length % 2 === 0 || // odd length means it ends on a user turn
    value.length > MAX_TURNS
  ) {
    return false;
  }
  return value.every((turn: unknown, index) => {
    if (typeof turn !== "object" || turn === null) return false;
    const { role, content } = turn as Record<string, unknown>;
    const isUser = index % 2 === 0;
    return (
      role === (isUser ? "user" : "assistant") &&
      typeof content === "string" &&
      content.trim().length > 0 &&
      // Learner messages are short; replies include YO/EN/TIP lines.
      content.length <= (isUser ? MAX_CHARS : MAX_CHARS * 4)
    );
  });
}

function errorMessage(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return "The API key is missing or invalid. Check ANTHROPIC_API_KEY in .env.local.";
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "Too many messages at once. Wait a moment and try again.";
  }
  if (error instanceof Anthropic.APIError) {
    return `Ìjíròrò couldn't reply (error ${error.status ?? "unknown"}). Try again.`;
  }
  if (error instanceof Error && /api key|apiKey|authToken/i.test(error.message)) {
    return "No API key found. Add ANTHROPIC_API_KEY to .env.local and restart the dev server.";
  }
  return "Ìjíròrò couldn't reply. Try again.";
}

export async function POST(request: Request) {
  let body: { scenario?: unknown; turns?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const scenario =
    typeof body.scenario === "string" ? getScenario(body.scenario) : undefined;
  if (!scenario) {
    return Response.json({ error: "Unknown scenario" }, { status: 400 });
  }
  if (!isTurns(body.turns)) {
    return Response.json({ error: "Invalid conversation" }, { status: 400 });
  }

  // The API needs the first message to come from the user, so a short
  // stage direction comes before the fixed opener the learner already saw.
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: "(The learner arrives. Begin the scenario.)" },
    {
      role: "assistant",
      content: `YO: ${scenario.opener.yoruba}\nEN: ${scenario.opener.english}`,
    },
    ...body.turns,
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const client = new Anthropic();
        const reply = client.beta.messages.stream(
          {
            model: "claude-opus-5-5",
            max_tokens: 8000,
            // Chat turns are short; low effort keeps replies quick and cheap.
            output_config: { effort: "low" },
            // If a safety check declines a turn, the API retries it on a
            // fallback model within the same request.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: systemPrompt(scenario),
            messages,
          },
          { signal: request.signal },
        );

        for await (const event of reply) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await reply.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode("\nERR: Ìjíròrò can't continue this one. Try saying it another way."),
          );
        }
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[api/chat]", error);
          controller.enqueue(encoder.encode(`\nERR: ${errorMessage(error)}`));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
