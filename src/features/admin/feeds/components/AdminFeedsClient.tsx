"use client";

import { useState } from "react";
import { useAdminFeedsQuery } from "../hooks/useAdminFeedsQuery";
import AdminPagination from "../../components/AdminPagination";
import {
  ADMIN_FEED_FILTER_CONFIG,
  ADMIN_FEED_PAGE_SIZE_OPTIONS,
  ADMIN_FEED_SEARCH_FIELD_OPTIONS,
  AdminFeedFilterKey,
  AdminFeedInitialFilterValue,
  AdminFeedSort,
  AdminFeedsQuery,
} from "../types/search";
import { AdminTableToolbar } from "../../components/AdminTableToolbar";
import { useTableSort } from "../../hooks/useTableSort";
import { AdminTable } from "../../components/AdminTable";
import { adminFeedTableColumns } from "../constants/adminFeedTable";
import { FilterValue } from "../../constants/filters";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { getFeedStatusList } from "../constants/stats";
import { FilterToolbar } from "../../components/FilterToolbar";

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
    filters: AdminFeedInitialFilterValue,
  });

  const handleFilterChange = (key: AdminFeedFilterKey, value: FilterValue) => {
    setQuery((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const { sort, onSort } = useTableSort<AdminFeedsQuery, AdminFeedSort>(
    query,
    setQuery,
  );

  const { data, isFetching } = useAdminFeedsQuery(query);

  /**
   * 🔹 안전한 기본값 처리
   * 데이터 없을 때도 table 구조 유지하기 위해 빈 배열 사용
   */
  const feeds = data?.items ?? [];
  const stats = data?.stats ?? { total: 0, active: 0, inactive: 0 };
  const totalPages = data?.pagination.totalPages ?? 1;

  const activeRate = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;
  return (
    <div className="space-y-6 p-6">
      <AdminStatsCard
        title="피드 현황"
        items={getFeedStatusList(stats)}
        progressValue={activeRate}
        total={stats.total}
      />
      {/* 🔹 검색 / 정렬 / 페이지 사이즈 컨트롤 */}
      <AdminTableToolbar
        query={query}
        onChange={setQuery}
        searchFieldOptions={ADMIN_FEED_SEARCH_FIELD_OPTIONS}
        pageSizeOptions={ADMIN_FEED_PAGE_SIZE_OPTIONS}
      />
      <FilterToolbar
        filters={query.filters}
        onChange={handleFilterChange}
        config={ADMIN_FEED_FILTER_CONFIG}
        initialValue={AdminFeedInitialFilterValue}
      />
      {/* 🔹 테이블 유지 구조 * - 로딩 중에도 UI 유지 * - 데이터 변경 시 깜빡임 방지 */}{" "}
      <AdminTable
        columns={adminFeedTableColumns}
        data={feeds}
        isFetching={isFetching}
        sort={sort}
        onSort={onSort}
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
  );
};

export default AdminFeedsClient;
