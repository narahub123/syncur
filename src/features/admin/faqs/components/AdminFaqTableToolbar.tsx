"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import AdminSearchFieldSelect from "../../components/AdminSearchFieldSelect";
import AdminSearchInput from "../../components/AdminSearchInput";
import AdminPageSizeSelect from "../../components/AdminPageSizeSelect";
import { AdminFaqsQuery } from "@/features/support/faqs/types/search";
import {
  ADMIN_FAQ_PAGE_SIZE_OPTIONS,
  ADMIN_FAQ_SEARCH_FIELD_OPTIONS,
} from "../constans";

type Props = {
  query: AdminFaqsQuery;
  onChange: (value: AdminFaqsQuery) => void;
};

const AdminFaqTableToolbar = ({ query, onChange }: Props) => {
  const [search, setSearch] = useState(query.search);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch === query.search) return;
    onChange({ ...query, search: debouncedSearch, page: 1 });
  }, [debouncedSearch, onChange]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField}
          options={ADMIN_FAQ_SEARCH_FIELD_OPTIONS}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <AdminSearchInput value={search} onChange={(v) => setSearch(v)} />
      </div>
      <AdminPageSizeSelect
        value={query.limit}
        options={ADMIN_FAQ_PAGE_SIZE_OPTIONS}
        onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
      />
    </div>
  );
};

export default AdminFaqTableToolbar;
