"use client";

import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { adminFeedTableColumns } from "../constants/adminFeedTable";
import { AdminFeedSort, AdminFeedsQuery } from "../types";

type Props = {
  feeds: FeedWithSiteDto[];
  isFetching: boolean;
  query: AdminFeedsQuery;
  onChange: (value: AdminFeedsQuery) => void;
};

export default function AdminFeedTable({
  feeds,
  isFetching,
  query,
  onChange,
}: Props) {
  const columnCount = adminFeedTableColumns.length;

  const handleClick = (field: AdminFeedSort) => {
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
    <div className="max-w-2xl flex-1 overflow-x-auto px-2 xl:max-w-6xl">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {adminFeedTableColumns.map((col) => (
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
                  className="flex w-full cursor-pointer items-center gap-1"
                  onClick={() => handleClick(col.key)}
                  title={
                    query.sort === col.key
                      ? `${col.header} ${query.sortOrder === "asc" ? "오름차순 정렬 중" : "내림차순 정렬 중"}`
                      : `${col.header} 기준 정렬`
                  }
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
          {isFetching && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                <div className="text-muted-foreground flex items-center justify-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isFetching && feeds.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground h-24 text-center"
              >
                피드가 없습니다
              </TableCell>
            </TableRow>
          )}

          {!isFetching &&
            feeds.length > 0 &&
            feeds.map((feed) => (
              <TableRow key={feed._id}>
                {adminFeedTableColumns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="max-w-35 truncate"
                    title={col.render(feed).toString()}
                  >
                    {col.render(feed)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
