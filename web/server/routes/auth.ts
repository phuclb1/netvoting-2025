import { ky } from "@/protocol";
import { authedProcedure, publicProcedure, router } from "../trpc";
import { env } from "@/env";
import { User } from "next-auth";

export const authRouter = router({
  me: authedProcedure.query(async () => {
    const res = await ky.get<User>("/auth/me");
    return res;
  }),
  msLoginSupported: publicProcedure.query(() =>
    Boolean(env.GOOGLE_CLIENT_ID.length)
  ),
});
