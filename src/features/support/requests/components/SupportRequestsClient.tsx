"use client";

import { useState } from "react";
import { useUserRequestsQuery } from "@/features/support/requests/hooks/useUserRequestsQuery";
import AdminPagination from "@/features/admin/components/AdminPagination";
import {
  USER_PAGE_SIZE,
  USER_PAGE_SIZE_OPTIONS,
  USER_REQUEST_FILTER_CONFIG,
  USER_REQUEST_SEARCH_FIELD,
  USER_REQUEST_SEARCH_FIELD_OPTIONS,
  USER_REQUEST_SORT,
  UserRequestFilterKey,
  userRequestInitialFilterValue,
  UserRequestQuery,
  UserRequestSort,
} from "../types/search";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/features/admin/hooks/useMediaQuery";
import { FilterValue } from "@/features/admin/constants/filters";
import { useTableSort } from "@/features/admin/hooks/useTableSort";
import { useListMode } from "@/features/admin/hooks/useListMode";
import { useUserRequestsInfiniteQuery } from "../hooks/useUserRequestsInfiniteQuery";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { AdminTableToolbar } from "@/features/admin/components/AdminTableToolbar";
import { FilterToolbar } from "@/features/admin/components/FilterToolbar";
import { AdminTable } from "@/features/admin/components/AdminTable";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import { RequestResponseDTO } from "../dtos";
import { ROUTES } from "@/shared/constants/routes";
import { userRequestTableColumns } from "../constants/userRequestTableColumns";
import { SORT_ORDER } from "@/shared/types/pagination";

const SupportRequestsClient = () => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [query, setQuery] = useState<UserRequestQuery>({
    page: 1,
    limit: USER_PAGE_SIZE.DEFAULT,
    search: "",
    searchField: USER_REQUEST_SEARCH_FIELD.TITLE,
    sort: USER_REQUEST_SORT.CREATED_AT,
    sortOrder: SORT_ORDER.DESC,
    filters: userRequestInitialFilterValue,
  });

  const handleFilterChange = (
    key: UserRequestFilterKey,
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

  const { sort, onSort } = useTableSort<UserRequestQuery, UserRequestSort>(
    query,
    setQuery,
  );

  const {
    isLoading,
    items: requests,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,

    useQueryHook: useUserRequestsQuery,
    useInfiniteHook: useUserRequestsInfiniteQuery,
  });

  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  const totalPages = pagination?.totalPages ?? 1;

  const handleRowClick = (item: RequestResponseDTO) => {
    router.push(`${ROUTES.SUPPORT_REQUESTS}/${item._id}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">1:1 문의 내역</h1>
        <p className="text-muted-foreground text-sm">
          접수하신 문의와 버그 신고 내역 및 처리 상태를 확인하세요.
        </p>
      </div>

      <div className="flex flex-1 flex-col space-y-4">
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={USER_REQUEST_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={USER_PAGE_SIZE_OPTIONS}
        />
        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={USER_REQUEST_FILTER_CONFIG}
          initialValue={userRequestInitialFilterValue}
        />
        <AdminTable
          columns={userRequestTableColumns}
          data={requests}
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
    </div>
  );
};

export default SupportRequestsClient;
