import z from "zod";
import { baseProcedure, createTRPCRouter } from "~~/server/trpc/init";
import { readFileSync } from "fs";
import { join } from "path";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";
import { GameResult, LetterStatus, type WordleGame } from "~~/shared/types/wordle";

const Words = readFileSync(join(process.cwd(), "app/assets/wordle/words.txt"), "utf-8");
const ExtraWords = readFileSync(join(process.cwd(), "app/assets/wordle/extra_words.txt"), "utf-8");

const words = Words.split("\n");
const extraWords = ExtraWords.split("\n");

const WordsSchema = z.string().refine(
  (val) => extraWords.includes(val),
  { message: "Please use a valid word." }
);

const sessions = new Map<string, WordleGame>();

function diffMs(date: Date): number {
  return Date.now() - date.getTime();
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
    const word = words[Math.floor(Math.random() * words.length)];

    if (!word) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to pick word. Please try again."
      });
    }

    const id = createId();

    sessions.set(id, createWordleGame(word));

    return { id };
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

    return { word: game.word };
  }),

  guess: baseProcedure.input(z.object({
    id: z.string(),
    word: WordsSchema
  })).mutation(async (opts) => {
    const id = opts.input.id;
    const guess = opts.input.word.toLowerCase();

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

      return {
        word: game.word,
        guesses: game.guesses,
        time: diffMs(game.started),
        result: GameResult.WON
      };
    } else if (game.guesses.length >= 6) {
      sessions.delete(id);

      return {
        word: game.word,
        guesses: game.guesses,
        time: diffMs(game.started),
        result: GameResult.DED
      };
    }

    return {
      guesses: game.guesses,
      result: GameResult.PLAYING
    };
  }),
});