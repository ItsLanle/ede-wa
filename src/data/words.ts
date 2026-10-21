export type Tone = "high" | "mid" | "low";

export type Word = {
  word: string;
  /** Rough English sound guide; capitals mark high-tone syllables. */
  pronunciation: string;
  syllables: { text: string; tone: Tone }[];
  partOfSpeech: "noun" | "verb" | "phrase";
  meaning: string;
  example: string;
  exampleMeaning: string;
};

export const words: Word[] = [
  {
    word: "Ìyá",
    pronunciation: "ee-YAH",
    syllables: [
      { text: "ì", tone: "low" },
      { text: "yá", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "mother",
    example: "Ìyá mi ni.",
    exampleMeaning: "She is my mother.",
  },
  {
    word: "Bàbá",
    pronunciation: "bah-BAH",
    syllables: [
      { text: "bà", tone: "low" },
      { text: "bá", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "father",
    example: "Bàbá mi ni.",
    exampleMeaning: "He is my father.",
  },
  {
    word: "Omi",
    pronunciation: "oh-mee",
    syllables: [
      { text: "o", tone: "mid" },
      { text: "mi", tone: "mid" },
    ],
    partOfSpeech: "noun",
    meaning: "water",
    example: "Mo fẹ́ omi.",
    exampleMeaning: "I want water.",
  },
  {
    word: "Ilé",
    pronunciation: "ee-LAY",
    syllables: [
      { text: "i", tone: "mid" },
      { text: "lé", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "house, home",
    example: "Mo ń lọ sí ilé.",
    exampleMeaning: "I am going home.",
  },
  {
    word: "Oúnjẹ",
    pronunciation: "oh-OON-jeh",
    syllables: [
      { text: "o", tone: "mid" },
      { text: "ú", tone: "high" },
      { text: "njẹ", tone: "mid" },
    ],
    partOfSpeech: "noun",
    meaning: "food",
    example: "Oúnjẹ yìí dùn.",
    exampleMeaning: "This food is delicious.",
  },
  {
    word: "Ọjà",
    pronunciation: "aw-jah",
    syllables: [
      { text: "ọ", tone: "mid" },
      { text: "jà", tone: "low" },
    ],
    partOfSpeech: "noun",
    meaning: "market",
    example: "Mo ń lọ sí ọjà.",
    exampleMeaning: "I am going to the market.",
  },
  {
    word: "Ọ̀rẹ́",
    pronunciation: "aw-REH",
    syllables: [
      { text: "ọ̀", tone: "low" },
      { text: "rẹ́", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "friend",
    example: "Ọ̀rẹ́ mi ni.",
    exampleMeaning: "She is my friend.",
  },
  {
    word: "Ẹ̀gbọ́n",
    pronunciation: "eh-GBAWN",
    syllables: [
      { text: "ẹ̀", tone: "low" },
      { text: "gbọ́n", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "older sibling",
    example: "Ẹ̀gbọ́n mi ni.",
    exampleMeaning: "He is my older brother.",
  },
  {
    word: "Ìwé",
    pronunciation: "ee-WAY",
    syllables: [
      { text: "ì", tone: "low" },
      { text: "wé", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "book",
    example: "Mo ń ka ìwé.",
    exampleMeaning: "I am reading a book.",
  },
  {
    word: "Ẹ ṣé",
    pronunciation: "eh-SHAY",
    syllables: [
      { text: "ẹ", tone: "mid" },
      { text: "ṣé", tone: "high" },
    ],
    partOfSpeech: "phrase",
    meaning: "thank you (to an elder, or to more than one person)",
    example: "Ẹ ṣé gan-an.",
    exampleMeaning: "Thank you very much.",
  },
  {
    word: "Ṣíbí",
    pronunciation: "SHEE-BEE",
    syllables: [
      { text: "ṣí", tone: "high" },
      { text: "bí", tone: "high" },
    ],
    partOfSpeech: "noun",
    meaning: "spoon",
    example: "Ṣíbí mi ni.",
    exampleMeaning: "It's my spoon.",
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const LAUNCH_DATE = dayNumber(new Date("2026-10-21T00:00:00Z"));

/** Days since the Unix epoch, in UTC, so everyone shares the same word. */
function dayNumber(date: Date) {
  return Math.floor(date.getTime() / DAY_MS);
}

/** Days since launch, never negative. Words play in list order, so new words go at the end. */
function daysSinceLaunch(date: Date) {
  return Math.max(0, dayNumber(date) - LAUNCH_DATE);
}

export function getWordOfTheDay(date = new Date()) {
  return words[daysSinceLaunch(date) % words.length];
}

/** The words from the days before `date` (back to launch), most recent first. */
export function getPreviousWords(count: number, date = new Date()) {
  const today = daysSinceLaunch(date);
  return Array.from(
    { length: Math.min(count, today, words.length - 1) },
    (_, i) => words[(today - 1 - i) % words.length],
  );
}
