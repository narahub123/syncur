"use client";

import { useState } from "react";
import { useAdminFeedExecutionLogsQuery } from "../hooks/useAdminFeedExecutionLogsQuery";
import AdminPagination from "../../components/AdminPagination";
import {
  ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG,
  ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS,
  ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELD_OPTIONS,
  AdminFeedExecutionLogFilterKey,
  AdminFeedExecutionLogInitialFilterValue,
  AdminFeedExecutionLogSort,
  AdminFeedExecutionLogsQuery,
} from "../types/search";
import { AdminTableToolbar } from "../../components/AdminTableToolbar";
import { useTableSort } from "../../hooks/useTableSort";
import { AdminTable } from "../../components/AdminTable";
import { adminFeedExecutionLogTableColumns } from "../constants/adminFeedExecutionLogTable";
import { FilterValue } from "../../constants/filters";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { getFeedExecutionLogStatusList } from "../constants/stats";
import { FilterToolbar } from "../../components/FilterToolbar";
import { useAdminFeedExecutionLogsInfiniteQuery } from "../hooks/useAdminFeedExecutionLogsInfiniteQuery";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import { useListMode } from "../../hooks/useListMode";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";

const AdminFeedExecutionLogsClient = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [query, setQuery] = useState<AdminFeedExecutionLogsQuery>({
    search: "",
    searchField: "siteName",
    sort: "startedAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
    filters: AdminFeedExecutionLogInitialFilterValue,
  });

  const handleFilterChange = (
    key: AdminFeedExecutionLogFilterKey,
    value: FilterValue,
  ) => {
    setQuery((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const { sort, onSort } = useTableSort<
    AdminFeedExecutionLogsQuery,
    AdminFeedExecutionLogSort
  >(query, setQuery);

  const {
    isLoading,
    items,
    stats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,

    useQueryHook: useAdminFeedExecutionLogsQuery,
    useInfiniteHook: useAdminFeedExecutionLogsInfiniteQuery,
  });

  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  const logs = items ?? [];
  const logStats = stats ?? { total: 0, fails: 0 };
  const totalPages = pagination?.totalPages ?? 1;

  const failRate =
    logStats.total > 0 ? (logStats.fails / logStats.total) * 100 : 0;

  const handleRowClick = (item: FeedExecutionLogWithFeedAndSiteDto) => {
    router.push(`${ROUTES.ADMIN_LOGS}/${item._id}`);
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <AdminStatsCard
        title="로그 현황"
        items={getFeedExecutionLogStatusList(logStats)}
        progressValue={failRate}
        total={stats?.total || 0}
        isLoading={isLoading}
      />
      <AdminTableToolbar
        query={query}
        onChange={setQuery}
        searchFieldOptions={ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELD_OPTIONS}
        pageSizeOptions={ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS}
        isLoading={isLoading}
      />
      <FilterToolbar
        filters={query.filters}
        onChange={handleFilterChange}
        config={ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG}
        initialValue={AdminFeedExecutionLogInitialFilterValue}
        isLoading={isLoading}
      />

      <AdminTable
        columns={adminFeedExecutionLogTableColumns}
        data={logs}
        isFetching={isLoading}
        sort={sort}
        onSort={onSort}
        onRowClick={handleRowClick}
      />

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
      {/* 👇 무한스크롤 트리거 */}
      {isMobile && <LoadMoreTrigger ref={loadMoreRef} className="h-10" />}

      {isMobile && isFetchingNextPage && (
        <div className="-mt-20 p-4 text-center">loading...</div>
      )}
    </div>
  );
};

export default AdminFeedExecutionLogsClient;
