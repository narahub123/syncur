"use client";

import SiteCombobox from "./SiteCombobox";
import SubscribeButton from "./SubscribeButton";
import SubscriptionStatusIndicator from "./SubscriptionStatusIndicator";

import { useSiteSubscriptionStore } from "../store/siteSubscriptionStore";

import { useSiteSearch } from "@/features/sites/hooks/useSiteSearch";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { SiteContextDTO } from "@/features/sites/dto/siteDto";
import { SITE_FEED_STATUS } from "@/features/sites/constants/site";
import CrawlDialog from "./CrawlDialog";

const SiteSubscriptionForm = () => {
  const selectSite = useSiteSubscriptionStore((s) => s.selectSite);
  const setNotSupported = useSiteSubscriptionStore((s) => s.setNotSupported);
  const setAlreadySubscribed = useSiteSubscriptionStore(
    (s) => s.setAlreadySubscribed,
  );
  const setIdle = useSiteSubscriptionStore((s) => s.setIdle);
  const crawlDialogOpen = useSiteSubscriptionStore((s) => s.crawlDialogOpen);
  const setCrawlDialogOpen = useSiteSubscriptionStore(
    (s) => s.setCrawlDialogOpen,
  );

  const inputValue = useSiteSubscriptionStore((s) => s.inputValue);
  const setInputValue = useSiteSubscriptionStore((s) => s.setInputValue);

  const debouncedInput = useDebounce(inputValue, 300);

  const { data: options, isFetching } = useSiteSearch(debouncedInput);

  console.log("검색 결과", options);

  const handleSelectSite = (site: SiteContextDTO) => {
    selectSite(site);

    if (site.feedStatus === SITE_FEED_STATUS.CRAWLABLE) {
      setCrawlDialogOpen(true);
      return;
    }

    if (site.feedStatus === SITE_FEED_STATUS.UNAVAILABLE) {
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
      <CrawlDialog open={crawlDialogOpen} onOpenChange={setCrawlDialogOpen} />
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
