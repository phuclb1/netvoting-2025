/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";
import type { Account, DefaultSession, User } from "next-auth";

declare module "next-auth" {
  interface User {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    picture: string | null;
    role: UserRole;
    id: string;
    ms_id: string | null;
    created_at?: string | number;
    updated_at?: string | number;
    hashed_token?: string | null;
    access_token?: string;
  }
  interface Session {
    user?: Omit<User, "access_token">;
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** Respective provider's access token */
    access_token?: string;
    user?: User;
    /** oauth data if user is logged in via Azure */
    account?: Account;
  }
}
