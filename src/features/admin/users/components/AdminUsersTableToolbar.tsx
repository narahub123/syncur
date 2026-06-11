"use client";

import AdminUserPageSizeSelect from "./AdminUserPageSizeSelect";
import AdminUserSortSelect from "./AdminUserSortSelect";
import AdminUserSearchInput from "./AdminUserSearchInput";
import AdminUserSearchFieldSelect from "./AdminUserSearchFieldSelect";
import { AdminUsersQuery } from "../types";

type Props = {
  query: AdminUsersQuery;
  onChange: (value: AdminUsersQuery) => void;
};

const AdminUsersTableToolbar = ({ query, onChange }: Props) => {
  return (
    <div className="flex items-center justify-around px-2">
      <AdminUserSearchFieldSelect
        value={query.searchField}
        onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
      />

      <AdminUserSearchInput
        value={query.search}
        onChange={(v) => onChange({ ...query, search: v, page: 1 })}
      />

      <AdminUserSortSelect
        value={query.sort}
        onChange={(v) => onChange({ ...query, sort: v })}
      />

      <AdminUserPageSizeSelect
        value={query.limit}
        onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
      />
    </div>
  );
};

export default AdminUsersTableToolbar;
