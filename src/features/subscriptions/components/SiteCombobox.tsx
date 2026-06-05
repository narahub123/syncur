"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";

import { Check, LoaderCircle, X } from "lucide-react";
import SiteAvatar from "./SiteAvatar";
import { SiteSearchDto } from "@/features/rss/site/dto/search-site";
import { useFeedDiscoveryStore } from "../store/feedDiscovery";

type SiteComboboxProps = {
  /**
   * 서버/외부 데이터에서 전달되는 site 검색 결과
   *
   * 역할:
   * - UI가 직접 fetch하지 않음
   * - server action 또는 React Query에서 가져온 결과
   * - 순수하게 "표시만" 담당
   */
  options: SiteSearchDto[];

  /**
   * 사용자가 입력한 검색어를 외부로 전달하는 트리거
   *
   * 역할:
   * - Combobox 내부에서 검색 실행하지 않음
   * - server action / query trigger로 위임
   * - debounce는 상위에서 처리하는 것이 권장됨
   */
  onSearch: (query: string) => void;

  /**
   * 사이트 선택 이벤트
   *
   * 역할:
   * - UI는 선택만 전달
   * - 실제 상태 변경 / discovery / subscribe는 외부에서 처리
   */
  onSelect: (site: SiteSearchDto) => void;

  /**
   * 입력값 (controlled input)
   *
   * 역할:
   * - input 값 유지 (사라지는 문제 해결)
   * - Combobox reset 방지
   */
  inputValue: string;

  /**
   * 입력값 업데이트
   *
   * 역할:
   * - typing state 관리
   */
  setInputValue: (value: string) => void;

  isLoading?: boolean;
};

const SiteCombobox = ({
  options,
  onSearch,
  onSelect,
  inputValue,
  setInputValue,
  isLoading,
}: SiteComboboxProps) => {
  const uiState = useFeedDiscoveryStore((s) => s.uiState);

  const isEmpty = !inputValue && options.length === 0;
  /**
   * Combobox는 view layer
   * 실제 상태는 외부(store)에서 관리
   */
  const handleValueChange = (value: string | null) => {
    if (!value) return;
    onSearch(value);
  };

  return (
    <Combobox onValueChange={handleValueChange}>
      {/* =========================
          INPUT (controlled)
         ========================= */}
      <ComboboxInput
        value={inputValue}
        placeholder="사이트를 입력해주세요."
        className="flex-1 text-sm"
        onChange={(e) => {
          const value = e.target.value;

          // 1. input 유지
          setInputValue(value);

          // 2. 검색 트리거
          onSearch(value);
        }}
        onKeyDown={(e) => {
          // Enter로 인한 reset / submit 방지
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />

      {!isEmpty && (
        <ComboboxContent>
          {/* =========================
            LIST (pure render layer)
           ========================= */}
          <ComboboxList>
            {isLoading && (
              <div className="flex min-h-20 items-center justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            )}
            {!isLoading &&
              options.length > 0 &&
              options.map((site) => (
                <ComboboxItem
                  key={site._id}
                  value={site.url}
                  onClick={() => {
                    /**
                     * 선택 이벤트:
                     * - 상태 변경 없음
                     * - store or parent에서 처리
                     */
                    onSelect(site);

                    /**
                     * UX 개선:
                     * 선택 시 input도 동기화
                     */
                    setInputValue(site.url);
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 items-center gap-2">
                      <SiteAvatar site={site} />
                      <span>{site.name}</span>
                    </div>
                    <span
                      className=""
                      aria-hidden="true"
                      title={`구독 ${site.feed_url ? "가능" : "불가"}`}
                    >
                      {site.feed_url ? <Check /> : <X />}
                    </span>
                  </div>
                </ComboboxItem>
              ))}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
};

export default SiteCombobox;
