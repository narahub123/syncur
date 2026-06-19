"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import AdminSearchFieldSelect from "@/features/admin/components/AdminSearchFieldSelect";
import { UserNoticeQuery } from "../types/search";
import AdminSearchInput from "@/features/admin/components/AdminSearchInput";
import AdminPageSizeSelect from "@/features/admin/components/AdminPageSizeSelect";
import {
  USER_NOTICE_PAGE_SIZE_OPTIONS,
  USER_NOTICE_SEARCH_FIELD_OPTIONS,
} from "../constants/user-search";

type Props = {
  query: UserNoticeQuery;
  onChange: (value: UserNoticeQuery) => void;
};

const UserNoticeTableToolbar = ({ query, onChange }: Props) => {
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
          options={USER_NOTICE_SEARCH_FIELD_OPTIONS}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <AdminSearchInput value={search} onChange={(v) => setSearch(v)} />
      </div>
      <AdminPageSizeSelect
        value={query.limit}
        options={USER_NOTICE_PAGE_SIZE_OPTIONS}
        onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
      />
    </div>
  );
};

export default UserNoticeTableToolbar;
