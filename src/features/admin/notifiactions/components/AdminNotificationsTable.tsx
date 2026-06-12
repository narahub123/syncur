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

import { AdminNotificationsQuery, AdminNotificationSort } from "../types";

import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { NotificationWithSiteAndFeedExecutionLogDto } from "@/features/notifications/dtos/notificationDto";
import { adminNotificationTableColumns } from "../constants/adminNotificationsTable";

type Props = {
  notifications: NotificationWithSiteAndFeedExecutionLogDto[];
  isFetching: boolean;
  query: AdminNotificationsQuery;
  onChange: (value: AdminNotificationsQuery) => void;
};

export default function AdminNotificationTable({
  notifications,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const columnCount = adminNotificationTableColumns.length;

  const handleClick = (field: AdminNotificationSort) => {
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
            {adminNotificationTableColumns.map((col) => (
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
          {!isFetching && notifications.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground h-24 text-center"
              >
                알림이 없습니다
              </TableCell>
            </TableRow>
          )}

          {/* DATA */}
          {!isFetching &&
            notifications.length > 0 &&
            notifications.map((notification) => (
              <TableRow
                key={notification._id}
                className="max-w-2xl cursor-pointer xl:max-w-6xl"
                onClick={() =>
                  router.push(`/admin/notifications/${notification._id}`)
                }
              >
                {adminNotificationTableColumns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "max-w-25 truncate",
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left",
                    )}
                  >
                    {col.render(notification)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
