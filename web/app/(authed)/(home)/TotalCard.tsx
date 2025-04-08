"use client";

import { TableSearchAtom } from "@/components/shared/table/TableFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/protocol/trpc/client";
import { useAtomValue } from "jotai";
import { ComponentPropsWithRef, useMemo } from "react";

export function TotalCoachCard({
  role,
  className,
  ...props
}: { role: string } & ComponentPropsWithRef<"div">) {
  const query = useAtomValue(TableSearchAtom);
  const { data: queryData } = api.user.list.useQuery({
    page: 1,
    page_size: 99999,
    query: query,
    roles: [role],
  });
  const data = useMemo(() => queryData?.users ?? [], [queryData]);

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Total {role}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">{data.length}</div>
      </CardContent>
    </Card>
  );
}
