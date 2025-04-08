"use client";

import { UserRole } from "@/lib/schemas/user";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  viewableFor: UserRole[];
  loading?: ReactNode;
}
export function AuthGuardClient({ children, viewableFor, loading }: Props) {
  const { data } = useSession();

  if (!data?.user?.role) return loading ?? null;

  if (!viewableFor.includes(data.user?.role)) {
    return null;
  }

  return children;
}
