import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";
import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import { SiteInfoPopover } from "@/features/rss/site/components/SiteInfoPopover";
import { formatFeedPublishedTime } from "@/shared/utils/date";
import { MouseEvent } from "react";

type Props = {
  meta: FeedItemMetaDto;
};

const FeedSourceCard = ({ meta }: Props) => {
  const { site, publishedAt, feedItemId } = meta;

  console.log("feedItemId", feedItemId);
  const { display, full } = formatFeedPublishedTime(publishedAt);

  const mutation = useFeedAction(feedItemId);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    mutation.mutate(FEED_ACTION.SOURCE_CLICK);

    window.open(site.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-1">
      <SiteInfoPopover site={site} onClick={handleClick} feedId={meta.feedId} />
      <span title={full} className="text-xs">
        {display}
      </span>
    </div>
  );
};

export default FeedSourceCard;
