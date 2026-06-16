"use client";

import {
  AdminNoticeQuery,
  AdminNoticeResponseDTO,
  AdminNoticeSort,
} from "@/features/support/notices/types/admin-search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminNoticeTableColumns } from "../constants/adminNoticeTableColumns";

type Props = {
  notices: AdminNoticeResponseDTO[];
  isFetching: boolean;
  query: AdminNoticeQuery;
  onChange: (value: AdminNoticeQuery) => void;
};

export default function AdminNoticeTable({
  notices,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const columnCount = adminNoticeTableColumns.length;

  const handleClick = (field: AdminNoticeSort) => {
    if (query.sort === field) {
      onChange({
        ...query,
        sortOrder: query.sortOrder === "asc" ? "desc" : "asc",
        page: 1,
      });
      return;
    }
    onChange({ ...query, sort: field, sortOrder: "asc", page: 1 });
  };

  const handleRowClick = (noticeId: string) => {
    router.push(`/admin/notices/${noticeId}/edit`);
  };

  return (
    <div className="max-w-2xl flex-1 px-2 xl:max-w-6xl">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {adminNoticeTableColumns.map((col) => (
              <TableHead key={col.key}>
                <button
                  type="button"
                  className="flex w-full items-center gap-1"
                  onClick={() => handleClick(col.key as AdminNoticeSort)}
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
                <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
              </TableCell>
            </TableRow>
          )}
          {!isFetching && notices.length === 0 && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                등록된 공지사항이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {!isFetching &&
            notices.map((notice) => (
              <TableRow
                key={notice._id}
                className="cursor-pointer"
                onClick={() => handleRowClick(notice._id)}
              >
                {adminNoticeTableColumns.map((col) => (
                  <TableCell key={col.key}>{col.render(notice)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
