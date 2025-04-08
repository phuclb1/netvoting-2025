"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SearchCommand({
  className,
  ...props
}: Omit<ButtonProps, "onClick">) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        className={cn(
          "text-muted-foreground flex items-center justify-start self-center rounded-md px-2 text-sm font-normal shadow-none",
          className,
        )}
        onClick={() => setOpen(true)}
        variant="outline"
        {...props}
      >
        <span>Search...</span>
        <kbd className="bg-muted pointer-events-none hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              Home
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
