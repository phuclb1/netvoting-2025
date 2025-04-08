"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTE } from "@/lib/constants";
import { BookOpenText, Building2, Home, LucideIcon } from "lucide-react";
import Link from "next/link";

type NavItem = {
  title: string;
  icon: LucideIcon;
  url: string;
};

// Menu items.
const navMain: NavItem[] = [
  {
    title: ROUTE.HOME.humanresource.root.title,
    icon: BookOpenText,
    url: ROUTE.HOME.humanresource.root.path,
  },
  {
    title: ROUTE.HOME.trainingcenter.root.title,
    icon: Building2,
    url: ROUTE.HOME.trainingcenter.root.path,
  },
];

export function ContentBlock() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem key={"Home"}>
              <SidebarMenuButton asChild>
                <Link href={ROUTE.HOME.root.path}>
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton className="cursor-pointer">
                    {item.icon ? <item.icon /> : null}
                    {item.title}{" "}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup />
    </SidebarContent>
  );
}
