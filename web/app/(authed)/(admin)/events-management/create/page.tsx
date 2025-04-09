import { ROUTE } from "@/lib/constants";
import { BackButton } from "@/components/shared/BackButton";
import { EventFormProvider } from "../_component/EventFormProvider";
import { EventForm } from "../_component/EventForm";
import { EventFormSubmitButton } from "../_component/EventFormSubmitButton";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <BackButton href={ROUTE.HOME.events_management.root.path} />
      <EventFormProvider mode="CREATE">
        <EventForm />
        <EventFormSubmitButton className="w-fit" />
      </EventFormProvider>
    </div>
  );
}
