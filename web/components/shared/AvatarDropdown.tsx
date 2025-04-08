"use client";

import { Ref } from "react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { User } from "next-auth";
import { useLocale } from "next-intl";
import { setLocale } from "@/server/actions/i18n";
import { Languages, LogOut, SunMoon, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface AvatarDropdownProps extends ButtonProps {
  user: Pick<User, "name" | "email">;
  /**
   * showing the user's name next to the avatar
   */
  showName?: boolean;
  ref?: Ref<HTMLButtonElement>;
}
export function AvatarDropdown({
  children,
  className,
  showName,
  user,
  ref,
  ...props
}: AvatarDropdownProps) {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();

  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  const langOptions = [
    { value: "en", label: "English" },
    { value: "vi", label: "Tiếng Việt" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("p-1", showName ? "pr-3" : "", className)}
          variant="outline"
          {...props}
          ref={ref}
        >
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-sm font-light">
          {user.email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages />
            Language
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                onValueChange={(e) => setLocale(e as unknown as "en" | "vi")}
                value={locale}
              >
                {langOptions.map(({ value, label }) => (
                  <DropdownMenuRadioItem
                    className="cursor-pointer"
                    key={value}
                    value={value}
                  >
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuLabel className="[&_svg]:size-4 flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0">
          <SunMoon />
          Theme
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup onValueChange={setTheme} value={theme}>
          {themeOptions.map(({ value, label }) => (
            <DropdownMenuRadioItem
              className="cursor-pointer"
              key={value}
              onSelect={(e) => {
                e.preventDefault();
              }}
              value={value}
            >
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
          onSelect={() => {
            signOut();
          }}
        >
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
