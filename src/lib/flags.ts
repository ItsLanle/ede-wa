/** Post flags for Ọ̀rọ̀ Wa. Shared by the server and the post form. */
export const FLAGS = {
  question: { label: "Question", yoruba: "Ìbéèrè" },
  opinion: { label: "Opinion", yoruba: "Èrò" },
  proverb: { label: "Proverb", yoruba: "Òwe" },
  win: { label: "Win", yoruba: "Àṣeyọrí" },
  culture: { label: "Culture", yoruba: "Àṣà" },
} as const;

export type Flag = keyof typeof FLAGS;

export function isFlag(value: unknown): value is Flag {
  return typeof value === "string" && value in FLAGS;
}
