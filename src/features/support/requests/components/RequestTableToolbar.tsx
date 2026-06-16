"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import AdminSearchFieldSelect from "@/features/admin/components/AdminSearchFieldSelect";
import AdminPageSizeSelect from "@/features/admin/components/AdminPageSizeSelect";
import AdminSearchInput from "@/features/admin/components/AdminSearchInput";
import { UserRequestQuery } from "../../notices/types/user-search";
import {
  REQUEST_PAGE_SIZE_OPTIONS,
  REQUEST_SEARCH_FIELD_OPTIONS,
} from "../constants/search";

type Props = {
  query: UserRequestQuery;
  onChange: (value: UserRequestQuery) => void;
};

const RequestTableToolbar = ({ query, onChange }: Props) => {
  const [search, setSearch] = useState(query.search || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch === query.search) return;
    onChange({ ...query, search: debouncedSearch, page: 1 });
  }, [debouncedSearch, onChange]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        {/* 검색 필드 선택 */}
        <AdminSearchFieldSelect
          value={query.searchField || "title"}
          options={REQUEST_SEARCH_FIELD_OPTIONS}
          onChange={(v) =>
            onChange({
              ...query,
              searchField: v as UserRequestQuery["searchField"],
              page: 1,
            })
          }
        />
        {/* 검색어 입력 */}
        <AdminSearchInput value={search} onChange={(v) => setSearch(v)} />
      </div>

      <div className="flex items-center gap-2">
        {/* 페이지 사이즈 선택 */}
        <AdminPageSizeSelect
          value={query.limit}
          options={REQUEST_PAGE_SIZE_OPTIONS}
          onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
        />
      </div>
    </div>
  );
};

export default RequestTableToolbar;
