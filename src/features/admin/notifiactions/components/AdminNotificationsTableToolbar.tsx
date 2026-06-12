import { useEffect, useState } from "react";
import { AdminNotificationsQuery } from "../types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import AdminSearchFieldSelect from "../../components/AdminSearchFieldSelect";
import AdminSearchInput from "../../components/AdminSearchInput";
import AdminPageSizeSelect from "../../components/AdminPageSizeSelect";
import {
  ADMIN_NOTIFICATION_PAGE_SIZE_OPTIONS,
  ADMIN_NOTIFICATION_SEARCH_FIELD_OPTIONS,
} from "../constants/search";
import ConfirmDialog from "@/shared/components/common/ConfirmDialog";
import { useMarkAllNotificationsAsReadMutation } from "../hooks/useMarkAllNotificationsAsReadMutation";
import { Button } from "@/shared/components/ui/button";

type Props = {
  query: AdminNotificationsQuery;
  onChange: (value: AdminNotificationsQuery) => void;
};

const AdminNotificationsTableToolbar = ({ query, onChange }: Props) => {
  // 1. input local state
  const [search, setSearch] = useState(query.search);
  const [open, setOpen] = useState(false);

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

  const readAllMutation = useMarkAllNotificationsAsReadMutation();

  const handleClick = () => {
    if (readAllMutation.isPending) return;
    readAllMutation.mutate();

    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={"일괄 읽음 처리"}
        description={"알림을 모두 읽음 처리를 하시겠습니까?"}
        confirm={"모두 읽음"}
        onConfirm={handleClick}
      />
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField}
          options={ADMIN_NOTIFICATION_SEARCH_FIELD_OPTIONS}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <AdminSearchInput value={search} onChange={(v) => setSearch(v)} />
      </div>

      <div className="flex items-center gap-2">
        <AdminPageSizeSelect
          value={query.limit}
          options={ADMIN_NOTIFICATION_PAGE_SIZE_OPTIONS}
          onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
        />
        <Button type="button" onClick={() => setOpen(true)} variant="outline">
          일괄 읽음
        </Button>
      </div>
    </div>
  );
};

export default AdminNotificationsTableToolbar;
