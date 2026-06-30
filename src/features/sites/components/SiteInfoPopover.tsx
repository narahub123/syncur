import SubscriptionToggleButton from "@/features/subscriptions/components/page/SubscriptionToggleButton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { MouseEvent, useState } from "react";
import { FeedItemSiteDto } from "../dto/siteDto";
import SiteLinkCard from "./SiteLinkCard";

type Props = {
  site: FeedItemSiteDto;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  feedId: string;
};

export function SiteInfoPopover({ site, onClick, feedId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="cursor-pointer"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <SiteLinkCard site={site} onClick={onClick} />
        </div>
      </PopoverTrigger>

      <PopoverContent
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 items-center justify-center gap-2">
            <SiteLinkCard site={site} onClick={onClick} />
          </div>

          <SubscriptionToggleButton feedId={feedId} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
