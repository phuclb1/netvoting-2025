import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

const Card = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
  <div
    className={cn(
      "bg-card text-card-foreground shadow-xs rounded-lg border",
      className,
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
  <div
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<"div">) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props} />
);

const CardContent = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
