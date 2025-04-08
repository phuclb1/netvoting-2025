import type { Row, Table as TableType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type { ForwardedRef, HTMLAttributes } from "react";
import { Fragment, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface Prop<TData> extends HTMLAttributes<HTMLDivElement> {
  table: TableType<TData>;
  isLoading?: boolean;
  stickyHeader?: boolean;
  spacing?: "sm" | "md";
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
}

function DataTableInner<TData>(
  {
    table,
    renderSubComponent,
    stickyHeader = false,
    isLoading = false,
    spacing = "md",
    className,
    ...props
  }: Prop<TData>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className={className} ref={ref} {...props}>
      <Table className="border-separate border-spacing-0">
        <TableHeader
          className={cn(
            stickyHeader ? "[&_th]:bg-muted [&_th]:sticky [&_th]:top-0" : "",
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className="border-b-border border-b"
                  key={header.id}
                  style={{
                    width:
                      header.getSize() === Number.MAX_SAFE_INTEGER
                        ? "auto"
                        : header.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="[&_td]:border-b-border [&_td]:border-b [&_tr:last-child_td]:border-0">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  // className="[&_td]:border-b [&_td]:border-b-muted-foreground"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={spacing === "sm" ? "p-2" : "p-4"}
                      key={cell.id}
                      style={{
                        width:
                          cell.column.getSize() === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && renderSubComponent ? (
                  <TableCell
                    className={spacing === "sm" ? "p-2" : "p-4"}
                    colSpan={row.getVisibleCells().length}
                  >
                    {renderSubComponent({ row })}
                  </TableCell>
                ) : null}
              </Fragment>
            ))
          ) : (
            <TableRow className="[&_tr]:border-border">
              <TableCell
                className={cn(
                  "h-24 text-center",
                  spacing === "sm" ? "p-2" : "p-4",
                )}
                colSpan={table.getAllColumns().length}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1">
                    <Loader2 className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "No results."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const DataTable = forwardRef(DataTableInner);
