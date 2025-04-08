import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getSession } from "@/server/actions/session";
import { AvatarDropdown } from "../AvatarDropdown";
import { UserAvatar } from "../UserAvatar";

export async function FooterBlock() {
  const session = await getSession();

  if (!session?.user) return null;
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <AvatarDropdown asChild showName user={session.user} variant="ghost">
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [[data-state=collapsed]_&]:rounded-full"
              size="lg"
            >
              <UserAvatar className="h-8 w-8" user={session.user} />
              {session.user.name}
            </SidebarMenuButton>
          </AvatarDropdown>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
