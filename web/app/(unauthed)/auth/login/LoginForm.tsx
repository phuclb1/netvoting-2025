"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { loginPasswordSchema } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

type FormSchema = z.TypeOf<typeof loginPasswordSchema>;

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginPasswordSchema),
  });

  const query = useSearchParams();
  const callbackUrl = query.get("callbackUrl") ?? "/";
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: FormSchema) => {
      const response = await signIn("credentials", {
        redirect: false,
        callbackUrl,
        ...values,
      });
      if (!response?.ok)
        throw new Error(response?.error ?? "Invalid login credentials");
    },
    onSuccess() {
      router.push(callbackUrl);
    },
    onError(error) {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return (
    <Form {...form}>
      <form
        className={cn("flex w-full flex-col gap-2")}
        onSubmit={form.handleSubmit((e) => {
          mutate(e);
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : null} Login
        </Button>
      </form>
    </Form>
  );
}
