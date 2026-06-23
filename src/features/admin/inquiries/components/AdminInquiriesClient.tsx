"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminPagination from "../../components/AdminPagination";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { AdminTableToolbar } from "@/features/admin/components/AdminTableToolbar";
import { FilterToolbar } from "../../components/FilterToolbar";

import { useMediaQuery } from "@/features/admin/hooks/useMediaQuery";
import { useListMode } from "@/features/admin/hooks/useListMode";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useTableSort } from "@/features/admin/hooks/useTableSort";

import { ROUTES } from "@/shared/constants/routes";

import { useAdminInquiriesQuery } from "../hooks/useAdminInquiriesQuery";
import { useAdminInquiriesInfiniteQuery } from "../hooks/useAdminInquiriesInfiniteQuery";

import { adminInquiryTableColumns } from "../constants/adminInquiryTableColumns";

import {
  InquiryQuery,
  INQUIRY_SEARCH_FIELD,
  INQUIRY_SORT,
  INQUIRY_PAGE_SIZE,
  INQUIRY_PAGE_SIZE_OPTIONS,
  INQUIRY_SEARCH_FIELD_OPTIONS,
  INQUIRY_FILTER_CONFIG,
  INQUIRY_INITIAL_FILTER_VALUE,
  InquirySort,
  InquiryFilterKey,
} from "../types/search";

import { FilterValue } from "@/features/admin/constants/filters";
import { AdminInquiryResponseDTO } from "../dto/inquiryDto";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import {
  defaultInquiryStats,
  getInquiryStatusList,
} from "@/features/support/inquiries/constants/stats";
import { AdminStatsCard } from "../../components/AdminStatsCard";

const AdminInquiriesClient = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [query, setQuery] = useState<InquiryQuery>({
    page: 1,
    limit: INQUIRY_PAGE_SIZE.DEFAULT,
    search: "",
    searchField: INQUIRY_SEARCH_FIELD.TITLE,
    sort: INQUIRY_SORT.CREATED_AT,
    sortOrder: "desc",
    filters: INQUIRY_INITIAL_FILTER_VALUE,
  });

  /**
   * =========================
   * 필터 변경
   * =========================
   */
  const handleFilterChange = (key: InquiryFilterKey, value: FilterValue) => {
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
   * 정렬
   * =========================
   */
  const { sort, onSort } = useTableSort<InquiryQuery, InquirySort>(
    query,
    setQuery,
  );

  /**
   * =========================
   * 데이터 모드 (pagination / infinite)
   * =========================
   */
  const {
    isLoading,
    items: inquiries,
    stats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    pagination,
  } = useListMode({
    isMobile,
    query,
    useQueryHook: useAdminInquiriesQuery,
    useInfiniteHook: useAdminInquiriesInfiniteQuery,
  });

  const inquiryStats = stats ?? defaultInquiryStats;
  const totalPages = pagination?.totalPages ?? 1;

  const completedRate =
    inquiryStats.total > 0
      ? (inquiryStats.completed / inquiryStats.total) * 100
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
  const handleRowClick = (item: AdminInquiryResponseDTO) => {
    router.push(`${ROUTES.ADMIN_INQUIRIES}/${item._id}`);
  };

  return (
    <div className="w-full space-y-4 p-6">
      <h1 className="mb-6 text-2xl font-bold">1:1 문의 관리</h1>

      <AdminStatsCard
        title="1:1 문의 현황"
        items={getInquiryStatusList(inquiryStats)}
        progressValue={completedRate}
        total={inquiryStats.total}
      />

      <div className="flex flex-1 flex-col space-y-4">
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={INQUIRY_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={INQUIRY_PAGE_SIZE_OPTIONS}
        />

        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={INQUIRY_FILTER_CONFIG}
          initialValue={INQUIRY_INITIAL_FILTER_VALUE}
        />

        <AdminTable
          columns={adminInquiryTableColumns}
          data={inquiries}
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

export default AdminInquiriesClient;
