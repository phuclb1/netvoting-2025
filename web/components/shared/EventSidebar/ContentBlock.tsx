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


export function ContentBlock({eventId}: {eventId: string}) {
  const pathname = usePathname();
  const navEvents: NavItem[] = [
    {
      title: ROUTE.EVENT_MANAGE.info.title,
      icon: BookOpenText,
      url: ROUTE.EVENT_MANAGE.info.path(eventId),
    },
    {
      title: ROUTE.EVENT_MANAGE.users.title,
      icon: Building2,
      url: ROUTE.EVENT_MANAGE.users.path(eventId),
    },
    {
      title: ROUTE.EVENT_MANAGE.votingCategories.title,
      icon: Building2,
      url: ROUTE.EVENT_MANAGE.votingCategories.path(eventId),
    },
  ];
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2">
            {navEvents.map((item) => (
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
