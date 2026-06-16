"use client";

import { useUserNoticesQuery } from "@/features/support/notices/hooks/useUserNoticesQuery";
import { useState } from "react";
import UserNoticeTableToolbar from "./UserNoticeTableToolbar";
import { UserNoticeQuery } from "../types/user-search";
import AdminPagination from "@/features/admin/components/AdminPagination";
import UserNoticeTable from "./UserNoticeTable";

const SupportNoticesClient = () => {
  // 1. 상태 관리: Query 객체를 상태로 관리
  const [query, setQuery] = useState<UserNoticeQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "title",
    sort: "createdAt",
    sortOrder: "desc",
  });

  // 2. 데이터 요청
  const { data, isFetching, error } = useUserNoticesQuery(query);

  const notices = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  if (error) return <div>공지사항을 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <p className="text-muted-foreground text-sm">
          서비스의 주요 업데이트와 안내 사항을 확인하세요.
        </p>
      </div>

      {isFetching && <div className="mb-2 text-sm">로딩 중...</div>}

      <div className="flex flex-1 flex-col space-y-2">
        {/* 🔹 검색 / 페이지 사이즈 컨트롤 */}
        <UserNoticeTableToolbar query={query} onChange={setQuery} />

        <UserNoticeTable
          notices={notices}
          query={query}
          onChange={setQuery}
          isFetching={isFetching}
        />

        {totalPages > 1 && (
          <AdminPagination
            page={query.page}
            totalPages={totalPages}
            onChange={(page) =>
              setQuery((prev) => ({
                ...prev,
                page,
              }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default SupportNoticesClient;
