"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  ColumnDef,
  ColumnFiltersState,
  InitialTableState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  Updater,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

interface Props<TData> {
  /**
   * @param data must be stable
   * @example
   * ```typescript
   * const { userList } = useUsers();
   * const data = useMemo(() => userList ?? [], [userList]);
   *
   * const { table } = useTable({ data, columns, .. });
   * ```
   *
   * @link https://github.com/TanStack/table/issues/4566
   * */
  data: TData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  total?: number;
  initialState?: InitialTableState;
  columnFilters?: {
    columnFilters: ColumnFiltersState;
    setColumnFilters: OnChangeFn<ColumnFiltersState> | undefined;
  };
  rowSelection?: {
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState> | undefined;
  };
  pagination?: {
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState> | undefined;
  };
}

const DEFAULT = {
  pagination: { pageIndex: 1, pageSize: 15 } satisfies PaginationState,
  columnFilters: [] satisfies ColumnFiltersState,
  rowSelection: {} satisfies RowSelectionState,
};

export function useTable<TData>({
  data,
  columns,
  initialState,
  total: rowCount,
  columnFilters: controlledColumnFilters,
  rowSelection: controlledRowSelection,
  pagination: controlledPagination,
}: Props<TData>) {
  const [pagination, onPaginationChange] = useInternalState({
    prop: controlledPagination?.pagination,
    onChange: controlledPagination?.setPagination,
    defaultProp: DEFAULT.pagination,
  });

  const zeroBasedPagination = useMemo(
    () => ({
      pageIndex: pagination.pageIndex - 1,
      pageSize: pagination.pageSize,
    }),
    [pagination]
  );
  const zeroBasedOnPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      // 1-based to 0-based conversion
      if (typeof updater === "function") {
        onPaginationChange((old) => {
          const { pageIndex, pageSize } = updater(old);
          return { pageIndex: pageIndex - 1, pageSize };
        });
      } else {
        const { pageIndex, pageSize } = updater;
        onPaginationChange({ pageSize, pageIndex: pageIndex - 1 });
      }
    },
    [onPaginationChange]
  );

  const [columnFilters, onColumnFiltersChange] = useInternalState({
    prop: controlledColumnFilters?.columnFilters,
    onChange: controlledColumnFilters?.setColumnFilters,
    defaultProp: DEFAULT.columnFilters,
  });
  const [rowSelection, onRowSelectionChange] = useInternalState({
    prop: controlledRowSelection?.rowSelection,
    onChange: controlledRowSelection?.setRowSelection,
    defaultProp: DEFAULT.rowSelection,
  });

  const table = useReactTable({
    // see: https://github.com/TanStack/table/issues/4566
    data,
    columns,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    // NOTE: all rows can be expanded, this might be the desired behaviour
    // since we want full JSON data on all events
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,

    rowCount,

    // pass state to let the hook manage data
    onColumnFiltersChange,
    onRowSelectionChange,
    onPaginationChange: zeroBasedOnPaginationChange,
    // if we want to override initial state
    initialState,

    state: {
      columnFilters,
      rowSelection,
      // 1-based to 0-based conversion
      pagination: zeroBasedPagination,
    },
  });

  return { table };
}

type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp: T;
  onChange?: (state: T) => void;
};
function useInternalState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>) {
  const [state, _setState] = useControllableState({
    prop,
    defaultProp,
    onChange,
  });
  const setState = (updater: Updater<T>) =>
    _setState((old) => {
      // NOTE: noop if previous value is undefined
      // should not happen as we get a type error if we don't pass defaultProp
      if (!old) {
        return;
      }
      return updater instanceof Function ? updater(old) : updater;
    });

  return [state as T, setState] as const;
}
