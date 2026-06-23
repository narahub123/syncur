"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminFaqsQuery } from "@/features/admin/faqs/hooks/useAdminFaqsQuery";
import AdminPagination from "../../components/AdminPagination"; // 기존 페이지네이션 컴포넌트
import {
  ADMIN_FAQ_FILTER_CONFIG,
  ADMIN_FAQ_PAGE_SIZE_OPTIONS,
  ADMIN_FAQ_SEARCH_FIELD_OPTIONS,
  AdminFaqFilterKey,
  adminFaqInitialFilterValue,
  AdminFaqSort,
  AdminFaqsQuery,
} from "../types/search";
import { FilterValue } from "../../constants/filters";
import { useTableSort } from "../../hooks/useTableSort";
import { FilterToolbar } from "../../components/FilterToolbar";
import { AdminTable } from "../../components/AdminTable";
import { adminFaqTableColumns } from "../constants/adminFaqTableColumns";
import { AdminStatsCard } from "../../components/AdminStatsCard";
import { getFaqStatusList } from "../constants/stats";
import { useListMode } from "../../hooks/useListMode";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useAdminFaqsInfiniteQuery } from "../hooks/useAdminFaqsInfiniteQuery";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { FaqWithUserDto } from "@/features/support/faqs/dtos";
import { AdminTableToolbar } from "../../components/AdminTableToolbar";

const AdminFAQsClient = () => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");
  // 1. 상태 관리: Query 객체를 상태로 관리
  const [query, setQuery] = useState<AdminFaqsQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "question",
    sort: "createdAt",
    sortOrder: "desc",
    filters: adminFaqInitialFilterValue,
  });

  const handleFilterChange = (key: AdminFaqFilterKey, value: FilterValue) => {
    setQuery((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const { sort, onSort } = useTableSort<AdminFaqsQuery, AdminFaqSort>(
    query,
    setQuery,
  );

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

    useQueryHook: useAdminFaqsQuery,
    useInfiniteHook: useAdminFaqsInfiniteQuery,
  });

  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  const faqs = items ?? [];
  const faqStats = stats ?? {
    totalCount: 0,
    publishedCount: 0,
    hiddenCount: 0,
    categoryCounts: {
      payment: 0,
      usage: 0,
      bug: 0,
      etc: 0,
    },
  };

  const totalPages = pagination?.totalPages ?? 1;

  const activeRate =
    faqStats.totalCount > 0
      ? (faqStats.publishedCount / faqStats.totalCount) * 100
      : 0;

  const handleRowClick = (item: FaqWithUserDto) => {
    router.push(`${ROUTES.ADMIN_FAQS}/${item._id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQ 관리</h1>
          <p className="text-muted-foreground text-sm">
            고객센터에 노출되는 자주 묻는 질문을 관리합니다.
          </p>
        </div>

        <Link
          href="/admin/faqs/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          + 새 FAQ 등록
        </Link>
      </div>

      <AdminStatsCard
        title="FAQs 현황"
        items={getFaqStatusList(faqStats)}
        progressValue={activeRate}
        total={faqStats.totalCount}
        isLoading={isLoading}
      />

      <div className="flex flex-1 flex-col space-y-2">
        <AdminTableToolbar
          query={query}
          onChange={setQuery}
          searchFieldOptions={ADMIN_FAQ_SEARCH_FIELD_OPTIONS}
          pageSizeOptions={ADMIN_FAQ_PAGE_SIZE_OPTIONS}
          isLoading={isLoading}
        />
        <FilterToolbar
          filters={query.filters}
          onChange={handleFilterChange}
          config={ADMIN_FAQ_FILTER_CONFIG}
          initialValue={adminFaqInitialFilterValue}
          isLoading={isLoading}
        />
        <AdminTable
          columns={adminFaqTableColumns}
          data={faqs}
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

export default AdminFAQsClient;
