"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";

import { LoaderCircle } from "lucide-react";
import { SiteContextDTO } from "@/features/rss/site/dto/siteDto";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import { getSiteStatus } from "../domain/getSiteStatus";
import { Avatar } from "@/shared/components/common/Avartar";

type SiteComboboxProps = {
  /**
   * 서버/외부 데이터에서 전달되는 site 검색 결과
   *
   * 역할:
   * - UI가 직접 fetch하지 않음
   * - server action 또는 React Query에서 가져온 결과
   * - 순수하게 "표시만" 담당
   */
  options: SiteContextDTO[];

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
  onSelect: (site: SiteContextDTO) => void;

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
  const isEmpty = !inputValue && options.length === 0;
  /**
   * Combobox는 view layer
   * 실제 상태는 외부(store)에서 관리
   */
  const handleValueChange = (value: string | null) => {
    if (!value) return;
    onSearch(value);
  };

  const handleClick = (site: SiteContextDTO) => {
    console.log("handleClick 눌림");
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
  };

  return (
    <Combobox onValueChange={handleValueChange}>
      {/* =========================
          INPUT (controlled)
         ========================= */}
      <ComboboxInput
        value={inputValue}
        placeholder="관심 사이트를 등록하세요"
        className="flex-1"
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
              options.map((site) => {
                return (
                  <ComboboxItem
                    key={site.siteId}
                    value={site.url}
                    onClick={() => handleClick(site)}
                  >
                    <div className="flex w-full items-center justify-between">
                      {/* ===== 기본 영역 ===== */}
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Avatar
                          src={site.favicon_url}
                          name={site.name}
                          className="h-6 w-6"
                        />
                        <span className="truncate text-xs">{site.name}</span>
                      </div>

                      <SubscriptionStatusBadge status={getSiteStatus(site)} />
                    </div>

                    {/* ========================= Crawl 확장 영역 (핵심) ========================= */}
                    {site.listingPageCount != null &&
                      site.listingPageCount > 0 && (
                        <div className="mt-1 text-right text-[11px] text-gray-500">
                          구독 가능 페이지 {site.listingPageCount}개
                        </div>
                      )}

                    {site.subscribedListingPages &&
                      site.subscribedListingPages.length > 0 && (
                        <div className="mt-1 text-[11px] text-gray-600">
                          <div className="font-medium">구독 중</div>

                          <ul className="ml-2 list-disc">
                            {site.subscribedListingPages.map((p) => (
                              <li key={p.feedId}>{p.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </ComboboxItem>
                );
              })}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
};

export default SiteCombobox;
