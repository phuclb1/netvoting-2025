import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

function Skeleton({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
