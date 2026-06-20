"use client";

import { useUserNoticesQuery } from "@/features/support/notices/hooks/useUserNoticesQuery";
import { useState } from "react";
import {
  USER_NOTICE_FILTER_CONFIG,
  USER_NOTICE_SEARCH_FIELD,
  USER_NOTICE_SEARCH_FIELD_OPTIONS,
  USER_NOTICE_SORT,
  USER_PAGE_SIZE,
  USER_PAGE_SIZE_OPTIONS,
  UserNoticeFilterKey,
  userNoticeInitialFilterValue,
  UserNoticeSort,
  UserNoticesQuery,
} from "../types/search";
import AdminPagination from "@/features/admin/components/AdminPagination";
import { SORT_ORDER } from "@/shared/types/pagination";
import { AdminTableToolbar } from "@/features/admin/components/AdminTableToolbar";
import { FilterToolbar } from "@/features/admin/components/FilterToolbar";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { userNoticeTableColumns } from "../constants/userNoticeTableColumns";
import { FilterValue } from "@/features/admin/constants/filters";
import { useTableSort } from "@/features/admin/hooks/useTableSort";
import { useListMode } from "@/features/admin/hooks/useListMode";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/features/admin/hooks/useMediaQuery";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { NoticeResponseDTO } from "../dtos/noticeDto";
import { ROUTES } from "@/shared/constants/routes";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import { useUserNoticesInfiniteQuery } from "../hooks/useUserNoticesInfiniteQuery";

const SupportNoticesClient = () => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  // 1. 상태 관리: Query 객체를 상태로 관리
  const [query, setQuery] = useState<UserNoticesQuery>({
    page: 1,
    limit: USER_PAGE_SIZE.DEFAULT,
    search: "",
    searchField: USER_NOTICE_SEARCH_FIELD.TITLE,
    sort: USER_NOTICE_SORT.CREATED_AT,
    sortOrder: SORT_ORDER.DESC,
    filters: userNoticeInitialFilterValue,
  });

  const handleFilterChange = (key: UserNoticeFilterKey, value: FilterValue) => {
    setQuery((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const { sort, onSort } = useTableSort<UserNoticesQuery, UserNoticeSort>(
    query,
    setQuery,
  );

  const {
    isLoading,
    items: notices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,

    useQueryHook: useUserNoticesQuery,
    useInfiniteHook: useUserNoticesInfiniteQuery,
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

  const handleRowClick = (item: NoticeResponseDTO) => {
    router.push(`${ROUTES.SUPPORT_NOTICES}/${item._id}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <p className="text-muted-foreground text-sm">
          서비스의 주요 업데이트와 안내 사항을 확인하세요.
        </p>
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        {/* 🔹 검색 / 페이지 사이즈 컨트롤 */}
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={USER_NOTICE_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={USER_PAGE_SIZE_OPTIONS}
        />
        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={USER_NOTICE_FILTER_CONFIG}
          initialValue={userNoticeInitialFilterValue}
        />
        <AdminTable
          columns={userNoticeTableColumns}
          data={notices}
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

export default SupportNoticesClient;
