"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";

import type { WebSource } from "../types/feed-discovery";

type SiteComboboxProps = {
  /**
   * 서버/외부 데이터에서 전달되는 site 검색 결과
   *
   * 역할:
   * - UI가 직접 fetch하지 않음
   * - server action 또는 React Query에서 가져온 결과
   * - 순수하게 "표시만" 담당
   */
  options: WebSource[];

  /**
   * 사용자가 입력한 검색어를 외부로 전달하는 트리거
   *
   * 역할:
   * - Combobox 내부에서 검색 실행하지 않음
   * - server action / query trigger로 위임
   * - debounce는 상위에서 처리하는 것이 권장됨
   */
  onSearch: (query: string) => void;
};

const SiteCombobox = ({ options, onSearch }: SiteComboboxProps) => {
  const handleValueChange = (value: string | null) => {
    if (!value) return;
    onSearch(value);
  };

  return (
    <Combobox
      value=""
      /**
       * Combobox는 "view layer" 역할만 수행
       * 상태를 직접 가지지 않고 외부 입력만 반영
       */
      onValueChange={handleValueChange}
    >
      {/* 사용자 입력 영역 (검색 트리거 역할) */}
      <ComboboxInput
        placeholder="사이트를 입력해주세요."
        className="flex-1 text-sm"
      />

      <ComboboxContent>
        {/* 검색 결과가 없을 때 표시 UI */}
        <ComboboxEmpty>검색 결과가 없습니다.</ComboboxEmpty>

        {/* site 검색 결과 리스트 (pure render layer) */}
        <ComboboxList>
          {options.map((site) => (
            <ComboboxItem
              key={site.id}
              value={site.url}
              /**
               * 선택 이벤트는 "state machine"으로 전달
               * - 여기서는 상태 변경하지 않음
               * - store or parent handler에서 처리
               */
              onClick={() => {
                // WebSource 선택 이벤트 전달
                // 실제 상태 변경은 외부 (Zustand / action layer)
              }}
            >
              {site.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default SiteCombobox;
