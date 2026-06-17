"use client";

import { adminInquiryTableColumns } from "@/features/support/requests/constants/adminInquiryTableColumns";
import {
  AdminRequestQuery,
  AdminRequestResponseDTO,
  AdminRequestSort,
} from "@/features/support/requests/types/admin-search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { LoaderCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  inquiries: AdminRequestResponseDTO[];
  isFetching: boolean;
  query: AdminRequestQuery;
  onChange: (value: AdminRequestQuery) => void;
};

export default function AdminInquiryTable({
  inquiries,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const handleSort = (field: AdminRequestSort) => {
    const isAsc = query.sort === field && query.sortOrder === "asc";
    onChange({
      ...query,
      sort: field,
      sortOrder: isAsc ? "desc" : "asc",
      page: 1,
    });
  };

  return (
    <Table className="rounded-lg border">
      <TableHeader>
        <TableRow>
          {adminInquiryTableColumns.map((col) => (
            <TableHead key={col.key}>
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort(col.key)}
              >
                {col.header}
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
        {isFetching ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              <LoaderCircle className="mx-auto animate-spin" />
            </TableCell>
          </TableRow>
        ) : inquiries.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              문의 내역이 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          inquiries.map((req) => (
            <TableRow
              key={req._id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => router.push(`/admin/inquiries/${req._id}`)}
            >
              {adminInquiryTableColumns.map((col) => (
                <TableCell key={col.key}>{col.render(req)}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
