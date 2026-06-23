"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminPagination from "../../components/AdminPagination";
import { useListMode } from "@/features/admin/hooks/useListMode";
import { useMediaQuery } from "@/features/admin/hooks/useMediaQuery";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

import { AdminTable } from "@/features/admin/components/AdminTable";
import { AdminTableToolbar } from "@/features/admin/components/AdminTableToolbar";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";

import {
  BugReportQuery,
  bugReportInitialFilterValue,
  BUG_REPORT_SEARCH_FIELD_OPTIONS,
  BUG_REPORT_SEARCH_FIELD,
  BUG_REPORT_SORT,
  BUG_REPORT_PAGE_SIZE,
  BugReportFilterKey,
  BugReportSort,
  BUG_REPORT_PAGE_SIZE_OPTIONS,
  BUG_REPORT_FILTER_CONFIG,
} from "../types/search";

import { FilterValue } from "@/features/admin/constants/filters";
import { useTableSort } from "@/features/admin/hooks/useTableSort";

import { ROUTES } from "@/shared/constants/routes";
import { useAdminBugReportsQuery } from "../hooks/useAdminBugReportsQuery";
import { useAdminBugReportsInfiniteQuery } from "../hooks/useAdminBugReportsInfiniteQuery";
import { adminBugReportTableColumns } from "../constants/adminBugReportTableColumns";
import { FilterToolbar } from "../../components/FilterToolbar";
import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import {
  defaultBugReportStats,
  getBugReportStatusList,
} from "@/features/support/bug-reports/constants/stats";

const AdminBugReportsClient = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [query, setQuery] = useState<BugReportQuery>({
    page: 1,
    limit: BUG_REPORT_PAGE_SIZE.DEFAULT,
    search: "",
    searchField: BUG_REPORT_SEARCH_FIELD.TITLE,
    sort: BUG_REPORT_SORT.CREATED_AT,
    sortOrder: "desc",
    filters: bugReportInitialFilterValue,
  });

  /**
   * =========================
   * filter handler
   * =========================
   */
  const handleFilterChange = (key: BugReportFilterKey, value: FilterValue) => {
    setQuery((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  /**
   * =========================
   * sort handler
   * =========================
   */
  const { sort, onSort } = useTableSort<BugReportQuery, BugReportSort>(
    query,
    setQuery,
  );

  /**
   * =========================
   * data mode (pagination / infinite)
   * =========================
   */
  const {
    isLoading,
    items: bugReports,
    stats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,
    useQueryHook: useAdminBugReportsQuery,
    useInfiniteHook: useAdminBugReportsInfiniteQuery,
  });

  const bugReportStats = stats ?? defaultBugReportStats;
  const totalPages = pagination?.totalPages ?? 1;

  const completedRate =
    bugReportStats.total > 0
      ? (bugReportStats.completed / bugReportStats.total) * 100
      : 0;

  /**
   * =========================
   * infinite scroll (mobile)
   * =========================
   */
  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  /**
   * =========================
   * row click
   * =========================
   */
  const handleRowClick = (item: AdminBugReportResponseDTO) => {
    router.push(`${ROUTES.ADMIN_BUG_REPORTS}/${item._id}`);
  };

  return (
    <div className="w-full space-y-6 p-6">
      <h1 className="mb-6 text-2xl font-bold">버그 신고 관리</h1>

      <AdminStatsCard
        title="버그신고 현황"
        items={getBugReportStatusList(bugReportStats)}
        progressValue={completedRate}
        total={bugReportStats.total}
        isLoading={isLoading}
      />

      <div className="flex flex-1 flex-col space-y-4">
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={BUG_REPORT_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={BUG_REPORT_PAGE_SIZE_OPTIONS}
          isLoading={isLoading}
        />

        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={BUG_REPORT_FILTER_CONFIG}
          initialValue={bugReportInitialFilterValue}
          isLoading={isLoading}
        />

        <AdminTable
          columns={adminBugReportTableColumns}
          data={bugReports}
          isFetching={isLoading}
          sort={sort}
          onSort={onSort}
          onRowClick={handleRowClick}
        />

        {/* pagination (desktop) */}
        {totalPages > 1 && !isMobile && (
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

        {/* infinite scroll (mobile) */}
        {isMobile && <LoadMoreTrigger ref={loadMoreRef} className="h-10" />}

        {isMobile && isFetchingNextPage && (
          <div className="-mt-20 p-4 text-center">loading...</div>
        )}
      </div>
    </div>
  );
};

export default AdminBugReportsClient;
