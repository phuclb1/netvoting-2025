"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { actionLabelFromMode } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserForm } from "./UserFormProvider";

export function UserFormSubmitButton({
  children,
  ...props
}: Readonly<Omit<ButtonProps, "onClick">>) {
  const { mode, onSubmit, isPending } = useUserForm();
  const label = actionLabelFromMode(mode);
  const path = usePathname();
  if (mode === "VIEW")
    return (
      <Link className="w-fit" href={`${path}/edit`}>
        <Button {...props}>{children ?? label}</Button>
      </Link>
    );
  return (
    <Button disabled={isPending} {...props} onClick={onSubmit}>
      {children ?? label}
    </Button>
  );
}
