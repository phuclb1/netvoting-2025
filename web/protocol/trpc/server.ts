import "server-only"; // <-- ensure this file cannot be imported from the client

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createContext } from "@/server/trpc";
import { makeQueryClient } from "./react-query";
import { appRouter } from "@/server";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<
  typeof appRouter
>(caller, getQueryClient);
