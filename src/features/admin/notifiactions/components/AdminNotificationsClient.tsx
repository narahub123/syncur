"use client";

import { useState } from "react";
import { AdminNotificationsQuery } from "../types";
import { useAdminNotificationsQuery } from "../hooks/useAdminNotificationsQuery";
import AdminPagination from "../../components/AdminPagination";
import AdminNotificationsTableToolbar from "./AdminNotificationsTableToolbar";
import AdminNotificationsTable from "./AdminNotificationsTable";

const AdminNotificationsClient = () => {
  /**
   * 🔹 검색 / 정렬 / 페이지 상태를 하나의 query object로 관리
   * → React Query key와 완전히 동기화되는 구조
   */
  const [query, setQuery] = useState<AdminNotificationsQuery>({
    search: "",
    searchField: "title",
    sort: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  /**
   * 🔹 데이터 요청
   * isFetching: 데이터 갱신 중 포함 (pagination / search 변경 시 사용)
   */
  const { data, isFetching } = useAdminNotificationsQuery(query);

  /**
   * 🔹 안전한 기본값 처리
   * 데이터 없을 때도 table 구조 유지하기 위해 빈 배열 사용
   */
  const notifications = data?.items ?? [];

  const totalPages = data?.pagination.totalPages ?? 1;
  return (
    <div className="flex flex-1 flex-col">
      {/* 페이지 타이틀 */}
      <h3 className="p-2 font-medium">이용자 목록</h3>

      <div className="flex flex-1 flex-col space-y-2">
        {/* 🔹 검색 / 정렬 / 페이지 사이즈 컨트롤 */}
        <AdminNotificationsTableToolbar query={query} onChange={setQuery} />
        {/* 🔹 테이블 유지 구조 * - 로딩 중에도 UI 유지 * - 데이터 변경 시 깜빡임 방지 */}{" "}
        <AdminNotificationsTable
          notifications={notifications}
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

export default AdminNotificationsClient;
