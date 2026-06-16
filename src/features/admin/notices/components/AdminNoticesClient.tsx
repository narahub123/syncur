"use client";

import { useAdminNoticesQuery } from "@/features/support/notices/hooks/useAdminNoticesQuery";
import { AdminNoticeQuery } from "@/features/support/notices/types/admin-search";
import Link from "next/link";
import { useState } from "react";
import AdminPagination from "../../components/AdminPagination";
import AdminNoticeTableToolbar from "./AdminNoticeTableToolbar";
import AdminNoticeTable from "./AdminNoticeTable";

const AdminNoticesClient = () => {
  // 1. 상태 관리: Query 객체를 상태로 관리
  const [query, setQuery] = useState<AdminNoticeQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "title",
    sort: "createdAt",
    sortOrder: "desc",
  });

  // 2. 데이터 요청: 상태 변경 시 훅이 자동으로 재요청
  const { data, isFetching, error } = useAdminNoticesQuery(query);

  const notices = data?.items ?? [];

  const totalPages = data?.pagination?.totalPages ?? 1;

  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">공지사항 관리</h1>
          <p className="text-muted-foreground text-sm">
            공지 사항을 관리합니다.
          </p>
        </div>

        <Link
          href="/admin/notices/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          + 새 공지 등록
        </Link>
      </div>

      {/* 로딩 표시 (데이터 변경 시 깜빡임 방지용으로 isFetching 사용 가능) */}
      {isFetching && <div className="mb-2 text-sm">로딩 중...</div>}

      <div className="flex flex-1 flex-col space-y-2">
        {/* 🔹 검색 / 정렬 / 페이지 사이즈 컨트롤 */}
        <AdminNoticeTableToolbar query={query} onChange={setQuery} />

        <AdminNoticeTable
          notices={notices}
          query={query}
          onChange={setQuery}
          isFetching={isFetching}
        />
        {totalPages !== 1 && (
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

export default AdminNoticesClient;
