"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";

import {
  AdminFeedExecutionLogsQuery,
  AdminFeedExecutionLogSort,
} from "../types";

import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { adminFeedExecutionLogTableColumns } from "../constants/adminFeedExecutionLogTable";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";

type Props = {
  logs: FeedExecutionLogWithFeedAndSiteDto[];
  isFetching: boolean;
  query: AdminFeedExecutionLogsQuery;
  onChange: (value: AdminFeedExecutionLogsQuery) => void;
};

export default function AdminFeedExecutionLogTable({
  logs,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const columnCount = adminFeedExecutionLogTableColumns.length;

  const handleClick = (field: AdminFeedExecutionLogSort) => {
    if (query.sort === field) {
      onChange({
        ...query,
        sortOrder: query.sortOrder === "asc" ? "desc" : "asc",
        page: 1,
      });
      return;
    }

    onChange({
      ...query,
      sort: field,
      sortOrder: "asc",
      page: 1,
    });
  };

  return (
    <div className="max-w-2xl flex-1 px-2 xl:max-w-6xl">
      <Table className="border">
        {/* HEADER */}
        <TableHeader>
          <TableRow>
            {adminFeedExecutionLogTableColumns.map((col) => (
              <TableHead
                key={col.key}
                aria-sort={
                  query.sort === col.key
                    ? query.sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-1",
                    col.align === "center"
                      ? "justify-center"
                      : col.align === "right"
                        ? "justify-end"
                        : "",
                  )}
                  onClick={() => handleClick(col.key)}
                >
                  <span>{col.header}</span>

                  {query.sort === col.key &&
                    (query.sortOrder === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* LOADING */}
          {isFetching && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                <div className="text-muted-foreground flex justify-center">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* EMPTY */}
          {!isFetching && logs.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground h-24 text-center"
              >
                로그가 없습니다
              </TableCell>
            </TableRow>
          )}

          {/* DATA */}
          {!isFetching &&
            logs.length > 0 &&
            logs.map((log) => (
              <TableRow
                key={log.executionId}
                className="max-w-2xl cursor-pointer xl:max-w-6xl"
                onClick={() => router.push(`/admin/logs/${log._id}`)}
              >
                {adminFeedExecutionLogTableColumns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={
                      (cn("max-w-25 truncate"),
                      `${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left"
                      }`)
                    }
                  >
                    {col.render(log)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
