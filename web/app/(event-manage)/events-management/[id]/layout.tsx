import { ReactNode } from "react";
import { HomeProvider } from "@/components/shared/providers/HomeProvider";
import EventSidebar from "@/components/shared/EventSidebar";
import { EventHeader } from "@/components/shared/EventHeader";
import PrivateRoute from "@/components/shared/PrivateRoute";

export default function Layout({
  children,
  params
}: Readonly<{ children: ReactNode; params: { id: string } }>) {

  return (
    <PrivateRoute allowedRoles={["ADMIN"]}>
      <HomeProvider>
        <EventSidebar eventId={params.id} />
        <div className="flex-1">
          <EventHeader />

          <div className="flex-1 p-4">{children}</div>
        </div>
      </HomeProvider>
    </PrivateRoute>
  );
}
