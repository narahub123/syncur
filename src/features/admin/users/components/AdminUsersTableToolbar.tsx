"use client";

import { AdminUsersQuery } from "../types";
import AdminSearchFieldSelect from "../../components/AdminSearchFieldSelect";
import AdminSearchInput from "../../components/AdminSearchInput";
import AdminPageSizeSelect from "../../components/AdminPageSizeSelect";
import { ADMIN_USER_SEARCH_FIELD_OPTIONS } from "../constants/adminUserSearchSelect";
import { ADMIN_USER_PAGE_SIZE_OPTIONS } from "../constants/adminUserPageSizeSelect";
import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";

type Props = {
  query: AdminUsersQuery;
  onChange: (value: AdminUsersQuery) => void;
};

const AdminUsersTableToolbar = ({ query, onChange }: Props) => {
  // 1. input local state
  const [search, setSearch] = useState(query.search);

  // 2. debounce
  const debouncedSearch = useDebounce(search, 300);

  // 3. debounce 이후 query 반영
  useEffect(() => {
    if (debouncedSearch === query.search) return;

    onChange({
      ...query,
      search: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch, onChange]);

  return (
    <div className="flex items-center justify-around px-2">
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField}
          options={ADMIN_USER_SEARCH_FIELD_OPTIONS}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <AdminSearchInput value={search} onChange={(v) => setSearch(v)} />
      </div>

      <AdminPageSizeSelect
        value={query.limit}
        options={ADMIN_USER_PAGE_SIZE_OPTIONS}
        onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
      />
    </div>
  );
};

export default AdminUsersTableToolbar;
