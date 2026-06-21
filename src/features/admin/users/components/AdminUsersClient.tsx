"use client";

import { useState } from "react";

import AdminPagination from "../../components/AdminPagination";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import { useAdminUsersInfiniteQuery } from "../hooks/useAdminUsersInfiniteQuery";

import { useListMode } from "@/features/admin/hooks/useListMode";
import { useMediaQuery } from "@/features/admin/hooks/useMediaQuery";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

import { AdminTable } from "@/features/admin/components/AdminTable";
import { AdminTableToolbar } from "@/features/admin/components/AdminTableToolbar";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";

import { useTableSort } from "@/features/admin/hooks/useTableSort";

import { ROUTES } from "@/shared/constants/routes";

import {
  ADMIN_USER_SEARCH_FIELD_OPTIONS,
  ADMIN_USER_SEARCH_FIELD,
  ADMIN_USER_SORT,
  ADMIN_USER_PAGE_SIZE,
  ADMIN_USER_FILTER_CONFIG,
  adminUserInitialFilterValue,
  AdminUserFilterKey,
  AdminUserSort,
  ADMIN_USER_PAGE_SIZE_OPTIONS,
} from "../types/search";

import { FilterValue } from "@/features/admin/constants/filters";
import { adminUserTableColumns } from "../constants/adminUserTable";
import { UserDto } from "@/features/users/dto/userDto";
import { FilterToolbar } from "../../components/FilterToolbar";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { getUserStatsStatusList, userStatsDefault } from "../constants/stats";

const AdminUsersClient = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [query, setQuery] = useState({
    page: 1,
    limit: ADMIN_USER_PAGE_SIZE.DEFAULT,
    search: "",
    searchField: ADMIN_USER_SEARCH_FIELD.NAME,
    sort: ADMIN_USER_SORT.NAME,
    sortOrder: "desc" as const,
    filters: adminUserInitialFilterValue,
  });

  /**
   * =========================
   * filter handler
   * =========================
   */
  const handleFilterChange = (key: AdminUserFilterKey, value: FilterValue) => {
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
  const { sort, onSort } = useTableSort<typeof query, AdminUserSort>(
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
    items: users,
    stats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,
    useQueryHook: useAdminUsersQuery,
    useInfiniteHook: useAdminUsersInfiniteQuery,
  });

  const today = new Date().toISOString().split("T")[0];

  const userStats = stats ?? userStatsDefault(today);
  const totalPages = pagination?.totalPages ?? 1;

  const activeRate =
    userStats.totalUsersSnapshot > 0
      ? (userStats.activeUsersCount / userStats.totalUsersSnapshot) * 100
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
  const handleRowClick = (item: UserDto) => {
    window.location.href = `${ROUTES.ADMIN_USERS}/${item._id}`;
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">사용자 관리</h1>
          <p className="text-muted-foreground text-sm">
            서비스에 가입된 사용자의 목록과 활동 상태를 관리합니다.
          </p>
        </div>
        {/* 필요하다면 여기에  버튼 등을 배치하세요 */}
      </div>

      <AdminStatsCard
        title="사용자 현황"
        items={getUserStatsStatusList(userStats)}
        progressValue={activeRate}
        total={userStats.totalUsersSnapshot}
      />
      <div className="flex flex-1 flex-col space-y-4">
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={ADMIN_USER_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={ADMIN_USER_PAGE_SIZE_OPTIONS}
        />

        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={ADMIN_USER_FILTER_CONFIG}
          initialValue={adminUserInitialFilterValue}
        />

        <AdminTable
          columns={adminUserTableColumns}
          data={users}
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

export default AdminUsersClient;
