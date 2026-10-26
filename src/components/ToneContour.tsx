import type { Syllable, Tone } from "@/data/words";

const STEP = 72;
const PAD = 36;
const TONE_Y: Record<Tone, number> = { high: 12, mid: 32, low: 52 };

/** Draws the word's melody: one dot per syllable at its pitch, joined by a line. */
export function ToneContour({ syllables }: { syllables: Syllable[] }) {
  const width = PAD * 2 + STEP * (syllables.length - 1);
  const points = syllables.map((syllable, i) => ({
    x: PAD + STEP * i,
    y: TONE_Y[syllable.tone],
    ...syllable,
  }));

  return (
    <svg
      role="img"
      aria-label={`Tones: ${syllables.map((s) => `${s.text} ${s.tone}`).join(", ")}`}
      viewBox={`0 0 ${width} 104`}
      width={width}
      className="h-auto max-w-full overflow-visible"
    >
      {(Object.keys(TONE_Y) as Tone[]).map((tone) => (
        <line
          key={tone}
          x1={0}
          x2={width}
          y1={TONE_Y[tone]}
          y2={TONE_Y[tone]}
          className="stroke-green-900/10"
          strokeDasharray="3 4"
        />
      ))}

      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-pink-500"
      />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={6} className="fill-pink-600" />
          <text
            x={p.x}
            y={80}
            textAnchor="middle"
            className="fill-green-950 font-display text-lg"
          >
            {p.text}
          </text>
          <text
            x={p.x}
            y={98}
            textAnchor="middle"
            className="fill-green-900/50 font-mono text-[11px] uppercase"
          >
            {p.tone}
          </text>
        </g>
      ))}
    </svg>
  );
}
