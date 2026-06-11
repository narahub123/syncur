"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getPaginationRange } from "../utils/getPaginationRange";
import AdminPaginationButton from "./AdminPaginationButton";
import AdminPaginationPopover from "./AdminPaginationPopover";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function AdminPagination({ page, totalPages, onChange }: Props) {
  const range = getPaginationRange(page, totalPages, 10);

  return (
    <nav
      className="flex items-center justify-between px-2 py-3"
      aria-label="Pagination Navigation"
    >
      {/* LEFT FIXED CONTROLS */}
      <div className="flex gap-1">
        <AdminPaginationButton
          ariaLabel="첫 페이지로"
          title="첫 페이지로"
          disabled={page === 1}
          onClick={() => onChange(1)}
        >
          <ChevronsLeft size={16} />
        </AdminPaginationButton>

        <AdminPaginationButton
          ariaLabel="이전 페이지"
          title="이전 페이지"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </AdminPaginationButton>
      </div>

      {/* PAGE NUMBERS */}
      <div className="flex gap-1">
        {range.map((item) =>
          item === "..." ? (
            <AdminPaginationPopover key="ellipsis" />
          ) : (
            <AdminPaginationButton
              key={`page-${item}`}
              active={item !== page}
              disabled={item === page}
              onClick={() => onChange(item)}
              ariaLabel={`${item}페이지로 이동`}
              title={`${item}페이지로 이동`}
            >
              {item}
            </AdminPaginationButton>
          ),
        )}
      </div>

      {/* RIGHT FIXED CONTROLS */}
      <div className="flex gap-1">
        <AdminPaginationButton
          ariaLabel="다음 페이지"
          title="다음 페이지"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={16} />
        </AdminPaginationButton>
        <AdminPaginationButton
          ariaLabel="마지막 페이지로"
          title="마지막 페이지로 이동"
          disabled={page === totalPages}
          onClick={() => onChange(totalPages)}
        >
          <ChevronsRight size={16} />
        </AdminPaginationButton>
      </div>
    </nav>
  );
}
