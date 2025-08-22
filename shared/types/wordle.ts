export enum LetterStatus {
  ABSENT,
  PRESENT,
  CORRECT,
}

export enum GameResult {
  DED,
  PLAYING,
  WON,
}

export interface WordleGame {
  word: string;
  guesses: {
    word: string;
    result: LetterStatus[];
  }[],
  started: Date;
}

export const createWordleGame = (word: string): WordleGame => {
  return {
    word,
    guesses: [],
    started: new Date()
  };
};