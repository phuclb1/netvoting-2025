"use client";

import { usePagination } from "@/lib/params";
import {
  TableFilter,
  TableSearchAtom,
} from "@/components/shared/table/TableFilter";
import { useAtomValue } from "jotai";
import { api } from "@/protocol/trpc/client";
import { useMemo } from "react";
import { useTable } from "@/components/shared/table/useTable";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import { DataTable } from "@/components/shared/table/DataTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ROUTE } from "@/lib/constants";
import { MultiDeleteCenters } from "./_component/MultipleDeleteCenter";
import { centerTableColumns } from "@/components/shared/table/CenterTableColumns";

export function CenterTable() {
  const [pagination, setPagination] = usePagination();
  const query = useAtomValue(TableSearchAtom);
  const { data: queryData } = api.center.list.useQuery({
    ...pagination,
    query,
  });
  const data = useMemo(() => queryData?.centers ?? [], [queryData]);

  const { table } = useTable({
    data,
    columns: centerTableColumns,
    pagination: { pagination, setPagination },
    total: queryData?.total,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TableFilter className="w-100" />

          <MultiDeleteCenters table={table} />
        </div>

        <Link className="ml-auto" href={ROUTE.HOME.trainingcenter.create.path}>
          <Button>
            <PlusCircle />
            New
          </Button>
        </Link>
      </div>
      <DataTable table={table} />
      <div className="flex">
        <DataTablePagination className="flex-1" table={table} />
      </div>
    </div>
  );
}
