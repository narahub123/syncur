import AdminPageSizeSelect from "../../components/AdminPageSizeSelect";
import AdminSearchFieldSelect from "../../components/AdminSearchFieldSelect";
import AdminSearchInput from "../../components/AdminSearchInput";
import { ADMIN_FEED_PAGE_SIZE_OPTIONS } from "../constants/adminFeedPageSize";
import { ADMIN_FEED_SEARCH_FIELD_OPTIONS } from "../constants/adminFeedSearchField";

import { AdminFeedsQuery } from "../types";

type Props = {
  query: AdminFeedsQuery;
  onChange: (value: AdminFeedsQuery) => void;
};

const AdminFeedTableToobar = ({ query, onChange }: Props) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField}
          options={ADMIN_FEED_SEARCH_FIELD_OPTIONS}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <AdminSearchInput
          value={query.search}
          onChange={(v) => onChange({ ...query, search: v, page: 1 })}
        />
      </div>

      <AdminPageSizeSelect
        value={query.limit}
        options={ADMIN_FEED_PAGE_SIZE_OPTIONS}
        onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
      />
    </div>
  );
};

export default AdminFeedTableToobar;
