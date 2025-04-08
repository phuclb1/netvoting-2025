"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCreate,
  userCreateSchema,
  UserUpdate,
  userUpdateSchema,
} from "@/lib/schemas/user";
import { FormContextReturn, FormProviderProps } from "@/lib/types";
import { createContext, use, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/protocol/trpc/client";
import { toast } from "sonner";
import { ROUTE } from "@/lib/constants";

const UserFormContext = createContext<
  FormContextReturn<UserCreate | UserUpdate> | undefined
>(undefined);

const defaultUser: UserCreate = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
  role: "Student",
  password: "123456aA@",
};

export function UserFormProvider({
  children,
  mode,
  defaultValues,
}: Readonly<FormProviderProps<UserCreate | UserUpdate>>) {
  const validator = mode === "CREATE" ? userCreateSchema : userUpdateSchema;
  const form = useForm<UserCreate | UserUpdate>({
    resolver: zodResolver(validator),
    defaultValues: defaultValues ?? defaultUser,
  });
  const router = useRouter();
  const utils = api.useUtils();

  const { mutateAsync: createUser, isPending: isCreating } =
    api.user.create.useMutation({
      onSuccess() {
        toast.success("Created successfully");
        router.push(ROUTE.HOME.humanresource.root.path);
        utils.user.list.invalidate();
      },
    });
  const { mutateAsync: updateUser, isPending: isUpdating } =
    api.user.update.useMutation({
      onSuccess(_a, vars) {
        toast.success("Updated successfully");
        router.push(ROUTE.HOME.humanresource.root.path);
        utils.user.list.invalidate();
        utils.user.detail.invalidate({ id: vars.id });
      },
    });

  const onSubmit = useCallback(
    async (values: UserCreate | UserUpdate) => {
      switch (mode) {
        case "CREATE":
          await createUser(values as UserCreate);
          break;
        case "EDIT":
          await updateUser(values as UserUpdate);
          break;
        default:
          break;
      }
    },
    [createUser, mode, updateUser]
  );

  return (
    <UserFormContext.Provider
      value={{
        form,
        defaultValues,
        mode,
        onSubmit: form.handleSubmit(onSubmit),
        isPending: isCreating || isUpdating,
      }}
    >
      {children}
    </UserFormContext.Provider>
  );
}

export function useUserForm() {
  const ctx = use(UserFormContext);
  if (!ctx) throw new Error("Hook used outside Provider!");
  return ctx;
}
