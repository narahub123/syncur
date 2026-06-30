"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NotificationPagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 표시할 페이지 번호 계산 로직
  const getPages = () => {
    const pages = [];
    const showMax = 5; // 한 번에 보여줄 최대 번호 개수

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // 시작과 끝 번호 조절 (현재 페이지 기준)
      let start = Math.max(1, page - 2);
      const end = Math.min(totalPages, start + 4);

      if (end === totalPages) start = Math.max(1, end - 4);

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center space-x-2 py-4">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      {/* 페이지 번호 - 데스크탑에서 보임 */}
      <div className="hidden items-center space-x-2 sm:flex">
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
              page === p
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-500"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 모바일용 현재 상태 표시 */}
      <div className="flex items-center px-4 text-sm font-medium text-gray-600 sm:hidden">
        <span className="text-blue-600">{page}</span>
        <span className="mx-1">/</span>
        <span>{totalPages}</span>
      </div>

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
