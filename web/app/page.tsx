"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data } = useSession();
  console.log("data", data);
  if (data?.user?.role === "ADMIN") {
    return redirect("/events-management");
  }
  if (data?.user?.role === "STAFF" || data?.user?.role === "SHAREHOLDER") {
    return redirect("/events");
  }
  return null;
}
