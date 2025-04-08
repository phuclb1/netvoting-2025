import { ConfirmPopover } from "@/components/shared/ConfirmPopover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/protocol/trpc/client";
import { Table } from "@tanstack/react-table";
import { ComponentPropsWithRef } from "react";
import { toast } from "sonner";

interface HasId {
  id: string | number;
}

interface MultiDeleteRowsInTableProps<TData>
  extends ComponentPropsWithRef<"div"> {
  table: Table<TData>;
}

export function MultiDeleteCenters<TData extends HasId>({
  table,
  className,
  ...props
}: Readonly<MultiDeleteRowsInTableProps<TData>>) {
  const filteredRows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();

  const { mutate: doDelete, isPending: isUserDeleting } =
    api.center.delete.useMutation({
      onSuccess() {
        toast.success(`Deleted ${filteredRows.length} center(s)`);
        utils.center.list.invalidate();
      },
    });
  function onDeleteCenters() {
    doDelete({
      ids: table
        .getSelectedRowModel()
        .rows.map((row) => String(row.original.id)),
    });
  }

  if (!table.getFilteredSelectedRowModel().rows.length) return null;

  return (
    <ConfirmPopover
      asChild
      onConfirm={onDeleteCenters}
      variant="destructive"
      {...props}
    >
      <Button
        className={cn("ml-auto hidden h-10 lg:flex", className)}
        disabled={isUserDeleting}
        size="sm"
        variant="destructive"
      >
        Delete {filteredRows.length} row(s)
      </Button>
    </ConfirmPopover>
  );
}
