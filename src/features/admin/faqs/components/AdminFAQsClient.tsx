"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminFaqsQuery } from "@/features/support/faqs/hooks/useAdminFaqsQuery";
import AdminPagination from "../../components/AdminPagination"; // 기존 페이지네이션 컴포넌트
import { AdminFaqsQuery } from "@/features/support/faqs/types/search";
import AdminFaqTable from "./AdminFaqTable";
import AdminFaqTableToolbar from "./AdminFaqTableToolbar";

const AdminFAQsClient = () => {
  // 1. 상태 관리: Query 객체를 상태로 관리
  const [query, setQuery] = useState<AdminFaqsQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "question",
    sort: "createdAt",
    sortOrder: "desc",
  });

  // 2. 데이터 요청: 상태 변경 시 훅이 자동으로 재요청
  const { data, isFetching, error } = useAdminFaqsQuery(query);

  const faqs = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQ 관리</h1>
          <p className="text-muted-foreground text-sm">
            고객센터에 노출되는 자주 묻는 질문을 관리합니다.
          </p>
        </div>

        <Link
          href="/admin/faqs/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          + 새 FAQ 등록
        </Link>
      </div>

      {/* 로딩 표시 (데이터 변경 시 깜빡임 방지용으로 isFetching 사용 가능) */}
      {isFetching && <div className="mb-2 text-sm">로딩 중...</div>}

      <div className="flex flex-1 flex-col space-y-2">
        {/* 🔹 검색 / 정렬 / 페이지 사이즈 컨트롤 */}
        <AdminFaqTableToolbar query={query} onChange={setQuery} />
        {/* 🔹 테이블 유지 구조 * - 로딩 중에도 UI 유지 * - 데이터 변경 시 깜빡임 방지 */}{" "}
        <AdminFaqTable
          faqs={faqs}
          isFetching={isFetching}
          query={query}
          onChange={setQuery}
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

export default AdminFAQsClient;
