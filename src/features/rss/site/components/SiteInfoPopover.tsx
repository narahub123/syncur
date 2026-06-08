import { SiteDto } from "@/features/feeds/dto/feedDto";
import SubscriptionToggleButton from "@/features/subscriptions/components/page/SubscriptionToggleButton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import Link from "next/link";
import { MouseEvent, useState } from "react";

type Props = {
  site: SiteDto;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  feedId: string;
};

export function SiteInfoPopover({ site, onClick, feedId }: Props) {
  const [open, setOpen] = useState(false);
  const { favicon_url, name, url } = site;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="cursor-pointer"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href={url}
            className="flex items-center gap-1"
            target="_blank"
            onClick={onClick}
          >
            <img
              src={favicon_url ?? ""}
              alt=""
              className={"h-8 w-8 rounded-full object-contain"}
            />
            <span className="text-sm font-medium">{name}</span>
          </Link>
        </div>
      </PopoverTrigger>

      <PopoverContent
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              href={url}
              className="flex items-center gap-1"
              target="_blank"
              onClick={onClick}
            >
              <img
                src={favicon_url ?? ""}
                alt=""
                className={"h-8 w-8 rounded-full object-contain"}
              />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          </div>

          <SubscriptionToggleButton feedId={feedId} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
