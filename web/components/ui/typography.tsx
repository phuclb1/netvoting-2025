import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

export function Code({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function CodeBlock({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"pre">) {
  return (
    <pre
      className={cn(
        "relative overflow-y-auto text-ellipsis rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  );
}
