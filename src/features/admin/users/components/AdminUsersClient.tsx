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

  const totalPages = pagination?.totalPages ?? 1;

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
    <div className="w-full p-6">
      <h1 className="mb-6 text-2xl font-bold">유저 관리</h1>

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
