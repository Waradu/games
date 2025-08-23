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
}

export type WordleBoard = {
  letter: string;
  result: LetterStatus;
}[][];

export type KeyHints = Record<string, LetterStatus>;