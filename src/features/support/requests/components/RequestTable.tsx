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
import { RequestResponseDTO } from "../dtos"; // 정의된 DTO import
import { ROUTES } from "@/shared/constants/routes";

import { userRequestTableColumns } from "../constants/userRequestTableColumns";
import { UserRequestQuery, UserRequestSort } from "../types/user-search";

type Props = {
  requests: RequestResponseDTO[];
  isFetching: boolean;
  query: UserRequestQuery;
  onChange: (value: UserRequestQuery) => void;
};

export default function RequestTable({
  requests,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();
  const columnCount = userRequestTableColumns.length;

  const handleClick = (field: UserRequestSort) => {
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

  const handleRowClick = (requestId: string) => {
    router.push(`${ROUTES.SUPPORT_REQUESTS}/${requestId}`);
  };

  return (
    <div className="flex-1 px-2">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {userRequestTableColumns.map((col) => (
              <TableHead key={col.key}>
                <button
                  type="button"
                  className="flex w-full items-center gap-1"
                  onClick={() => handleClick(col.key as UserRequestSort)}
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
          {!isFetching && requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                접수된 문의 내역이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {!isFetching &&
            requests.map((req) => (
              <TableRow
                key={req._id}
                className="cursor-pointer"
                onClick={() => handleRowClick(req._id)}
              >
                {userRequestTableColumns.map((col) => (
                  <TableCell key={col.key}>{col.render(req)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
