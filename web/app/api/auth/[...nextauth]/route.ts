import { authLogic } from "@/protocol/auth/authLogic";
import NextAuth from "next-auth";

const handler = NextAuth(authLogic);

export { handler as GET, handler as POST };
