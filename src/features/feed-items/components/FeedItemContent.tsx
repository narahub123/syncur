import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";
import { FeedItemContentDto } from "@/features/feeds/dto/feedDto";
import Link from "next/link";
import { MouseEvent } from "react";

type Props = {
  item: FeedItemContentDto;
};

const FeedItemContent = ({ item }: Props) => {
  const { title, description, link, feedItemId } = item;
  const mutation = useFeedAction(feedItemId);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    mutation.mutate(FEED_ACTION.CONTENT_CLICK);

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Link
      href={link}
      target="_blank"
      onClick={handleClick}
      className="focus-visible:bg-accent hover:bg-accent mt-2 block pt-1 pb-1"
    >
      <div className="mt-3 mb-1 space-y-1 px-4">
        <p className="text-md line-clamp-1 font-medium">{title}</p>
        <p className="text-md line-clamp-3 break-after-all">{description}</p>
      </div>
    </Link>
  );
};

export default FeedItemContent;
