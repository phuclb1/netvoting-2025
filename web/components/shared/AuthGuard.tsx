import { UserRole } from "@/lib/schemas/user";
import { api } from "@/protocol/trpc/server";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  viewableFor: UserRole[];
}
export async function AuthGuard({ children, viewableFor }: Props) {
  try {
    const auth = await api.auth.me();
    if (!viewableFor.includes(auth.role)) return null;

    return children;
  } catch (_e) {
    return null;
  }
}
