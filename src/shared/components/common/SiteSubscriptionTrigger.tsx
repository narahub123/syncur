import { Rss } from "lucide-react";

const SiteSubscriptionTrigger = () => {
  return (
    <div className="flex size-12 items-center justify-center rounded-full border border-gray-200 xl:h-auto xl:w-full xl:justify-start xl:gap-2 xl:rounded-none xl:border-0">
      <Rss className="size-5 shrink-0" />

      <span className="hidden xl:inline">구독하기</span>
    </div>
  );
};

export default SiteSubscriptionTrigger;
