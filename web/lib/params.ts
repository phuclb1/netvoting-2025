import { PaginationState } from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { parseAsInteger } from "nuqs/server";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { paginationSchema } from "./schemas/params";

export const paginationParamsParser = {
  // NOTE: better to use same params as backend here.
  // this param hook goes before the usePagination hook
  // we'll serialize name to snake case later in trpc routers
  page: parseAsInteger.withDefault(
    paginationSchema.shape.page._def.defaultValue()
  ),
  page_size: parseAsInteger.withDefault(
    paginationSchema.shape.page_size._def.defaultValue()
  ),
};

export function usePagination() {
  const [search, setSearch] = useQueryStates(paginationParamsParser);
  const pagination = useMemo<PaginationState>(
    () => ({ pageIndex: search.page, pageSize: search.page_size }),
    [search]
  );

  const setPagination: Dispatch<SetStateAction<PaginationState>> = useCallback(
    (to) => {
      if (typeof to === "function") {
        setSearch((e) => {
          const { pageSize: page_size, pageIndex: page } = to({
            pageSize: e.page_size,
            pageIndex: e.page,
          });
          return { page, page_size };
        });
      } else {
        setSearch({ page: to.pageIndex, page_size: to.pageSize });
      }
    },
    [setSearch]
  );
  return [pagination, setPagination] as const;
}
