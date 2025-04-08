import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

const Textarea = ({
  className,
  ...props
}: ComponentPropsWithRef<"textarea">) => (
  <textarea
    className={cn(
      "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    )}
    {...props}
  />
);

export { Textarea };
