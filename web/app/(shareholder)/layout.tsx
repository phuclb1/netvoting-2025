import { HomeHeader } from "@/components/shared/HomeHeader";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { HomeProvider } from "@/components/shared/providers/HomeProvider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <PrivateRoute allowedRoles={["STAFF", "SHAREHOLDER"]}>
    <HomeProvider>
          <div className="flex-1">
            <HomeHeader />
    
            <div className="flex-1 p-4">{children}</div>
          </div>
        </HomeProvider>
  </PrivateRoute>;
}
