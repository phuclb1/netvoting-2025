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

export function MultiDeleteEvents<TData extends HasId>({
  table,
  className,
  ...props
}: Readonly<MultiDeleteRowsInTableProps<TData>>) {
  const filteredRows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();

  const { data } = api.auth.me.useQuery();
  const isDeleteDisabled = filteredRows.some(
    (row) => row.original.id === data?.id
  );

  const { mutate: doDelete, isPending: isEventDeleting } =
    api.event.delete.useMutation({
      onSuccess() {
        toast.success(`Deleted ${filteredRows.length} event(s)`);
        utils.event.list.invalidate();
      },
    });
  function onDeleteEvents() {
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
      onConfirm={onDeleteEvents}
      variant="destructive"
      {...props}
    >
      <Button
        className={cn("ml-auto hidden h-10 lg:flex", className)}
        disabled={isEventDeleting || isDeleteDisabled}
        size="sm"
        variant="destructive"
      >
        Delete {filteredRows.length} row(s)
      </Button>
    </ConfirmPopover>
  );
}
