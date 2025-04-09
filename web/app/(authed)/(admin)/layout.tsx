import PrivateRoute from "@/components/shared/PrivateRoute";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <PrivateRoute allowedRoles={["ADMIN"]}>{children}</PrivateRoute>;
}
