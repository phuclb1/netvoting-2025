"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export function HomeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class">
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
