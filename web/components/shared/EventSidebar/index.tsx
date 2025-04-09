import { Sidebar } from "@/components/ui/sidebar";
import { HeaderBlock } from "./HeaderBlock";
import { ContentBlock } from "./ContentBlock";

export default async function EventSidebar({eventId}: { eventId: string }) {
  return (
    <Sidebar>
      <HeaderBlock />
      <ContentBlock eventId={eventId} />
    </Sidebar>
  );
}
