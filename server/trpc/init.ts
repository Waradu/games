import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { H3Event } from "h3";

export const createTRPCContext = async (event: H3Event) => {
  return {
    event,
    user: event.context.authUser,
    session: event.context.authSession,
    clearSession: event.context.clearSession
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const middleware = t.middleware;