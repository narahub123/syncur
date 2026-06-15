"use client";

import { FaqWithUserDto } from "@/features/support/faqs/dtos";
import {
  AdminFaqSort,
  AdminFaqsQuery,
} from "@/features/support/faqs/types/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { adminFaqTableColumns } from "../constans/adminFaqTableColumns";
import { useRouter } from "next/navigation";

type Props = {
  faqs: FaqWithUserDto[];
  isFetching: boolean;
  query: AdminFaqsQuery;
  onChange: (value: AdminFaqsQuery) => void;
};

export default function AdminFaqTable({
  faqs,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const columnCount = adminFaqTableColumns.length;

  const handleClick = (field: AdminFaqSort) => {
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

  const handleRowClick = (faqId: string) => {
    router.push(`/admin/faqs/${faqId}/edit`);
  };

  return (
    <div className="max-w-2xl flex-1 px-2 xl:max-w-6xl">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {adminFaqTableColumns.map((col) => (
              <TableHead key={col.key}>
                <button
                  type="button"
                  className="flex w-full items-center gap-1"
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
          {isFetching && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
              </TableCell>
            </TableRow>
          )}
          {!isFetching && faqs.length === 0 && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                등록된 FAQ가 없습니다.
              </TableCell>
            </TableRow>
          )}
          {!isFetching &&
            faqs.map((faq) => (
              <TableRow
                key={faq._id}
                className="cursor-pointer" // 마우스 커서 모양 유지
                onClick={() => handleRowClick(faq._id)} // 클릭 이벤트 연결
              >
                {adminFaqTableColumns.map((col) => (
                  <TableCell key={col.key}>{col.render(faq)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
