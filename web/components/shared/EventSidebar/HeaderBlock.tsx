import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function HeaderBlock() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/events-management">
            <SidebarMenuButton
              className="cursor-pointer font-semibold text-[18px] data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <div className="size-8 aspect-square">
                <Image
                  alt="Home"
                  height={64}
                  src="/images/galaxy.svg"
                  width={64}
                />
              </div>
              Netvoting
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
