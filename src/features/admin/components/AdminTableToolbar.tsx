import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useEffect, useState } from "react";
import AdminSearchFieldSelect from "./AdminSearchFieldSelect";
import AdminPageSizeSelect from "./AdminPageSizeSelect";

// 쿼리 객체가 반드시 가져야 할 필수 필드 정의
interface BaseQuery<SF, PS> {
  search: string;
  searchField: SF;
  limit: PS;
  page: number;
}

// Props 정의 (제네릭 추론을 위해 SF와 PS를 별도로 분리)
interface AdminTableToolbarProps<Q, SF, PS> {
  query: Q;
  onChange: (query: Q) => void;
  searchFieldOptions: { label: string; value: SF }[];
  pageSizeOptions: { label: string; value: PS }[];
  isLoading: boolean;
}

export const AdminTableToolbar = <
  SF extends string,
  PS extends number,
  Q extends BaseQuery<SF, PS>,
>(
  props: AdminTableToolbarProps<Q, SF, PS>,
) => {
  const { query, onChange, searchFieldOptions, pageSizeOptions, isLoading } =
    props;

  const [search, setSearch] = useState(query.search);
  const debouncedSearch = useDebounce(search, 300);

  // 로직: 검색어 변경 시 디바운싱 처리 (기존 로직 그대로)
  useEffect(() => {
    if (debouncedSearch === query.search) return;
    onChange({ ...query, search: debouncedSearch, page: 1 });
  }, [debouncedSearch, onChange, query]);

  if (isLoading) return <AdminTableToolbarSkeleton />;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <AdminSearchFieldSelect
          value={query.searchField}
          options={searchFieldOptions}
          onChange={(v) => onChange({ ...query, searchField: v, page: 1 })}
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
      </div>
      <div>
        <AdminPageSizeSelect
          value={query.limit}
          options={pageSizeOptions}
          onChange={(v) => onChange({ ...query, limit: v, page: 1 })}
        />
      </div>
    </div>
  );
};

export function AdminTableToolbarSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between px-2">
      {/* 왼쪽: 필드 선택 및 검색 입력창 */}
      <div className="flex items-center gap-2">
        {/* AdminSearchFieldSelect 대응 */}
        <div className="h-10 w-32 rounded-md bg-gray-200" />

        {/* Input 대응 */}
        <div className="h-10 w-64 rounded-md bg-gray-200" />
      </div>

      {/* 오른쪽: 페이지 사이즈 선택 */}
      <div className="h-10 w-24 rounded-md bg-gray-200" />
    </div>
  );
}
