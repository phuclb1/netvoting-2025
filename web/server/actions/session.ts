"use server";

import { authLogic } from "@/protocol/auth/authLogic";
import { getServerSession } from "next-auth";

export async function getSession() {
  return getServerSession(authLogic);
}
