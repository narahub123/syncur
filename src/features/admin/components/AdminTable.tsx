"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/utils/cn";
import { LoaderCircle } from "lucide-react";

import { SORT_ORDER, SortOrder } from "@/shared/types/pagination";
import { Column, COLUMN_ALIGN, ColumnAlignType } from "../types/admin-table";

type Props<T, K extends string> = {
  data: T[];
  columns: Column<T, K>[];
  isFetching: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  sort?: { key?: K; order?: SortOrder };
  onSort?: (key: K) => void;
};

export function AdminTable<T extends { _id: string }, K extends string>({
  data,
  columns,
  isFetching,
  onRowClick,
  emptyMessage = "데이터가 없습니다.",
  sort,
  onSort,
}: Props<T, K>) {
  const getAlignClass = (align?: ColumnAlignType) => {
    if (align === COLUMN_ALIGN.CENTER) return "text-center";
    if (align === COLUMN_ALIGN.RIGHT) return "text-right";
    return "text-left";
  };

  // flex 내부 정렬을 위한 추가 유틸
  const getFlexJustify = (align?: ColumnAlignType) => {
    if (align === COLUMN_ALIGN.CENTER) return "justify-center";
    if (align === COLUMN_ALIGN.RIGHT) return "justify-end";
    return "justify-start";
  };

  console.log(data);

  return (
    <>
      <div className="hidden w-full overflow-x-auto border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    getAlignClass(col.align),
                    col.sortable
                      ? "cursor-pointer select-none hover:bg-gray-50"
                      : "",
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      getFlexJustify(col.align),
                    )}
                  >
                    {col.header}
                    {/* 화살표 공간 고정 */}
                    <span className="flex w-4 shrink-0 justify-center">
                      {col.sortable && sort?.key === col.key && (
                        <span>
                          {sort?.order === SORT_ORDER.DESC ? "▲" : "▼"}
                        </span>
                      )}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <LoadingRow colSpan={columns.length} />
            ) : data.length === 0 ? (
              <EmptyRow colSpan={columns.length} message={emptyMessage} />
            ) : (
              data.map((item) => (
                <TableRow
                  key={item._id}
                  className={cn(onRowClick ? "cursor-pointer" : "")}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        getAlignClass(col.align),
                        "max-w-50 truncate",
                      )}
                    >
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        {isFetching ? (
          <div className="col-span-full flex h-24 items-center justify-center">
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground col-span-full flex h-24 items-center justify-center text-sm">
            {emptyMessage}
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item._id}
              className={cn(
                "space-y-2 rounded-lg border bg-white p-4",
                onRowClick ? "cursor-pointer" : "",
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-semibold text-gray-500">
                    {col.header}
                  </span>
                  <div
                    className={cn(
                      getAlignClass(col.align),
                      "max-w-50 truncate sm:max-w-32",
                    )}
                  >
                    {col.render(item)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

const LoadingRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
    </TableCell>
  </TableRow>
);

const EmptyRow = ({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      {message}
    </TableCell>
  </TableRow>
);
