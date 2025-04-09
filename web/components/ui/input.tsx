"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { ComponentPropsWithRef, useState } from "react";

export const Input = ({
  className,
  type,
  ...props
}: ComponentPropsWithRef<"input">) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && !showPassword ? "password" : "text";

  return (
    <div className="relative w-full">
      <input
        className={cn(
          "border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        type={inputType}
        {...props}
      />
      {type === "password" && (
        <button
          className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground"
          onClick={handleTogglePassword}
          type="button"
        >
          {showPassword ? <Eye size={15} /> : <EyeClosed size={15} />}
        </button>
      )}
    </div>
  );
};
