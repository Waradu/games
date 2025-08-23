import z from "zod";
import { baseProcedure, createTRPCRouter } from "~~/server/trpc/init";
import { readFileSync } from "fs";
import { join } from "path";
import { TRPCError } from "@trpc/server";
import { GameState, LetterStatus, type WordleGuess, type WordleGame, type KeyHints, type WordleBoard } from "~~/shared/types/wordle";

const Words = readFileSync(join(process.cwd(), "app/assets/wordle/words.txt"), "utf-8");
const ExtraWords = readFileSync(join(process.cwd(), "app/assets/wordle/extra_words.txt"), "utf-8");

const words = Words.split("\n");
const extraWords = ExtraWords.split("\n");
const Allowed = new Set([...words, ...extraWords]);

const WordsSchema = z.string().refine(
  (val) => Allowed.has(val),
  { message: "Please use a valid word." }
);

const sessions = new Map<string, WordleGame>();

const MAX_ATTEMPTS = 6;

const statusRank = {
  [LetterStatus.ABSENT]: 0,
  [LetterStatus.PRESENT]: 1,
  [LetterStatus.CORRECT]: 2,
} as const;

function toTiles(guess: string, result: LetterStatus[]) {
  return guess.split("").map((ch, i) => ({ letter: ch, result: result[i]! }));
}

function computeKeyboard(guesses: WordleGuess[]): KeyHints {
  const hints: KeyHints = {};
  for (const g of guesses) {
    const tiles = toTiles(g.word, g.result);
    for (const t of tiles) {
      const prev = hints[t.letter];
      const prevRank = prev === undefined ? -1 : statusRank[prev];
      const currRank = statusRank[t.result!];
      if (currRank > prevRank) {
        hints[t.letter!] = t.result!;
      }
    }
  }
  return hints;
}

function computeBoard(guesses: WordleGuess[]): WordleBoard {
  return guesses.map((g) => toTiles(g.word, g.result));
}

function checkWordleGuess(word: string, guess: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(guess.length).fill(
    LetterStatus.ABSENT,
  );
  const used = new Array(word.length).fill(false);

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === word[i]) {
      result[i] = LetterStatus.CORRECT;
      used[i] = true;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === LetterStatus.CORRECT) continue;

    for (let j = 0; j < word.length; j++) {
      if (!used[j] && guess[i] === word[j]) {
        result[i] = LetterStatus.PRESENT;
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export const wordleRouter = createTRPCRouter({
  start: baseProcedure.mutation(async () => {
    const now = Date.now();
    sessions.forEach(session => {
      if (now - session.started.getTime() > 24 * 60 * 60 * 1000) sessions.delete(session.id);
    });

    const word = words[Math.floor(Math.random() * words.length)];

    if (!word) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to pick word. Please try again."
      });
    }

    const game = createWordleGame(word);
    sessions.set(game.id, game);

    return {
      id: game.id
    };
  }),

  stop: baseProcedure.input(z.object({
    id: z.string()
  })).mutation(async (opts) => {
    const id = opts.input.id;

    const game = sessions.get(id);

    if (!game) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Game was not found. Please start a new one."
      });
    }

    sessions.delete(id);

    const board = computeBoard(game.guesses);
    const keyboard = computeKeyboard(game.guesses);
    return { word: game.word, board, keyboard, started: game.started, state: GameState.DED };
  }),

  get: baseProcedure.input(z.object({
    id: z.string()
  })).query(async (opts) => {
    const id = opts.input.id;

    const game = sessions.get(id);

    if (!game) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Game was not found. Please start a new one."
      });
    }

    const board = computeBoard(game.guesses);
    const keyboard = computeKeyboard(game.guesses);
    const last = game.guesses.at(-1);
    const result = last?.word === game.word
      ? GameState.WON
      : game.guesses.length >= MAX_ATTEMPTS
        ? GameState.DED
        : GameState.PLAYING;

    if (result != GameState.PLAYING) {
      sessions.delete(id);
    }

    return {
      board,
      keyboard,
      started: game.started,
      state: result,
      word: result != GameState.PLAYING ? game.word : undefined
    };
  }),

  guess: baseProcedure.input(z.object({ word: WordsSchema, id: z.string() })).mutation(async (opts) => {
    const guess = opts.input.word.toLowerCase();
    const id = opts.input.id;

    const game = sessions.get(id);

    if (!game) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Game was not found. Please start a new one."
      });
    }

    if (game.guesses.some(g => g.word === guess)) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Word was already guessed. Please try another one."
      });
    }

    const result = checkWordleGuess(game.word, guess);

    game.guesses.push({
      word: guess,
      result: result
    });

    if (guess == game.word) {
      sessions.delete(id);

      const board = computeBoard(game.guesses);
      const keyboard = computeKeyboard(game.guesses);
      return {
        word: game.word,
        board,
        keyboard,
        started: game.started,
        state: GameState.WON,
      };
    } else if (game.guesses.length >= 6) {
      sessions.delete(id);

      const board = computeBoard(game.guesses);
      const keyboard = computeKeyboard(game.guesses);
      return {
        word: game.word,
        board,
        keyboard,
        started: game.started,
        state: GameState.DED,
      };
    }

    const board = computeBoard(game.guesses);
    const keyboard = computeKeyboard(game.guesses);

    return {
      board,
      keyboard,
      started: game.started,
      state: GameState.PLAYING,
    };
  }),
});