import type { WordleGame } from "~~/shared/types/wordle";

export const createWordleGame = (word: string): WordleGame => {
  return {
    word,
    guesses: [],
    started: new Date()
  };
};