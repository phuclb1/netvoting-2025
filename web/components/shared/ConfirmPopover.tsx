import { ComponentPropsWithoutRef, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

interface TextShape {
  header: ReactNode;
  description: ReactNode;
  action: ReactNode;
}

interface Prop {
  children?: ReactNode;
  text?: Partial<TextShape>;
  open?: boolean;
  onOpenChange?: (to: boolean) => void;
  onConfirm?: () => void | (() => Promise<void>);
  variant?: ComponentPropsWithoutRef<typeof Button>["variant"];
  asChild?: boolean;
}

export function ConfirmPopover({
  children,
  asChild,
  open: propOpen,
  onOpenChange: propOnChange,
  onConfirm,
  text,
  variant = "default",
}: Readonly<Prop>) {
  const [open, onOpenChange] = useControllableState({
    prop: propOpen,
    onChange: propOnChange,
    defaultProp: false,
  });

  const header = text?.header ?? "Are you absolutely sure?";
  const description = text?.description ?? "This action cannot be undone.";

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      {children ? (
        <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      ) : null}
      <PopoverContent className="flex flex-col gap-10">
        <div className="space-y-2">
          <div className="font-semibold">{header}</div>
          <div>{description}</div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (onConfirm) onConfirm();
              onOpenChange(false);
            }}
            variant={variant}
          >
            {text?.action ?? "Confirm"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
