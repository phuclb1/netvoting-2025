import { UserAvatar } from "./UserAvatar";
import { getSession } from "@/server/actions/session";
import { AvatarDropdown } from "./AvatarDropdown";
import { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { PageTitle } from "./HeaderTitle";

const SHOW_AVATAR_NAME = true;

export async function HomeHeader({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  const session = await getSession();
  return (
    <div
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-1 backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="inline-flex gap-1">
        <PageTitle />
      </div>

      <div className="flex gap-1">
        {session?.user ? (
          <AvatarDropdown
            className={buttonVariants({
              variant: "ghost",
              className: "flex border-none items-center gap-2 px-2 py-1 pr-10",
            })}
            showName={SHOW_AVATAR_NAME}
            user={session.user}
          >
            <UserAvatar className="h-10 w-10" user={session.user} />

            <div className="flex flex-col text-[14px]">
              <span>{SHOW_AVATAR_NAME ? session.user.name : null}</span>
              <span className="text-[10px]">{session.user.role}</span>
            </div>
          </AvatarDropdown>
        ) : null}
      </div>
    </div>
  );
}
