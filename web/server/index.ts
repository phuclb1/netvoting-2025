import { authedProcedure, publicProcedure, router } from "./trpc";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";
import { exampleRouter } from "./routes/example";
import { eventRouter } from "./routes/event";

export const appRouter = router({
  auth: authRouter,
  example: {
    greeting: publicProcedure.query(async () => ({ hello: "world" })),
    protected: authedProcedure.query(async () => "this is a protected string"),
  },
  test: exampleRouter,
  user: userRouter,
  event: eventRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
