import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { getSession } from "@/server/actions/session";
import { AvatarDropdown } from "./AvatarDropdown";
import Image from "next/image";
import { SearchCommand } from "./SearchCommand";
import { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

const links = [{ path: "/users", label: "Users" }];

const SHOW_AVATAR_NAME = true;

export async function Topbar({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  const session = await getSession();
  return (
    <div
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex items-center justify-between border-b px-10 py-1 backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Link className="flex items-center gap-2" href="/">
          <Image alt="Home" height={36} src="/logo.png" width={36} />

          <span className="text-xl font-bold">TVF</span>
        </Link>

        {links.map(({ label, path }) => (
          <Link className="hover:underline" href={path} key={path}>
            {label}
          </Link>
        ))}
      </div>

      <div className="flex gap-1">
        {session?.user ? (
          <AvatarDropdown
            className="rounded-l-4xl flex items-center gap-1 rounded-r-md"
            showName={SHOW_AVATAR_NAME}
            user={session.user}
            variant="outline"
          >
            <UserAvatar className="h-8 w-8" user={session.user} />

            {SHOW_AVATAR_NAME ? session.user.name : null}
          </AvatarDropdown>
        ) : null}
        <SearchCommand className="rounded-r-4xl" variant="outline" />
      </div>
    </div>
  );
}
