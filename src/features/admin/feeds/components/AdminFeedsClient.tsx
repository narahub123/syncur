"use client";

import { useState } from "react";
import { useAdminFeedsQuery } from "../hooks/useAdminFeedsQuery";
import AdminFeedTable from "./AdminFeedTable";
import AdminPagination from "../../components/AdminPagination";
import { AdminFeedsQuery } from "../types";
import AdminFeedTableToolbar from "./AdminFeedTableToolbar";

const AdminFeedsClient = () => {
  /**
   * 🔹 검색 / 정렬 / 페이지 상태를 하나의 query object로 관리
   * → React Query key와 완전히 동기화되는 구조
   */
  const [query, setQuery] = useState<AdminFeedsQuery>({
    search: "",
    searchField: "siteName",
    sort: "siteName",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });
  const { data, isFetching } = useAdminFeedsQuery(query);

  /**
   * 🔹 안전한 기본값 처리
   * 데이터 없을 때도 table 구조 유지하기 위해 빈 배열 사용
   */
  const feeds = data?.items ?? [];

  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="flex flex-1 flex-col">
      {/* 페이지 타이틀 */}
      <h3 className="p-2 font-medium">사이트 목록</h3>

      <div className="flex flex-1 flex-col space-y-2">
        {/* 🔹 검색 / 정렬 / 페이지 사이즈 컨트롤 */}
        <AdminFeedTableToolbar query={query} onChange={setQuery} />
        {/* 🔹 테이블 유지 구조 * - 로딩 중에도 UI 유지 * - 데이터 변경 시 깜빡임 방지 */}{" "}
        <AdminFeedTable
          feeds={feeds}
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

export default AdminFeedsClient;
