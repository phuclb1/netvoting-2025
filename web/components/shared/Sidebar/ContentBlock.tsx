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
import { BookOpenText, Building2, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    title: ROUTE.HOME.events_management.root.title,
    icon: Building2,
    url: ROUTE.HOME.events_management.root.path,
  },
];

export function ContentBlock() {
  const pathname = usePathname();
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2">
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="cursor-pointer" isActive={pathname.startsWith(item.url)}>
                    <Link href={item.url}>
                    {item.icon ? <item.icon /> : null}
                    {item.title}{" "}
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup />
    </SidebarContent>
  );
}
