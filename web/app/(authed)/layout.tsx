import HomeSidebar from "@/components/shared/Sidebar";
import { HomeHeader } from "@/components/shared/HomeHeader";
import { ReactNode } from "react";
import { HomeProvider } from "@/components/shared/providers/HomeProvider";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <HomeProvider>
      <HomeSidebar />
      <div className="flex-1">
        <HomeHeader />

        <div className="flex-1 p-4">{children}</div>
      </div>
    </HomeProvider>
  );
}
