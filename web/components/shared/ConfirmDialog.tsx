import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

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

export function ConfirmDialog({
    children,
    asChild,
    open: propOpen,
    onOpenChange: propOnChange,
    onConfirm,
    text,
    variant = "default",
}: Prop) {
    const [_open, _setOpen] = useState(false);
    const open = propOpen !== undefined ? propOpen : _open;
    const onOpenChange = propOnChange !== undefined ? propOnChange : _setOpen;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children ? (
                <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
            ) : null}
            <DialogContent>
                <div className="flex flex-col gap-10">
                    <DialogHeader className="flex flex-col gap-2 space-y-0">
                        <DialogTitle>
                            {text?.header ?? "Are you absolutely sure?"}
                        </DialogTitle>
                        <DialogDescription className="whitespace-pre-line">
                            {text?.description ?? "This action cannot be undone."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={variant}
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                onOpenChange(false);
                            }}
                        >
                            {text?.action ?? "Confirm"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
