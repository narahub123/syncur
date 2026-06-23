"use client";

import { useAdminNoticesQuery } from "@/features/admin/notices/hooks/useAdminNoticesQuery";
import Link from "next/link";
import { useState } from "react";
import AdminPagination from "../../components/AdminPagination";
import {
  ADMIN_NOTICE_FILTER_CONFIG,
  ADMIN_NOTICE_SEARCH_FIELD,
  ADMIN_NOTICE_SEARCH_FIELD_OPTIONS,
  ADMIN_NOTICE_SORT,
  ADMIN_PAGE_SIZE,
  AdminNoticeFilterKey,
  adminNoticeInitialFilterValue,
  AdminNoticeQuery,
  AdminNoticeSort,
} from "../types/search";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SORT_ORDER } from "@/shared/types/pagination";
import { FilterValue } from "../../constants/filters";
import { useTableSort } from "../../hooks/useTableSort";
import { ROUTES } from "@/shared/constants/routes";
import { FilterToolbar } from "../../components/FilterToolbar";
import { adminNoticeTableColumns } from "../constants/adminNoticeTableColumns";
import { AdminTable } from "../../components/AdminTable";
import { AdminNoticeResponseDTO } from "@/features/support/notices/dtos/noticeDto";
import { useListMode } from "../../hooks/useListMode";
import { useAdminNoticesInfiniteQuery } from "../hooks/useAdminNoticesInfiniteQuery";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import { AdminTableToolbar } from "../../components/AdminTableToolbar";
import { ADMIN_NOTICE_PAGE_SIZE_OPTIONS } from "@/features/support/notices/constants/search";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { defaultNoticeStats, getNoticeStatusList } from "../constants/stats";

const AdminNoticesClient = () => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  // 1. 상태 관리: Query 객체를 상태로 관리
  const [query, setQuery] = useState<AdminNoticeQuery>({
    page: 1,
    limit: ADMIN_PAGE_SIZE.DEFAULT,
    search: "",
    searchField: ADMIN_NOTICE_SEARCH_FIELD.TITLE,
    sort: ADMIN_NOTICE_SORT.CREATED_AT,
    sortOrder: SORT_ORDER.DESC,
    filters: adminNoticeInitialFilterValue,
  });

  const handleFilterChange = (
    key: AdminNoticeFilterKey,
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

  const { sort, onSort } = useTableSort<AdminNoticeQuery, AdminNoticeSort>(
    query,
    setQuery,
  );
  const {
    isLoading,
    items: notices,
    stats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,

    useQueryHook: useAdminNoticesQuery,
    useInfiniteHook: useAdminNoticesInfiniteQuery,
  });

  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  console.log(stats);
  const noticeStats = stats ?? defaultNoticeStats;

  const totalPages = pagination?.totalPages ?? 1;

  const activeRate =
    noticeStats.totalCount > 0
      ? (noticeStats.activeCount / noticeStats.totalCount) * 100
      : 0;

  const handleRowClick = (item: AdminNoticeResponseDTO) => {
    router.push(`${ROUTES.ADMIN_NOTICES}/${item._id}`);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">공지사항 관리</h1>
          <p className="text-muted-foreground text-sm">
            공지 사항을 관리합니다.
          </p>
        </div>

        <Link
          href={`${ROUTES.ADMIN_NOTICES}/new`}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          + 새 공지 등록
        </Link>
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        <AdminStatsCard
          title="공지사항 현황"
          items={getNoticeStatusList(noticeStats)}
          progressValue={activeRate}
          total={noticeStats.totalCount}
          isLoading={isLoading}
        />
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={ADMIN_NOTICE_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={ADMIN_NOTICE_PAGE_SIZE_OPTIONS}
          isLoading={isLoading}
        />
        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={ADMIN_NOTICE_FILTER_CONFIG}
          initialValue={adminNoticeInitialFilterValue}
          isLoading={isLoading}
        />
        <AdminTable
          columns={adminNoticeTableColumns}
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

export default AdminNoticesClient;
