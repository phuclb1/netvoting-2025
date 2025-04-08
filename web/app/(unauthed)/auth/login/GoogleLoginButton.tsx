"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { IconGoogle } from "@/public/icons/IconGoogle";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ref } from "react";
import { toast } from "sonner";

export function GoogleLoginButton({
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) {
  const query = useSearchParams();
  const callbackUrl = query.get("callbackUrl") ?? "/";
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["loginGoogle"],
    mutationFn: () => signIn("google", { callbackUrl }),
    onSuccess() {
      router.push(callbackUrl);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        mutate();
      }}
      {...props}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <IconGoogle />} Login
      with Google
    </Button>
  );
}
