import { Rss } from "lucide-react";
import ResponsiveActionButton from "./ResponsiveActionButton";

const SiteSubscriptionTrigger = () => {
  return (
    <ResponsiveActionButton
      icon={<Rss className="size-5 shrink-0" />}
      label="구독하기"
    />
  );
};

export default SiteSubscriptionTrigger;
