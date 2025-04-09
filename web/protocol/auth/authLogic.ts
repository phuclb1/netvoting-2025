// import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, Session, User } from "next-auth";
import { env } from "@/env";
import ky from "ky";

const debug = env.NEXT_PUBLIC_CICD_BUILD_PLATFORM !== "PROD" && env.DEBUG_AUTH;

export const authLogic: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  debug,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials, _req) {
        
        const res = await ky.post(
          `${env.BACKEND_API_URL}/api/v1/auth/login/password`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
            throwHttpErrors: false,
          }
        );

        console.log(res);
        const jsoned = await res.json<Session>();
        console.log(jsoned);
        if (debug) console.log("[NEXTAUTH][AUTHORIZE]", jsoned);

        // If no error and we have user data, return it
        if (res.ok && jsoned.user) {
          return {
            ...jsoned.user,
            access_token: jsoned.access_token,
          } satisfies User;
        }

        // If error and we have the message
        if ("detail" in jsoned && typeof jsoned.detail === "string")
          throw new Error(jsoned.detail);

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.access_token = user.access_token;
        token.user = user;
      }
      // oauth data if user is logged in via Azure
      if (account?.type === "oauth") {
        const res = await ky
          .post<{
            access_token: string;
            user: User;
          }>(
            `${env.BACKEND_API_URL}/api/v1/auth/login/google?token=${account.access_token}`
          )
          .json();
        token.access_token = res.access_token;
        token.user = res.user;
      }

      if (debug) console.log("[NEXTAUTH][JWT]", token);
      return token;
    },
    async session({ session, token }) {
      if (token.access_token) session.access_token = token.access_token;
      if (token.user) session.user = token.user;

      if (debug) console.log("[NEXTAUTH][SESSION]", session);
      return session;
    },
  },
};
