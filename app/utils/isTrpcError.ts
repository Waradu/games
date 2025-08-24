import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "~~/server/trpc/routers";

export function isTrpcError(err: unknown): err is TRPCClientError<AppRouter> {
  return err instanceof TRPCClientError;
}