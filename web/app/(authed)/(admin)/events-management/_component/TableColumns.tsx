import { ConfirmPopover } from "@/components/shared/ConfirmPopover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTE } from "@/lib/constants";
import { Event } from "@/lib/schemas/event";
import { api } from "@/protocol/trpc/client";
import { createColumnHelper, Table } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const col = createColumnHelper<Event>();

const HeaderCheckbox = ({ table }: { table: Table<Event> }) => {
  const isAllEventsSelected = table.getIsAllRowsSelected();
  const isSelectedAllEventsChange = table.getToggleAllRowsSelectedHandler();
  const isSomeEventsSelected = table.getIsSomeRowsSelected();

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeEventsSelected;
    }
  }, [isSomeEventsSelected]);

  return (
    <input
      checked={isAllEventsSelected}
      onChange={isSelectedAllEventsChange}
      ref={headerCheckboxRef}
      type="checkbox"
    />
  );
};

export const eventTableColumns = [
  col.display({
    id: "select",
    header: ({ table }) => <HeaderCheckbox table={table} />,
    cell: ({ row }) => (
      <input
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        type="checkbox"
      />
    ),
  }),
  col.accessor("image", {
    header: "",
    cell: ({ getValue, row }) => (
      <Link
        className="underline hover:no-underline"
        href={ROUTE.EVENT_MANAGE.info.path(row.original.id)}
      >
        {getValue()}
      </Link>
    ),
  }),
  col.accessor("title", { header: "Tiêu đề" }),
  col.display({
    id: "action",
    cell: function Action({ row }) {
      const eventId = row.original.id;
      const utils = api.useUtils();
      const { data } = api.auth.me.useQuery();
      const isCurrentEvent = data && data.id === eventId;
      const { mutate: doDelete, isPending: isDeleting } =
        api.event.delete.useMutation({
          onSuccess() {
            toast.success(`Event ${row.original.title} deleted`);
            utils.event.list.invalidate();
          },
        });

      return (
        <div className="flex justify-end">
          {/* <AuthGuardClient viewableFor={""}> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={ROUTE.HOME.humanresource.edit.path(eventId)}>
                <Button size="icon" variant="ghost">
                  <Pencil />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <ConfirmPopover
              asChild
              onConfirm={() => doDelete({ ids: [eventId] })}
              variant="destructive"
            >
              <TooltipTrigger asChild>
                <Button
                  disabled={isDeleting || isCurrentEvent}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </TooltipTrigger>
            </ConfirmPopover>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  }),
];
