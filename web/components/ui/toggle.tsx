"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

const toggleVariants = cva(
  "ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:size-4 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border-input hover:bg-accent hover:text-accent-foreground border bg-transparent",
      },
      size: {
        default: "min-w-10 h-10 px-3",
        sm: "min-w-9 h-9 px-2.5",
        lg: "min-w-11 h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = ({
  className,
  variant,
  size,
  ...props
}: ComponentPropsWithRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) => (
  <TogglePrimitive.Root
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
);

export { Toggle, toggleVariants };
