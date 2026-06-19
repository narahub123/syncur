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
import { useRouter } from "next/navigation";
import { userNoticeTableColumns } from "../constants/userNoticeTableColumns";
import { UserNoticeQuery, UserNoticeSort } from "../types/search";
import { NoticeResponseDTO } from "../dtos/noticeDto";
import { ROUTES } from "@/shared/constants/routes";

type Props = {
  notices: NoticeResponseDTO[];
  isFetching: boolean;
  query: UserNoticeQuery;
  onChange: (value: UserNoticeQuery) => void;
};

export default function UserNoticeTable({
  notices,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const columnCount = userNoticeTableColumns.length;

  const handleClick = (field: UserNoticeSort) => {
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
    // 유저용 공지사항 상세 보기 경로
    router.push(`${ROUTES.SUPPORT_NOTICES}/${noticeId}`);
  };

  return (
    <div className="flex-1 px-2">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {userNoticeTableColumns.map((col) => (
              <TableHead key={col.key}>
                <button
                  type="button"
                  className="flex w-full items-center gap-1"
                  onClick={() => handleClick(col.key as UserNoticeSort)}
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
                {userNoticeTableColumns.map((col) => (
                  <TableCell key={col.key}>{col.render(notice)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
