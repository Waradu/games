import type { WordleGame } from "~~/shared/types/wordle";
import { createId } from "@paralleldrive/cuid2";

export const createWordleGame = (word: string): WordleGame => {
  return {
    id: createId(),
    word,
    guesses: [],
    started: new Date()
  };
};