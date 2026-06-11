"use client";

import { AdminUsersQuery } from "../types";
import AdminSearchFieldSelect from "../../components/AdminSearchFieldSelect";
import AdminSearchInput from "../../components/AdminSearchInput";
import AdminPageSizeSelect from "../../components/AdminPageSizeSelect";
import { ADMIN_USER_SEARCH_FIELD_OPTIONS } from "../constants/adminUserSearchSelect";
import { ADMIN_USER_PAGE_SIZE_OPTIONS } from "../constants/adminUserPageSizeSelect";

type Props = {
  query: AdminUsersQuery;
  onChange: (value: AdminUsersQuery) => void;
};

const AdminUsersTableToolbar = ({ query, onChange }: Props) => {
  return (
    <div className="flex items-center justify-around px-2">
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField}
          options={ADMIN_USER_SEARCH_FIELD_OPTIONS}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <AdminSearchInput
          value={query.search}
          onChange={(v) => onChange({ ...query, search: v, page: 1 })}
        />
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
