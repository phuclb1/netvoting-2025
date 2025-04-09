import { ROUTE } from "@/lib/constants";
import { BackButton } from "@/components/shared/BackButton";
import { api } from "@/protocol/trpc/server";
import { UserFormProvider } from "../../_component/UserFormProvider";
import { UserForm } from "../../_component/UserForm";
import { UserFormSubmitButton } from "../../_component/UserFormSubmitButton";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<Record<"id", string>>;
}>) {
  const id = (await params).id;
  const data = await api.user.detail({ id });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <BackButton href={ROUTE.HOME.humanresource.root.path} />
      </div>
      <UserFormProvider defaultValues={data} mode="EDIT">
        <UserForm />
        <UserFormSubmitButton className="w-fit" />
      </UserFormProvider>
    </div>
  );
}
