import { BackButton } from "@/components/shared/BackButton";
import { ROUTE } from "@/lib/constants";
import { api } from "@/protocol/trpc/server";
import { CenterFormProvider } from "../../_component/CenterFormProvider";
import { CenterForm } from "../../_component/CenterForm";
import { CenterFormSubmitButton } from "../../_component/CenterFormSubmitButton";

export default async function Page({
  params,
}: Readonly<{ params: Promise<Record<"id", string>> }>) {
  const id = (await params).id;
  const data = await api.center.detail({ id });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton href={ROUTE.HOME.trainingcenter.root.path} />
      </div>

      <CenterFormProvider defaultValues={data} mode="EDIT">
        <CenterForm />
        <CenterFormSubmitButton className="w-fit" />
      </CenterFormProvider>
    </div>
  );
}
