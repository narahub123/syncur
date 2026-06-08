import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";
import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import { formatFeedPublishedTime } from "@/shared/utils/date";
import Link from "next/link";
import { MouseEvent } from "react";

type Props = {
  meta: FeedItemMetaDto;
};

const FeedSourceCard = ({ meta }: Props) => {
  const { site, publishedAt, feedItemId } = meta;
  const { favicon_url, name, url } = site;

  const { display, full } = formatFeedPublishedTime(publishedAt);

  const mutation = useFeedAction(feedItemId);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    mutation.mutate(FEED_ACTION.SOURCE_CLICK);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={url}
        className="flex items-center gap-1"
        target="_blank"
        onClick={handleClick}
      >
        <img
          src={favicon_url ?? ""}
          alt=""
          className={"h-8 w-8 rounded-full object-contain"}
        />
        <span className="text-sm font-medium">{name}</span>
      </Link>
      <span title={full} className="text-xs">
        {display}
      </span>
    </div>
  );
};

export default FeedSourceCard;
