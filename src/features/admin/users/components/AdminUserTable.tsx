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
import { LoaderCircle } from "lucide-react";

type Props = {
  users: UserDto[];
  isFetching: boolean;
};

export default function AdminUserTable({ users, isFetching }: Props) {
  const router = useRouter();

  const columnCount = userTableColumns.length;

  return (
    <div className="flex-1 px-2">
      <Table className="border">
        {/* HEADER */}
        <TableHeader>
          <TableRow>
            {userTableColumns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
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
                  로딩 중...
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
                onClick={() => router.push(`/users/${user._id}`)}
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
