/**
 * Conversation scenarios for Ìjíròrò, the AI conversation partner.
 *
 * The opener is fixed text rather than generated, so the first line is
 * instant, free, and something a native speaker can review once.
 * TODO: native-speaker review of every opener (see lessons.ts note).
 */
export type Scenario = {
  id: string;
  title: string;
  yorubaTitle: string;
  summary: string;
  /** Who Ìjíròrò plays and what the situation is. Sent to the model only. */
  brief: string;
  opener: { yoruba: string; english: string };
};

export const scenarios: Scenario[] = [
  {
    id: "elder",
    title: "Greeting an elder",
    yorubaTitle: "Kíkí àgbà",
    summary: "Visit an aunty from your parents' town and greet her properly.",
    brief:
      "You are Ìyá Bùkọ́lá, a warm woman in her seventies, an old friend of the learner's parents. The learner has come to visit you at home. You care a lot about respectful greetings: you notice and gently appreciate when they use the respectful Ẹ forms, and ask about their parents, their health and their journey.",
    opener: {
      yoruba: "Ọmọ mi, o káàbọ̀! Ṣé àlàáfíà ni?",
      english: "My child, welcome! Are you well?",
    },
  },
  {
    id: "market",
    title: "At the market",
    yorubaTitle: "Ní ọjà",
    summary: "Buy tomatoes and peppers, and try to get a better price.",
    brief:
      "You are Màmá Ìyábọ̀, a friendly, quick-witted trader selling tomatoes, peppers and onions at a busy market. The learner is a customer. Quote prices in naira, expect some haggling and enjoy it, but don't give in too easily. Keep the numbers simple.",
    opener: {
      yoruba: "Ẹ káàbọ̀! Kí lẹ fẹ́ rà?",
      english: "Welcome! What would you like to buy?",
    },
  },
  {
    id: "cousin",
    title: "Catching up with a cousin",
    yorubaTitle: "Ìbátan",
    summary: "Casual chat with a cousin you haven't seen in a while.",
    brief:
      "You are Túndé, the learner's cousin, about the same age, relaxed and teasing in a friendly way. You haven't seen each other for a long time. Use casual, everyday Yorùbá (no Ẹ forms needed between you) and ask about their life abroad, work and family.",
    opener: {
      yoruba: "Báwo ni! Ó pẹ́ o!",
      english: "Hey! It's been a while!",
    },
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}
