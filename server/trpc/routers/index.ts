import { baseProcedure, createTRPCRouter } from "~~/server/trpc/init";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  test: baseProcedure.input(z.object({ name: z.string() })).query(async (opts) => {
    return `Hello, ${opts.input.name}!`;
  }),
});

export type AppRouter = typeof appRouter;