export enum LetterStatus {
  ABSENT,
  PRESENT,
  CORRECT,
}

export enum GameState {
  DED,
  PLAYING,
  WON,
}

export interface WordleGuess {
  word: string;
  result: LetterStatus[];
}

export interface WordleGame {
  id: string;
  word: string;
  guesses: WordleGuess[],
  started: Date;
  type: "normal" | "daily";
  difficulty: "easy" | "hard";
}

export type WordleBoard = {
  letter: string;
  result: LetterStatus;
}[][];

export type KeyHints = Record<string, LetterStatus>;