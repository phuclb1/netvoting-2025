import { ROUTE } from "@/lib/constants";
import { BackButton } from "@/components/shared/BackButton";
import { api } from "@/protocol/trpc/server";
import { EventFormProvider } from "../../_component/EventFormProvider";
import { EventForm } from "../../_component/EventForm";
import { EventFormSubmitButton } from "../../_component/EventFormSubmitButton";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<Record<"id", string>>;
}>) {
  const id = (await params).id;
  const data = await api.event.detail({ id });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <BackButton href={ROUTE.HOME.events_management.root.path} />
      </div>
      <EventFormProvider defaultValues={data} mode="EDIT">
        <EventForm />
        <EventFormSubmitButton className="w-fit" />
      </EventFormProvider>
    </div>
  );
}
