"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PrivateRouteProp {
  children: React.ReactNode;
  allowedRoles: string[]; // Danh sách role được phép truy cập
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProp) => {
  const { data } = useSession();
  const router = useRouter();

  console.log("data", data);

  useEffect(() => {
    if (data?.user?.role && !allowedRoles.includes(data.user.role)) {
      router.push("/unauthorized"); // Role không phù hợp → từ chối truy cập
    }
  }, [data?.user, router, allowedRoles]);

  if (!data?.user || !allowedRoles.includes(data?.user.role)) return null; // Tránh render nội dung khi điều hướng

  return children;
};

export default PrivateRoute;
