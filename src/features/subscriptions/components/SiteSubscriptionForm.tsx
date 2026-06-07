"use client";

import SiteCombobox from "./SiteCombobox";
import SubscribeButton from "./SubscribeButton";
import SubscriptionStatusIndicator from "./SubscriptionStatusIndicator";

import { useSiteSubscriptionStore } from "../store/siteSubscriptionStore";

import { useSiteSearch } from "@/features/rss/site/hooks/useSiteSearch";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { SiteContextDTO } from "@/features/rss/site/dto/siteDto";

const SiteSubscriptionForm = () => {
  const selectSite = useSiteSubscriptionStore((s) => s.selectSite);
  const setNotSupported = useSiteSubscriptionStore((s) => s.setNotSupported);
  const setAlreadySubscribed = useSiteSubscriptionStore(
    (s) => s.setAlreadySubscribed,
  );
  const setIdle = useSiteSubscriptionStore((s) => s.setIdle);

  const inputValue = useSiteSubscriptionStore((s) => s.inputValue);
  const setInputValue = useSiteSubscriptionStore((s) => s.setInputValue);

  const debouncedInput = useDebounce(inputValue, 300);

  const { data: options, isFetching } = useSiteSearch(debouncedInput);

  console.log(options);

  const handleSelectSite = (site: SiteContextDTO) => {
    console.log("사이트 정보", site);
    selectSite(site);

    if (!site.rssAvailable) {
      setNotSupported();
      return;
    }

    if (site.isSubscribed) {
      setAlreadySubscribed();
      return;
    }

    setIdle();
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-4">
      <h3 className="h-6 text-sm font-medium">관심 사이트를 등록하세요</h3>

      {/* input + selection layer */}
      <div className="flex gap-3">
        <SiteCombobox
          options={options ?? []}
          onSearch={() => {}}
          onSelect={handleSelectSite}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isFetching}
        />

        <SubscribeButton isFetching={isFetching} />
      </div>

      {/* state feedback layer */}
      <SubscriptionStatusIndicator />
    </div>
  );
};

export default SiteSubscriptionForm;
