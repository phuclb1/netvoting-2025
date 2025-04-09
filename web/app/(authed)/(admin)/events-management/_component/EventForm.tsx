"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventForm } from "./EventFormProvider";
import { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export function EventForm({
  className,
  ...props
}: Readonly<Omit<ComponentPropsWithRef<"form">, "onSubmit">>) {
  const { form, mode, onSubmit } = useEventForm();
  const disabled = mode === "VIEW";

  return (
    <Form {...form}>
      <form
        className={cn("grid grid-cols-2 gap-4 lg:grid-cols-2", className)}
        {...props}
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          disabled={disabled}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
