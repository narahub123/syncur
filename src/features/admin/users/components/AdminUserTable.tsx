"use client";

import { UserDto } from "@/features/users/dto/userDto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useRouter } from "next/navigation";
import { userTableColumns } from "../constants/adminUserTable";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { AdminUserSort, AdminUsersQuery } from "../types";
import { ROUTES } from "@/shared/constants/routes";

type Props = {
  users: UserDto[];
  isFetching: boolean;
  query: AdminUsersQuery;
  onChange: (value: AdminUsersQuery) => void;
};

export default function AdminUserTable({
  users,
  isFetching,
  query,
  onChange,
}: Props) {
  const router = useRouter();

  const columnCount = userTableColumns.length;

  const handleClick = (field: AdminUserSort) => {
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
    <div className="flex-1 px-2">
      <Table className="border">
        {/* HEADER */}
        <TableHeader>
          <TableRow>
            {userTableColumns.map((col) => (
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
          {/* 🔹 LOADING ROW */}
          {isFetching && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-24 text-center">
                <div className="text-muted-foreground flex items-center justify-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* 🔹 EMPTY STATE */}
          {!isFetching && users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-muted-foreground h-24 text-center"
              >
                이용자가 없습니다
              </TableCell>
            </TableRow>
          )}

          {/* 🔹 DATA ROWS */}
          {!isFetching &&
            users.length > 0 &&
            users.map((user) => (
              <TableRow
                key={user._id}
                onClick={() => router.push(`${ROUTES.ADMIN_USERS}/${user._id}`)}
                className="cursor-pointer"
              >
                {userTableColumns.map((col) => (
                  <TableCell key={col.key}>{col.render(user)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
