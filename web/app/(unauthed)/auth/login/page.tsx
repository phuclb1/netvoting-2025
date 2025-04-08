import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { api } from "@/protocol/trpc/server";

export default async function Page() {
  const msSupported = await api.auth.msLoginSupported();
  return (
    <Suspense>
      <div className="flex w-96 flex-1 flex-col items-center justify-center gap-2 self-center">
        <LoginForm />
        Or
        <GoogleLoginButton
          className="w-full"
          disabled={!msSupported}
          variant="outline"
        />
      </div>
    </Suspense>
  );
}
