"use client";

import { TableSearchAtom } from "@/components/shared/table/TableFilter";
import { ROUTE } from "@/lib/constants";
import {
  CenterCreate,
  centerCreateSchema,
  CenterUpdate,
  centerUpdateSchema,
} from "@/lib/schemas/training-center";
import { FormContextReturn, FormProviderProps } from "@/lib/types";
import { api } from "@/protocol/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { createContext, use, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CenterFormContext = createContext<
  FormContextReturn<CenterCreate | CenterUpdate> | undefined
>(undefined);

const defaultCenter: CenterCreate = {
  manager_id: "",
  name: "",
  address: "",
  type: "",
  department: "",
};

export function CenterFormProvider({
  children,
  mode,
  defaultValues,
}: Readonly<FormProviderProps<CenterCreate | CenterUpdate>>) {
  const validator = mode === "CREATE" ? centerCreateSchema : centerUpdateSchema;
  const form = useForm<CenterCreate | CenterUpdate>({
    resolver: zodResolver(validator),
    defaultValues: defaultValues ?? defaultCenter,
  });
  const router = useRouter();
  const utils = api.useUtils();

  const { mutateAsync: createCenter, isPending: isCreating } =
    api.center.create.useMutation({
      onSuccess() {
        toast.success("Created successfully");
        router.push(ROUTE.HOME.trainingcenter.root.path);
        utils.center.list.invalidate();
      },
    });
  const { mutateAsync: updateCenter, isPending: isUpdating } =
    api.center.update.useMutation({
      onSuccess(_a, vars) {
        toast.success("Updated successfully");
        router.push(ROUTE.HOME.trainingcenter.root.path);
        utils.center.list.invalidate();
        utils.center.detail.invalidate({ id: vars.id });
      },
    });

  const query = useAtomValue(TableSearchAtom);
  const { data: queryData } = api.user.list.useQuery({
    page: 1,
    page_size: 9999,
    query: query,
  });
  const data = useMemo(() => queryData?.users ?? [], [queryData]);

  const onSubmit = useCallback(
    async (values: CenterCreate | CenterUpdate) => {
      switch (mode) {
        case "CREATE":
          await createCenter(values as CenterCreate);
          break;
        case "EDIT":
          await updateCenter(values as CenterUpdate);
          break;
        default:
          break;
      }
    },
    [createCenter, mode, updateCenter]
  );

  return (
    <CenterFormContext.Provider
      value={{
        form,
        defaultValues,
        mode,
        onSubmit: form.handleSubmit(onSubmit),
        isPending: isCreating || isUpdating,
        users: data,
      }}
    >
      {children}
    </CenterFormContext.Provider>
  );
}

export function useCenterForm() {
  const ctx = use(CenterFormContext);
  if (!ctx) throw new Error("Hook used outside Provider!");
  return ctx;
}
