import { ConfirmPopover } from "@/components/shared/ConfirmPopover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTE } from "@/lib/constants";
import { api } from "@/protocol/trpc/client";
import { createColumnHelper, Table } from "@tanstack/react-table";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const col = createColumnHelper<User>();

const HeaderCheckbox = ({ table }: { table: Table<User> }) => {
  const isAllUsersSelected = table.getIsAllRowsSelected();
  const isSelectedAllUsersChange = table.getToggleAllRowsSelectedHandler();
  const isSomeUsersSelected = table.getIsSomeRowsSelected();

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeUsersSelected;
    }
  }, [isSomeUsersSelected]);

  return (
    <input
      checked={isAllUsersSelected}
      onChange={isSelectedAllUsersChange}
      ref={headerCheckboxRef}
      type="checkbox"
    />
  );
};

export const userTableColumns = [
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
  col.accessor("name", {
    header: "Họ và tên",
    cell: ({ getValue, row }) => (
      <Link
        className="underline hover:no-underline"
        href={ROUTE.HOME.humanresource.detail.path(row.original.id)}
      >
        {getValue()}
      </Link>
    ),
  }),
  col.accessor("email", { header: "Email" }),
  col.accessor("role", {
    header: "Quyền",
    cell: ({ getValue }) => <Badge variant="secondary">{getValue()}</Badge>,
  }),
  col.accessor("phone_number", { header: "Số điện thoại" }),
  col.accessor("address", { header: "Địa chỉ" }),
  col.accessor("shareholder_quantity", { header: "Số cổ phiếu" }),
  col.display({
    id: "action",
    cell: function Action({ row }) {
      const userId = row.original.id;
      const utils = api.useUtils();
      const { data } = api.auth.me.useQuery();
      const isCurrentUser = data && data.id === userId;
      const { mutate: doDelete, isPending: isDeleting } =
        api.user.delete.useMutation({
          onSuccess() {
            toast.success(`User ${row.original.name} deleted`);
            utils.user.list.invalidate();
          },
        });

      const { mutate: resetPassword, isPending: isReseting } =
        api.user.update_password.useMutation({
          onSuccess() {
            toast.success(`Password has been reset`);
            utils.user.list.invalidate();
          },
        });

      return (
        <div className="flex justify-end">
          {/* <AuthGuardClient viewableFor={""}> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={ROUTE.HOME.humanresource.edit.path(userId)}>
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
              onConfirm={() =>
                resetPassword({ id: userId, raw_password: "123456aA@" })
              }
            >
              <TooltipTrigger asChild>
                <Button disabled={isReseting} size="icon" variant="ghost">
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
            </ConfirmPopover>
            <TooltipContent>Reset Password</TooltipContent>
          </Tooltip>

          <Tooltip>
            <ConfirmPopover
              asChild
              onConfirm={() => doDelete({ ids: [userId] })}
              variant="destructive"
            >
              <TooltipTrigger asChild>
                <Button
                  disabled={isDeleting || isCurrentUser}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </TooltipTrigger>
            </ConfirmPopover>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
          {/* </AuthGuardClient> */}
        </div>
      );
    },
  }),
];
