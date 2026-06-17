"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import AdminSearchFieldSelect from "../../components/AdminSearchFieldSelect"; // 공통 컴포넌트 경로
import AdminSearchInput from "../../components/AdminSearchInput";
import AdminPageSizeSelect from "../../components/AdminPageSizeSelect";
import { AdminRequestQuery } from "@/features/support/requests/types/admin-search";
import {
  ADMIN_REQUEST_PAGE_SIZE_OPTIONS,
  ADMIN_REQUEST_SEARCH_FIELD_OPTIONS,
} from "@/features/support/requests/constants/admin-search";

type Props = {
  query: AdminRequestQuery;
  onChange: (value: AdminRequestQuery) => void;
};

const AdminBugReportTableToolbar = ({ query, onChange }: Props) => {
  const [search, setSearch] = useState(query.search || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch === query.search) return;
    onChange({ ...query, search: debouncedSearch, page: 1 });
  }, [debouncedSearch, onChange]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField || "title"}
          options={ADMIN_REQUEST_SEARCH_FIELD_OPTIONS}
          onChange={(v) =>
            onChange({
              ...query,
              searchField: v as AdminRequestQuery["searchField"],
              page: 1,
            })
          }
        />
        <AdminSearchInput value={search} onChange={(v) => setSearch(v)} />
      </div>
      <AdminPageSizeSelect
        value={query.limit}
        options={ADMIN_REQUEST_PAGE_SIZE_OPTIONS}
        onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
      />
    </div>
  );
};

export default AdminBugReportTableToolbar;
