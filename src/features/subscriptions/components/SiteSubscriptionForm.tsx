"use client";

import SiteCombobox from "./SiteCombobox";
import SubscribeButton from "./SubscribeButton";
import StatusIndicator from "./StatusIndicator";

import { useFeedDiscoveryStore } from "../store/feedDiscovery";

import { useSiteSearch } from "@/features/rss/site/hooks/useSiteSearch";

const SiteSubscriptionForm = () => {
  const selectSite = useFeedDiscoveryStore((s) => s.selectSite);

  const inputValue = useFeedDiscoveryStore((s) => s.inputValue);
  const setInputValue = useFeedDiscoveryStore((s) => s.setInputValue);

  const { data: options, isFetching } = useSiteSearch(inputValue);

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-medium">
        사이트 주소를 입력해서 구독해보세요
      </h3>

      {/* input + selection layer */}
      <div className="flex gap-3">
        <SiteCombobox
          options={options ?? []}
          onSearch={() => {}}
          onSelect={selectSite}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isFetching}
        />

        <SubscribeButton isFetching={isFetching} />
      </div>

      {/* state feedback layer */}
      <StatusIndicator />
    </div>
  );
};

export default SiteSubscriptionForm;
