import { authLogic } from "@/protocol/auth/authLogic";
import { transformer } from "@/protocol/trpc/transformer";
import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cache } from "react";
import { ZodError } from "zod";

/**
 * @author tyler.truong - mnpqraven@github
 * some chunks are copied from t3 app
 * @see https://github.com/t3-oss/create-t3-app
 * @see https://github.com/mnpqraven/othi-monorepo/tree/main/packages/protocol/trpc
 */

export interface Context {
  // this is where we put in context data e.g bearer token
  access_token?: string;
  user?: object;
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
interface ContextOpts {
  headers: Headers;
  // TODO:
  cookies?: () => Promise<ReadonlyRequestCookies>;
}

export async function createTRPCContext(
  opts: ContextOpts
): Promise<ContextOpts & Context> {
  let user;
  let access_token;

  // if (opts.cookies) {
  //   const cookies = await opts.cookies()
  //   cookies.get('')
  // }

  const session = await getServerSession(authLogic);

  if (session) {
    if (session.user) user = session.user;
    if (session.access_token) access_token = session.access_token;
  }

  return {
    user,
    access_token,
    ...opts,
  };
}

export const createContext = cache(() => {
  const heads = new Headers();
  // headers()
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => {
    const zodError =
      error.cause instanceof ZodError ? error.cause.flatten() : null;
    return {
      ...shape,
      data: { ...shape.data, zodError },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;

export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use((opts) => {
  const { ctx } = opts;

  if (!ctx.access_token?.length)
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });

  // Infers the `session` as non-nullable
  return opts.next({ ctx });
});

export const createCallerFactory = t.createCallerFactory;
