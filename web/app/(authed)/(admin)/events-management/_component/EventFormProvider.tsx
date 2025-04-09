"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  EventCreate,
  eventCreateSchema,
  EventUpdate,
  eventUpdateSchema,
} from "@/lib/schemas/event";
import { FormContextReturn, FormProviderProps } from "@/lib/types";
import { createContext, use, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/protocol/trpc/client";
import { toast } from "sonner";
import { ROUTE } from "@/lib/constants";

const EventFormContext = createContext<
  FormContextReturn<EventCreate | EventUpdate> | undefined
>(undefined);

const defaultEvent: EventCreate = {
  title: "",
  event_time: new Date(),
};

export function EventFormProvider({
  children,
  mode,
  defaultValues,
}: Readonly<FormProviderProps<EventCreate | EventUpdate>>) {
  const validator = mode === "CREATE" ? eventCreateSchema : eventUpdateSchema;
  const form = useForm<EventCreate | EventUpdate>({
    resolver: zodResolver(validator),
    defaultValues: defaultValues ?? defaultEvent,
  });
  const router = useRouter();
  const utils = api.useUtils();

  const { mutateAsync: createEvent, isPending: isCreating } =
    api.event.create.useMutation({
      onSuccess() {
        toast.success("Created successfully");
        router.push(ROUTE.HOME.humanresource.root.path);
        utils.event.list.invalidate();
      },
    });
  const { mutateAsync: updateEvent, isPending: isUpdating } =
    api.event.update.useMutation({
      onSuccess(_a, vars) {
        toast.success("Updated successfully");
        router.push(ROUTE.HOME.humanresource.root.path);
        utils.event.list.invalidate();
        utils.event.detail.invalidate({ id: vars.id });
      },
    });

  const onSubmit = useCallback(
    async (values: EventCreate | EventUpdate) => {
      switch (mode) {
        case "CREATE":
          await createEvent(values as EventCreate);
          break;
        case "EDIT":
          await updateEvent(values as EventUpdate);
          break;
        default:
          break;
      }
    },
    [createEvent, mode, updateEvent]
  );

  return (
    <EventFormContext.Provider
      value={{
        form,
        defaultValues,
        mode,
        onSubmit: form.handleSubmit(onSubmit),
        isPending: isCreating || isUpdating,
      }}
    >
      {children}
    </EventFormContext.Provider>
  );
}

export function useEventForm() {
  const ctx = use(EventFormContext);
  if (!ctx) throw new Error("Hook used outside Provider!");
  return ctx;
}
