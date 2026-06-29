"use client";

import { Rss } from "lucide-react";
import ResponsiveActionButton from "./ResponsiveActionButton";
import { forwardRef } from "react";

const SiteSubscriptionTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <ResponsiveActionButton
        icon={<Rss className="size-5 shrink-0" />}
        label="구독하기"
      />
    </div>
  );
});

SiteSubscriptionTrigger.displayName = "SiteSubscriptionTrigger";
export default SiteSubscriptionTrigger;
