"use client";

import { usePagination } from "@/lib/params";
import {
  TableFilter,
  TableSearchAtom,
} from "@/components/shared/table/TableFilter";
import { useAtomValue } from "jotai";
import { api } from "@/protocol/trpc/client";
import { useMemo, useState } from "react";
import { useTable } from "@/components/shared/table/useTable";
import { userTableColumns } from "@/components/shared/table/UserTableColumns";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import { DataTable } from "@/components/shared/table/DataTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ROUTE } from "@/lib/constants";
import SelectRole from "@/components/shared/table/SelectRole";
import { MultiDeleteUsers } from "./_component/MultipleDeleteUser";

export function UserTable() {
  const [pagination, setPagination] = usePagination();
  const query = useAtomValue(TableSearchAtom);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { data: queryData } = api.user.list.useQuery({
    ...pagination,
    query,
    roles: selectedRoles,
  });
  const data = useMemo(() => queryData?.users ?? [], [queryData]);

  const { table } = useTable({
    data,
    columns: userTableColumns,
    pagination: { pagination, setPagination },
    total: queryData?.total,
  });

  const handleRoleChange = (newRoles: string[]) => {
    setSelectedRoles(newRoles);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TableFilter className="w-100" />

          <SelectRole
            onRoleChange={handleRoleChange}
            selectedRoles={selectedRoles}
          />
          <MultiDeleteUsers table={table} />
        </div>
        <div className="flex items-center gap-2">
          <Button>
              <PlusCircle />
              Import
            </Button>
          <Link className="ml-auto" href={ROUTE.HOME.humanresource.create.path}>
            <Button>
              <PlusCircle />
              Tạo mới
            </Button>
          </Link>
        </div>
      </div>
      <DataTable table={table} />
      <div className="flex">
        <DataTablePagination className="flex-1" table={table} />
      </div>
    </div>
  );
}
