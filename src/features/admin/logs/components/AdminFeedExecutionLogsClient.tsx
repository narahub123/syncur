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
import { FilterBar } from "../../components/FilterBar";
import { FilterValue } from "../../constants/filters";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { getFeedExecutionLogStatusList } from "../constants/stats";

const AdminFeedExecutionLogsClient = () => {
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

  const { data, isFetching } = useAdminFeedExecutionLogsQuery(query);
  console.log("data", data?.stats);
  const logs = data?.items ?? [];
  const stats = data?.stats ?? { total: 0, fails: 0 };
  const totalPages = data?.pagination.totalPages ?? 1;

  const failRate = stats.total > 0 ? (stats.fails / stats.total) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      <AdminStatsCard
        title="로그 현황"
        items={getFeedExecutionLogStatusList(stats)}
        progressValue={failRate}
        total={stats?.total || 0}
      />
      <AdminTableToolbar
        query={query}
        onChange={setQuery}
        searchFieldOptions={ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELD_OPTIONS}
        pageSizeOptions={ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS}
      />

      <FilterBar
        filters={query.filters}
        onChange={handleFilterChange}
        config={ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG}
        initialValue={AdminFeedExecutionLogInitialFilterValue}
      />

      <AdminTable
        columns={adminFeedExecutionLogTableColumns}
        data={logs}
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

export default AdminFeedExecutionLogsClient;
