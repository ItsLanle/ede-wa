import { type Syllable, words } from "@/data/words";

export type Phrase = {
  yoruba: string;
  meaning: string;
  syllables: Syllable[];
  note?: string;
  /** Native-speaker recording in public/audio/. Leave out until recorded. */
  audio?: string;
};

export type Lesson = {
  slug: string;
  title: string;
  yorubaTitle: string;
  summary: string;
  intro: string;
  phrases: Phrase[];
  culture: string;
};

/** Reuse entries from the word-of-the-day list so each word lives in one place. */
function fromWords(...names: string[]): Phrase[] {
  return names.map((name) => {
    const word = words.find((w) => w.word === name);
    if (!word) throw new Error(`Lesson refers to unknown word "${name}"`);
    return {
      yoruba: word.word,
      meaning: word.meaning,
      syllables: word.syllables,
      audio: word.audio?.word,
    };
  });
}

export const lessons: Lesson[] = [
  {
    slug: "greetings",
    title: "Greetings",
    yorubaTitle: "Ìkíni",
    summary: "Greet anyone, any time of day — and greet elders the right way.",
    intro:
      "Greetings carry real weight in Yorùbá. Skipping one can come across as rude, and how you greet shows respect. Starting with Ẹ marks the greeting as respectful, for an elder or for more than one person.",
    phrases: [
      {
        yoruba: "Ẹ káàárọ̀",
        meaning: "Good morning",
        syllables: [
          { text: "ẹ", tone: "mid" },
          { text: "ká", tone: "high" },
          { text: "à", tone: "low" },
          { text: "á", tone: "high" },
          { text: "rọ̀", tone: "low" },
        ],
        note: "To a friend or someone younger, drop the Ẹ: Káàárọ̀.",
      },
      {
        yoruba: "Ẹ káàsán",
        meaning: "Good afternoon",
        syllables: [
          { text: "ẹ", tone: "mid" },
          { text: "ká", tone: "high" },
          { text: "à", tone: "low" },
          { text: "sán", tone: "high" },
        ],
      },
      {
        yoruba: "Ẹ kúùrọ̀lẹ́",
        meaning: "Good evening",
        syllables: [
          { text: "ẹ", tone: "mid" },
          { text: "kú", tone: "high" },
          { text: "ù", tone: "low" },
          { text: "rọ̀", tone: "low" },
          { text: "lẹ́", tone: "high" },
        ],
      },
      {
        yoruba: "Báwo ni?",
        meaning: "How are you?",
        syllables: [
          { text: "bá", tone: "high" },
          { text: "wo", tone: "mid" },
          { text: "ni", tone: "mid" },
        ],
      },
      {
        yoruba: "Dáadáa ni.",
        meaning: "I'm fine.",
        syllables: [
          { text: "dá", tone: "high" },
          { text: "a", tone: "mid" },
          { text: "dá", tone: "high" },
          { text: "a", tone: "mid" },
          { text: "ni", tone: "mid" },
        ],
      },
      {
        yoruba: "Ó dàbọ̀",
        meaning: "Goodbye",
        syllables: [
          { text: "ó", tone: "high" },
          { text: "dà", tone: "low" },
          { text: "bọ̀", tone: "low" },
        ],
      },
    ],
    culture:
      "The younger person greets first. Traditionally, men and boys prostrate (dọ̀bálẹ̀) and women and girls kneel (kúnlẹ̀) to greet elders — even a small bow or bend of the knee shows you were raised well.",
  },
  {
    slug: "family",
    title: "Family",
    yorubaTitle: "Ẹbí",
    summary: "Name the people closest to you — by age, not just by gender.",
    intro:
      "Family words are the first ones most of us heard at home. Yorùbá sorts siblings by age rather than by gender, which tells you a lot about how much age and respect matter.",
    phrases: [
      ...fromWords("Ìyá", "Bàbá", "Ẹ̀gbọ́n"),
      {
        yoruba: "Àbúrò",
        meaning: "younger sibling",
        syllables: [
          { text: "à", tone: "low" },
          { text: "bú", tone: "high" },
          { text: "rò", tone: "low" },
        ],
      },
      {
        yoruba: "Ọmọ",
        meaning: "child",
        syllables: [
          { text: "ọ", tone: "mid" },
          { text: "mọ", tone: "mid" },
        ],
      },
    ],
    culture:
      "There is no single word for 'brother' or 'sister'. You say ẹ̀gbọ́n (older) or àbúrò (younger), and add ọkùnrin (male) or obìnrin (female) only if you need to. Many families also avoid calling an older sibling by their first name.",
  },
  {
    slug: "market",
    title: "At the market",
    yorubaTitle: "Ní ọjà",
    summary: "Ask the price, push back politely, and say thank you.",
    intro:
      "The market is where Yorùbá is spoken fast and with feeling. A few phrases go a long way — and buying in Yorùbá often gets you a better price.",
    phrases: [
      ...fromWords("Ọjà"),
      {
        yoruba: "Owó",
        meaning: "money",
        syllables: [
          { text: "o", tone: "mid" },
          { text: "wó", tone: "high" },
        ],
      },
      {
        yoruba: "Èló ni?",
        meaning: "How much is it?",
        syllables: [
          { text: "è", tone: "low" },
          { text: "ló", tone: "high" },
          { text: "ni", tone: "mid" },
        ],
      },
      {
        yoruba: "Ó wọ́n jù.",
        meaning: "It's too expensive.",
        syllables: [
          { text: "ó", tone: "high" },
          { text: "wọ́n", tone: "high" },
          { text: "jù", tone: "low" },
        ],
      },
      {
        yoruba: "Ẹ jọ̀ọ́",
        meaning: "Please",
        syllables: [
          { text: "ẹ", tone: "mid" },
          { text: "jọ̀", tone: "low" },
          { text: "ọ́", tone: "high" },
        ],
      },
      ...fromWords("Ẹ ṣé"),
    ],
    culture:
      "Haggling is expected, not rude. Keep it warm: smile, use Ẹ jọ̀ọ́, and treat the first price as the start of a conversation.",
  },
];

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}
