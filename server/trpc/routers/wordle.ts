import z from "zod";
import { baseProcedure, createTRPCRouter } from "~~/server/trpc/init";

export const wordleRouter = createTRPCRouter({
  test: baseProcedure.input(z.object({ name: z.string() })).query(async (opts) => {
    return `Hello, ${opts.input.name}!`;
  }),
});