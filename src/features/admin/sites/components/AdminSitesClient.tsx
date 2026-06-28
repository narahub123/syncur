"use client";

import { AdminTableToolbar } from "../../components/AdminTableToolbar";
import { AdminTable } from "../../components/AdminTable";
import { useTableSort } from "../../hooks/useTableSort";
import { useState } from "react";
import {
  ADMIN_SITE_FILTER_CONFIG,
  ADMIN_SITE_PAGE_SIZE_OPTIONS,
  ADMIN_SITE_SEARCH_FIELD_OPTIONS,
  ADMIN_SITE_SEARCH_FIELDS,
  ADMIN_SITE_SORT_FIELDS,
  AdminSiteFilterKey,
  AdminSiteQuery,
  AdminSiteSort,
  AdminSiteInitialFilterValue,
} from "../types/search";
import { SORT_ORDER } from "@/shared/types/pagination";
import AdminPagination from "../../components/AdminPagination";
import { adminSiteColumns } from "../constants/search-columns";
import { useAdminSites } from "@/features/admin/sites/hooks/useAdminSites";
import { FilterBar } from "../../components/FilterBar";
import { FilterValue } from "../../constants/filters";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { defaultSiteStats, getRssStatusList } from "../constants/stats";

export const AdminSitesClient = () => {
  const [query, setQuery] = useState<AdminSiteQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: ADMIN_SITE_SEARCH_FIELDS.NAME,
    sort: ADMIN_SITE_SORT_FIELDS.CREATED_AT,
    sortOrder: SORT_ORDER.DESC,
    filters: AdminSiteInitialFilterValue,
  });

  const handleFilterChange = (key: AdminSiteFilterKey, value: FilterValue) => {
    setQuery((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const { sort, onSort } = useTableSort<AdminSiteQuery, AdminSiteSort>(
    query,
    setQuery,
  );

  const { data, isLoading } = useAdminSites(query);

  const sites = data?.items ?? [];
  const stats = data?.stats ?? defaultSiteStats;
  const totalPages = data?.pagination?.totalPages ?? 1;

  /**
   * feedRate
   * - 실제 수집 가능한 사이트 비율
   * - RSS + 크롤링 가능 사이트 기준
   */
  const feedRate =
    stats.total > 0 ? ((stats.rss + stats.crawlable) / stats.total) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      <AdminStatsCard
        title="사이트 수집 현황"
        items={getRssStatusList(stats)}
        progressValue={feedRate}
        total={stats.total}
        isLoading={isLoading}
      />
      <AdminTableToolbar
        query={query}
        onChange={setQuery}
        searchFieldOptions={ADMIN_SITE_SEARCH_FIELD_OPTIONS}
        pageSizeOptions={ADMIN_SITE_PAGE_SIZE_OPTIONS}
        isLoading={isLoading}
      />
      <FilterBar
        filters={query.filters}
        onChange={handleFilterChange}
        config={ADMIN_SITE_FILTER_CONFIG}
        initialValue={AdminSiteInitialFilterValue}
      />
      <AdminTable
        columns={adminSiteColumns}
        data={sites}
        isFetching={isLoading}
        sort={sort}
        onSort={onSort}
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
  );
};
