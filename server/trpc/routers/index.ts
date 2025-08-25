import { createTRPCRouter } from "~~/server/trpc/init";
import { wordleRouter } from "~~/server/trpc/routers/wordle";

export const appRouter = createTRPCRouter({
  wordle: wordleRouter,
});

export type AppRouter = typeof appRouter;